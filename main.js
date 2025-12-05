const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');
const cookie = require('cookie');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const { createCanvas, loadImage, Image } = require('canvas');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'state.json');
const LOCK_DIR = path.join(__dirname, 'data', 'locks');
const REDIS_URL = process.env.REDIS_URL || process.env.REDIS;
const LOCK_TIMEOUT_MS = 2 * 60 * 1000;
const SESSION_COOKIE_NAME = 'sessionId';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DEFAULT_SALES_USERNAME = process.env.SALES_USERNAME || 'sales';
const DEFAULT_SALES_PASSWORD = process.env.SALES_PASSWORD || 'sales123';
const PASSWORD_SALT_ROUNDS = 10;

const app = express();
const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '12mb';
const MAX_MERCH_IMAGE_BYTES = 10 * 1024 * 1024;
const MERCH_IMAGE_DIR = path.join(__dirname, 'public', 'uploads', 'merch');
const MERCH_IMAGE_URL_PREFIX = '/uploads/merch';
const BACKUP_DIR = path.join(__dirname, 'data', 'backups');
const CHECKIN_LOG_LIMIT = 5000;
const AUDIT_LOG_LIMIT = 3000;
const AUTO_BACKUP_LIMIT = 20;
const AUTO_BACKUP_INTERVAL_MS = 15 * 60 * 1000;
const CERT_DIR = path.join(__dirname, 'certs');
const CERT_KEY_PATH = process.env.SSL_KEY || path.join(CERT_DIR, 'key.pem');
const CERT_CERT_PATH = process.env.SSL_CERT || path.join(CERT_DIR, 'cert.pem');
let redisClient = null;
let redisAvailable = false;

const createServerWithTls = () => {
  try {
    if (fsSync.existsSync(CERT_KEY_PATH) && fsSync.existsSync(CERT_CERT_PATH)) {
      const credentials = {
        key: fsSync.readFileSync(CERT_KEY_PATH),
        cert: fsSync.readFileSync(CERT_CERT_PATH),
      };
      const httpsServer = https.createServer(credentials, app);
      return { server: httpsServer, isHttps: true };
    }
  } catch (error) {
    console.warn('HTTPS 证书读取失败，回退到 HTTP：', error.message);
  }
  return { server: http.createServer(app), isHttps: false };
};

const { server, isHttps } = createServerWithTls();
const io = new Server(server);

const ensureMerchOrderNumber = () => {
  ensureMerchState();
  if (!state.merch._orderNoSeed) {
    state.merch._orderNoSeed = 0;
  }
};

const nextMerchOrderNumber = async () => {
  ensureMerchOrderNumber();
  const prefix = '297';
  const generateBase = async () => {
    const now = Date.now();
    const baseDate = Date.parse('2024-01-01T00:00:00Z');
    const seconds = Math.max(0, Math.floor((now - baseDate) / 1000));

    // 如有 Redis，用全局自增生成 9 位序列
    await ensureRedis();
    let seq = null;
    if (redisAvailable && redisClient) {
      try {
        seq = await redisClient.incr('merch:order-seq');
      } catch {
        seq = null;
      }
    }
    if (seq == null) {
      seq = (state.merch._orderNoSeed = (state.merch._orderNoSeed + 1) % 1_000_000_000);
    }
    const seq9 = `${seq % 1_000_000_000}`.padStart(9, '0'); // 9 digits
    const middle = `${seconds}`.padStart(6, '0').slice(-6) + seq9.slice(-3); // 保留时间特征+序列低 3 位
    return prefix + middle;
  };
  const computeCheckDigit = (digits) => {
    const weights = [3, 7, 1, 9, 5, 8, 4, 2, 6, 3, 7, 1];
    const sum = digits
      .split('')
      .map((d, i) => Number(d) * weights[i])
      .reduce((a, b) => a + b, 0);
    return (11 - (sum % 11)) % 10;
  };
  let attempts = 0;
  while (attempts < 5) {
    const base12 = await generateBase();
    const check = computeCheckDigit(base12);
    const full = `${base12}${check}`;
    const exists = state.merch.orders.some((o) => o.orderNumber === full);
    if (!exists) return full;
    attempts += 1;
  }
  // fallback random
  const randomMiddle = `${Math.floor(Math.random() * 1e9)}`.padStart(9, '0');
  const base12 = prefix + randomMiddle;
  const check = computeCheckDigit(base12);
  return `${base12}${check}`;
};

const ensureOrderHasNumber = async (order) => {
  if (!order) return order;
  if (!order.orderNumber) {
    order.orderNumber = await nextMerchOrderNumber();
  }
  return order;
};

app.use(express.json({ limit: JSON_BODY_LIMIT }));

/**
 * @typedef {Object} Seat
 * @property {number} row
 * @property {number} col
 * @property {'disabled'|'available'|'locked'|'sold'} status
 * @property {number|null} price
 * @property {string|null} ticketCode
 * @property {string|null} seatLabel
 * @property {string|null} lockedBy
 * @property {number|null} lockExpiresAt
 * @property {number|null} issuedAt
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {number} rows
 * @property {number} cols
 * @property {number} createdAt
 * @property {number} updatedAt
 * @property {Record<string, Seat>} seats
 */

/** @type {{
 *  projects: Record<string, Project>,
 *  accounts: Record<string, {username: string, passwordHash: string, role:'admin'|'sales'}>,
 *  merch?: {
 *    products: Record<string, any>,
 *    checkoutModes: Record<string, any>,
 *    orders: Array<any>
 *  },
 *  auditLog?: Array<any>
 * }} */
let state = { projects: {}, accounts: {}, merch: undefined };

/** @type {Map<string, {role:'admin'|'sales', username: string, createdAt: number}>} */
const sessions = new Map();

const seatId = (row, col) => `r${row}-c${col}`;

const PRICE_COLORS = [
  '#2B8A3E',
  '#20639B',
  '#ED553B',
  '#6F42C1',
  '#3CAEA3',
  '#F6AE2D',
  '#FF6B6B',
  '#4C72B0',
  '#9E2B25',
  '#20BF55',
];

const ensureProjectMetadata = (project) => {
  if (!project.priceColorAssignments || typeof project.priceColorAssignments !== 'object') {
    project.priceColorAssignments = {};
  }
  if (!project.seatLabelProgress || typeof project.seatLabelProgress !== 'object') {
    project.seatLabelProgress = {};
  }
};

const ensureMerchState = () => {
  if (!state.merch || typeof state.merch !== 'object') {
    state.merch = { products: {}, checkoutModes: {}, orders: [] };
  }
  if (!state.merch.products || typeof state.merch.products !== 'object') {
    state.merch.products = {};
  }
  if (!state.merch.checkoutModes || typeof state.merch.checkoutModes !== 'object') {
    state.merch.checkoutModes = {};
  }
  if (!Array.isArray(state.merch.orders)) {
    state.merch.orders = [];
  }
  if (!Object.keys(state.merch.checkoutModes).length) {
    const defaultModeId = uuidv4();
    state.merch.checkoutModes[defaultModeId] = {
      id: defaultModeId,
      name: '原价',
      type: 'standard',
      value: 1,
      threshold: null,
      cutAmount: null,
      stackLimit: null,
      description: '按标价结算',
      enabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }
};

const ensureAuditState = () => {
  if (!Array.isArray(state.auditLog)) {
    state.auditLog = [];
  }
};

const listBackups = async () => {
  try {
    await ensureBackupDir();
    const files = await fs.readdir(BACKUP_DIR);
    const enriched = await Promise.all(
      files
        .filter((name) => name.endsWith('.json'))
        .map(async (name) => {
          try {
            const stat = await fs.stat(path.join(BACKUP_DIR, name));
            return { name, mtime: stat.mtimeMs };
          } catch {
            return { name, mtime: null };
          }
        })
    );
    return enriched.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
  } catch {
    return [];
  }
};

const ensureMerchImageDir = async () => {
  await fs.mkdir(MERCH_IMAGE_DIR, { recursive: true });
};

const ensureLockDir = async () => {
  await fs.mkdir(LOCK_DIR, { recursive: true });
};

const ensureRedis = async () => {
  if (redisAvailable || !REDIS_URL) return null;
  try {
    const { createClient } = require('redis');
    redisClient = createClient({ url: REDIS_URL });
    redisClient.on('error', (err) => console.warn('Redis error:', err.message));
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    redisAvailable = true;
    console.log('Redis 连接成功，用于锁与序列号');
  } catch (error) {
    console.warn('Redis 不可用，回退文件锁/本地序列：', error.message);
    redisAvailable = false;
    redisClient = null;
  }
  return redisClient;
};

const sanitizeLockKey = (key) => key.replace(/[^\w.-]/g, '_').slice(0, 120) || 'lock';

// 文件锁 + Redis 锁（优先 Redis，回退本机文件锁）
const ensureCheckinLogs = () => {
  if (!Array.isArray(state.checkInLogs)) {
    state.checkInLogs = [];
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const acquireLock = async (key, { ttl = 5000, retry = 50, delay = 30 } = {}) => {
  // Redis 分布式锁优先
  await ensureRedis();
  if (redisAvailable && redisClient) {
    const lockKey = `lock:${sanitizeLockKey(key)}`;
    for (let i = 0; i < retry; i += 1) {
      try {
        const ok = await redisClient.set(lockKey, '1', { NX: true, PX: ttl });
        if (ok) {
          const released = { value: false };
          return async () => {
            if (released.value) return;
            released.value = true;
            try {
              await redisClient.del(lockKey);
            } catch {
              /* ignore */
            }
          };
        }
      } catch {
        /* ignore */
      }
      await sleep(delay);
    }
    throw new Error('锁等待超时，请稍后重试');
  }

  // 文件锁回退（同机共享）
  await ensureLockDir();
  const file = path.join(LOCK_DIR, `${sanitizeLockKey(key)}.lock`);
  for (let i = 0; i < retry; i += 1) {
    try {
      const handle = await fs.open(file, 'wx');
      await handle.writeFile(String(Date.now() + ttl));
      await handle.close();
      const released = { value: false };
      return async () => {
        if (released.value) return;
        released.value = true;
        try {
          await fs.unlink(file);
        } catch {
          /* ignore */
        }
      };
    } catch {
      // 已被占用，检查过期
      try {
        const text = await fs.readFile(file, 'utf8').catch(() => null);
        const expire = Number(text) || 0;
        if (expire && expire < Date.now()) {
          await fs.unlink(file).catch(() => {});
          continue;
        }
      } catch {
        /* ignore */
      }
      await sleep(delay);
    }
  }
  throw new Error('锁等待超时，请稍后重试');
};

const isTicketDuplicate = (project, ticketNumber, selfSeatId) => {
  if (!ticketNumber) return false;
  const norm = String(ticketNumber).trim().toUpperCase();
  return Object.entries(project.seats || {}).some(([id, seat]) => {
    if (id === selfSeatId) return false;
    const t1 = typeof seat.ticketNumber === 'string' ? seat.ticketNumber.trim().toUpperCase() : '';
    const t2 = typeof seat.ticketCode === 'string' ? seat.ticketCode.trim().toUpperCase() : '';
    return norm && (norm === t1 || norm === t2);
  });
};

const appendCheckinLog = (entry) => {
  ensureCheckinLogs();
  state.checkInLogs.unshift(entry);
  if (state.checkInLogs.length > CHECKIN_LOG_LIMIT) {
    state.checkInLogs.length = CHECKIN_LOG_LIMIT;
  }
};

const appendAudit = (entry) => {
  ensureAuditState();
  const record = {
    id: uuidv4(),
    createdAt: Date.now(),
    actor: entry.actor || 'system',
    action: entry.action || 'unknown',
    detail: entry.detail || '',
  };
  state.auditLog.unshift(record);
  if (state.auditLog.length > AUDIT_LOG_LIMIT) {
    state.auditLog.length = AUDIT_LOG_LIMIT;
  }
};

const ensureSeatCheckinState = (seat) => {
  if (!seat || typeof seat !== 'object') return;
  if (!Object.prototype.hasOwnProperty.call(seat, 'checkedInAt')) {
    seat.checkedInAt = null;
  }
  if (!Object.prototype.hasOwnProperty.call(seat, 'checkedInBy')) {
    seat.checkedInBy = null;
  }
};

const resetSeatCheckin = (seat) => {
  if (!seat) return;
  seat.checkedInAt = null;
  seat.checkedInBy = null;
};

const findSeatsByTicketCode = (project, ticketCode) => {
  if (!project || !ticketCode) return [];
  const normalized = String(ticketCode).trim();
  if (!normalized) return [];
  const normUpper = normalized.toUpperCase();
  return Object.values(project.seats || {}).filter((seat) => {
    if (!seat) return false;
    const t1 = typeof seat.ticketNumber === 'string' ? seat.ticketNumber.trim() : '';
    const t2 = typeof seat.ticketCode === 'string' ? seat.ticketCode.trim() : '';
    const label = typeof seat.seatLabel === 'string' ? seat.seatLabel.trim() : '';
    return (
      (t1 && t1.toUpperCase() === normUpper) ||
      (t2 && t2.toUpperCase() === normUpper) ||
      (label && label.toUpperCase() === normUpper)
    );
  });
};

const findSeatByTicketCode = (project, ticketCode) => {
  const matches = findSeatsByTicketCode(project, ticketCode);
  return matches[0] || null;
};

const buildSeatCheckinPayload = (project, seat) => {
  if (!project || !seat) return null;
  return {
    projectId: project.id,
    projectName: project.name,
    seatId: seatId(seat.row, seat.col),
    row: seat.row,
    col: seat.col,
    seatLabel: seat.seatLabel,
    ticketNumber: seat.ticketNumber,
    price: seat.price,
    status: seat.status,
    issuedAt: seat.issuedAt,
    checkedInAt: seat.checkedInAt,
    checkedInBy: seat.checkedInBy,
  };
};

const computeCheckinStats = (project) => {
  if (!project) return { totalSold: 0, checkedIn: 0 };
  let totalSold = 0;
  let checkedIn = 0;
  Object.values(project.seats || {}).forEach((seat) => {
    if (seat && seat.status === 'sold') {
      totalSold += 1;
      if (seat.checkedInAt) checkedIn += 1;
    }
  });
  return { totalSold, checkedIn };
};

const dataUriToBuffer = (dataUri) => {
  try {
    const matches = String(dataUri || '').match(/^data:(.+);base64,(.*)$/);
    if (!matches) return null;
    return Buffer.from(matches[2], 'base64');
  } catch {
    return null;
  }
};

const ensureBackupDir = async () => {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
};

const createStateBackup = async (label = 'backup') => {
  try {
    await ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${label}.json`;
    const filePath = path.join(BACKUP_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(state, null, 2), 'utf8');
    const files = (await fs.readdir(BACKUP_DIR))
      .filter((f) => f.startsWith('auto-'))
      .sort();
    if (files.length > AUTO_BACKUP_LIMIT) {
      const remove = files.slice(0, files.length - AUTO_BACKUP_LIMIT);
      await Promise.all(remove.map((f) => fs.unlink(path.join(BACKUP_DIR, f)).catch(() => {})));
    }
    return filePath;
  } catch (error) {
    console.error('Failed to create state backup:', error);
    return null;
  }
};

setInterval(() => {
  createStateBackup('auto').catch(() => {});
}, AUTO_BACKUP_INTERVAL_MS).unref();

const getExtensionFromMime = (mime) => {
  if (!mime) return '.jpg';
  if (mime.includes('png')) return '.png';
  if (mime.includes('gif')) return '.gif';
  if (mime.includes('webp')) return '.webp';
  if (mime.includes('bmp')) return '.bmp';
  return '.jpg';
};

const deleteMerchImageFile = async (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return;
  if (!imagePath.startsWith(MERCH_IMAGE_URL_PREFIX)) return;
  const relativePath = imagePath.replace(/^\//, '');
  const normalizedRelativePath = path.normalize(relativePath);
  if (normalizedRelativePath.startsWith('..')) return;
  const absolutePath = path.join(__dirname, 'public', normalizedRelativePath);
  if (!absolutePath.startsWith(path.join(__dirname, 'public'))) return;
  await fs.unlink(absolutePath).catch(() => {});
};

const saveMerchImageFromDataUrl = async (dataUrl, previousPath = null) => {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('图片格式无效，请上传常见的图片文件。');
  }
  const mime = match[1].toLowerCase();
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length > MAX_MERCH_IMAGE_BYTES) {
    throw new Error('图片体积过大，请压缩至 10MB 以内后再试。');
  }
  await ensureMerchImageDir();
  const ext = getExtensionFromMime(mime);
  const filename = `${uuidv4()}${ext}`;
  const fullPath = path.join(MERCH_IMAGE_DIR, filename);
  await fs.writeFile(fullPath, buffer);
  if (previousPath && previousPath !== `${MERCH_IMAGE_URL_PREFIX}/${filename}`) {
    await deleteMerchImageFile(previousPath);
  }
  return `${MERCH_IMAGE_URL_PREFIX}/${filename}`;
};

const normalizePriceKey = (price) => (price == null ? null : String(Number(price)));

const getNextPriceColor = (project) => {
  ensureProjectMetadata(project);
  const used = new Set(Object.values(project.priceColorAssignments));
  for (const color of PRICE_COLORS) {
    if (!used.has(color)) return color;
  }
  return PRICE_COLORS[used.size % PRICE_COLORS.length];
};

const ensurePriceColorAssignment = (project, price) => {
  const key = normalizePriceKey(price);
  if (key == null) return null;
  ensureProjectMetadata(project);
  if (!project.priceColorAssignments[key]) {
    project.priceColorAssignments[key] = getNextPriceColor(project);
  }
  return project.priceColorAssignments[key];
};

const refreshPriceAssignments = (project) => {
  ensureProjectMetadata(project);
  Object.values(project.seats).forEach((seat) => {
    if (seat && seat.status !== 'disabled' && seat.price != null) {
      ensurePriceColorAssignment(project, seat.price);
    }
  });
};

const getProductImageSource = (product) => {
  if (!product) return null;
  if (product.imagePath) return product.imagePath;
  if (typeof product.imageData === 'string' && product.imageData.startsWith('data:')) {
    return product.imageData;
  }
  if (typeof product.imageData === 'string' && product.imageData.startsWith(MERCH_IMAGE_URL_PREFIX)) {
    return product.imageData;
  }
  return null;
};

const serializeProduct = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  stock: product.stock,
  description: product.description || '',
  imageData: getProductImageSource(product),
  enabled: product.enabled !== false,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const serializeCheckoutMode = (mode) => ({
  id: mode.id,
  name: mode.name,
  type: mode.type,
  value: mode.value,
  threshold: mode.threshold ?? null,
  cutAmount: mode.cutAmount ?? null,
  stackLimit: mode.stackLimit ?? null,
  description: mode.description || '',
  enabled: mode.enabled !== false,
  createdAt: mode.createdAt,
  updatedAt: mode.updatedAt,
});

const normalizeCheckoutModePayload = (payload = {}, existing = null) => {
  const base = existing
    ? {
        name: existing.name,
        type: existing.type,
        value: existing.value,
        threshold: existing.threshold ?? null,
        cutAmount: existing.cutAmount ?? null,
        stackLimit: existing.stackLimit ?? null,
        description: existing.description || '',
        enabled: existing.enabled !== false,
      }
    : {
        name: '',
        type: 'standard',
        value: 1,
        threshold: null,
        cutAmount: null,
        stackLimit: null,
        description: '',
        enabled: true,
      };

  if (payload.name && typeof payload.name === 'string') {
    base.name = payload.name.trim();
  }
  if (payload.description !== undefined) {
    base.description = typeof payload.description === 'string' ? payload.description.trim() : '';
  }
  if (payload.enabled !== undefined) {
    base.enabled = Boolean(payload.enabled);
  }

  if (payload.type && ['standard', 'discount', 'fullcut'].includes(payload.type)) {
    base.type = payload.type;
  }

  if (base.type === 'standard') {
    base.value = 1;
    base.threshold = null;
    base.cutAmount = null;
    base.stackLimit = null;
  } else if (base.type === 'discount') {
    const raw = payload.value ?? payload.discountRate ?? base.value;
    const numeric = Number(raw);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      throw new Error('请输入有效的折扣比例');
    }
    base.value = numeric > 1 ? numeric / 10 : numeric;
    if (base.value <= 0 || base.value > 1) {
      throw new Error('折扣需介于 0-1（或 0-10 折）之间');
    }
    base.threshold = null;
    base.cutAmount = null;
    base.stackLimit = null;
  } else if (base.type === 'fullcut') {
    const threshold = Number(payload.threshold ?? base.threshold);
    const cutAmount = Number(payload.cutAmount ?? base.cutAmount);
    let stackLimit =
      payload.stackLimit === 'unlimited'
        ? 'unlimited'
        : Number(payload.stackLimit ?? base.stackLimit ?? 1);
    if (!Number.isFinite(threshold) || threshold <= 0) {
      throw new Error('满减门槛必须为正数');
    }
    if (!Number.isFinite(cutAmount) || cutAmount <= 0) {
      throw new Error('满减优惠金额必须为正数');
    }
    if (stackLimit === 0) {
      stackLimit = 'unlimited';
    }
    if (stackLimit !== 'unlimited' && (!Number.isFinite(stackLimit) || stackLimit <= 0)) {
      throw new Error('可叠加次数必须大于 0，或设置为无限叠加');
    }
    base.threshold = threshold;
    base.cutAmount = cutAmount;
    base.stackLimit = stackLimit === 'unlimited' ? null : Math.floor(stackLimit);
    base.value = 1;
  }

  return base;
};

const getRowProgress = (project, row) => {
  ensureProjectMetadata(project);
  const key = String(row);
  if (!project.seatLabelProgress[key]) {
    project.seatLabelProgress[key] = { leftNext: 1, rightNext: 2 };
  }
  return project.seatLabelProgress[key];
};

const parseSeatNumber = (seatLabel) => {
  if (!seatLabel) return null;
  const match = seatLabel.match(/^(\d+)排(\d+)号$/);
  if (!match) return null;
  return Number(match[2]);
};

const applyCheckoutModeToTotal = (mode, total) => {
  if (!mode || mode.enabled === false) {
    return { totalAfter: total, discount: 0 };
  }
  if (mode.type === 'discount' || mode.type === 'percentage') {
    const multiplier = Math.min(1, Math.max(0, Number(mode.value) || 1));
    const totalAfter = Math.max(0, Math.round(total * multiplier * 100) / 100);
    return { totalAfter, discount: Math.round((total - totalAfter) * 100) / 100 };
  }
  if (mode.type === 'fullcut') {
    const threshold = Math.max(0, Number(mode.threshold) || 0);
    const cutAmount = Math.max(0, Number(mode.cutAmount) || 0);
    const stackLimit = Number.isFinite(Number(mode.stackLimit))
      ? Math.max(1, Math.floor(Number(mode.stackLimit)))
      : null;
    if (!threshold || !cutAmount) {
      return { totalAfter: total, discount: 0 };
    }
    const possibleStacks = Math.floor(total / threshold);
    const stacks = stackLimit ? Math.min(possibleStacks, stackLimit) : possibleStacks;
    const discount = Math.max(0, Math.min(total, stacks * cutAmount));
    return { totalAfter: total - discount, discount };
  }
  return { totalAfter: total, discount: 0 };
};

const normalizeUsername = (username = '') => username.trim().toLowerCase();

const hashPassword = async (plain) => bcrypt.hash(String(plain), PASSWORD_SALT_ROUNDS);

const verifyPassword = async (plain, hash) => bcrypt.compare(String(plain), hash);

const ensureAccount = async (username, password, role, { overridePassword = false } = {}) => {
  if (!username || !password) return null;
  const key = normalizeUsername(username);
  const existing = state.accounts[key];
  if (existing && !overridePassword) {
    if (existing.role !== role) {
      existing.role = role;
      existing.updatedAt = Date.now();
    }
    return existing;
  }
  const passwordHash = await hashPassword(password);
  const account = {
    username: username.trim(),
    passwordHash,
    role,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
  state.accounts[key] = account;
  return account;
};

const getAccount = (username) => state.accounts[normalizeUsername(username)] || null;

const removeAccount = (username) => {
  const key = normalizeUsername(username);
  if (state.accounts[key]) {
    delete state.accounts[key];
    return true;
  }
  return false;
};

const countAccountsByRole = (role) =>
  Object.values(state.accounts).filter((account) => account.role === role).length;

const ensureDefaultAccounts = async () => {
  if (!state.accounts || typeof state.accounts !== 'object') {
    state.accounts = {};
  }
  const accountsArray = Object.values(state.accounts);
  const hasAdmin = accountsArray.some((account) => account.role === 'admin');
  if (!hasAdmin) {
    await ensureAccount(DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD, 'admin');
  } else if (!state.accounts[normalizeUsername(DEFAULT_ADMIN_USERNAME)]) {
    await ensureAccount(DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD, 'admin');
  }

  const hasSales = accountsArray.some((account) => account.role === 'sales');
  if (!hasSales && DEFAULT_SALES_PASSWORD) {
    await ensureAccount(DEFAULT_SALES_USERNAME, DEFAULT_SALES_PASSWORD, 'sales');
  }
};

const ensureDataFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
  }
};

const migrateLegacyState = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.projects) return raw;
  const { rows, cols, seats } = raw;
  if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
    return null;
  }
  const projectId = uuidv4();
  return {
    projects: {
      [projectId]: {
        id: projectId,
        name: '默认项目',
        rows,
        cols,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        seats: seats || {},
      },
    },
  };
};

const loadState = async () => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start !== -1 && end > start) {
        const sliced = raw.slice(start, end + 1);
        try {
          parsed = JSON.parse(sliced);
          console.warn('State file contained extra content; recovered by truncating to last closing brace.');
          try {
            await fs.mkdir(BACKUP_DIR, { recursive: true });
            await fs.writeFile(
              path.join(BACKUP_DIR, `corrupt-state-${Date.now()}.json`),
              raw,
              'utf8'
            );
          } catch {}
          await fs.writeFile(DATA_FILE, sliced, 'utf8');
        } catch {
          throw parseError;
        }
      } else {
        throw parseError;
      }
    }
    if (parsed && typeof parsed === 'object') {
      const migrated = migrateLegacyState(parsed) || parsed;
      const projects = migrated.projects && typeof migrated.projects === 'object' ? migrated.projects : {};
      const accounts = migrated.accounts && typeof migrated.accounts === 'object' ? migrated.accounts : {};
      state = {
        projects,
        accounts,
        merch: migrated.merch || undefined,
      };
    }
  } catch (error) {
    console.warn('Failed to load state file, using defaults.', error);
  }
  ensureMerchState();
  ensureAuditState();
};

const saveState = async () => {
  await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
};

const createEmptyProject = ({ name, rows, cols }) => {
  const id = uuidv4();
  const createdAt = Date.now();
  const seats = {};
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      seats[seatId(row, col)] = {
        row,
        col,
        status: 'disabled',
        price: null,
        ticketCode: null,
        seatLabel: null,
        lockedBy: null,
        lockExpiresAt: null,
        issuedAt: null,
        checkedInAt: null,
        checkedInBy: null,
      };
    }
  }
  return {
    id,
    name,
    rows,
    cols,
    createdAt,
    updatedAt: createdAt,
    seats,
    ticketing: {
      mode: 'random',
      sequence: null,
    },
    priceColorAssignments: {},
    seatLabelProgress: {},
  };
};

const generateTicketCode = (projectId, row, col) => {
  const prettyRow = String(row + 1).padStart(2, '0');
  const prettyCol = String(col + 1).padStart(2, '0');
  return `P${projectId.slice(0, 4).toUpperCase()}-${prettyRow}${prettyCol}-${uuidv4()
    .slice(0, 8)
    .toUpperCase()}`;
};

const assignSeatLabels = (project, targetRows = null) => {
  ensureProjectMetadata(project);
  const { rows, cols, seats } = project;
  let rowFilter = null;
  if (targetRows != null) {
    const candidates =
      targetRows instanceof Set
        ? [...targetRows]
        : Array.isArray(targetRows)
        ? targetRows
        : [targetRows];
    rowFilter = new Set();
    candidates.forEach((value) => {
      const index = Number(value);
      if (Number.isInteger(index) && index >= 0 && index < rows) {
        rowFilter.add(index);
      }
    });
    if (rowFilter.size === 0) {
      rowFilter = null;
    }
  }
  const centerLeftIndex = Math.floor((cols - 1) / 2);
  const centerRightIndex = centerLeftIndex + 1;

  for (let row = 0; row < rows; row += 1) {
    if (rowFilter && !rowFilter.has(row)) continue;
    const leftSeats = [];
    const rightSeats = [];

    for (let col = 0; col < cols; col += 1) {
      const id = seatId(row, col);
      const seat = seats[id];
      if (!seat) continue;
      ensureSeatCheckinState(seat);

      if (seat.status === 'disabled') {
        seat.seatLabel = null;
        continue;
      }

      if (col <= centerLeftIndex) {
        leftSeats.push({ seat, col });
      } else {
        rightSeats.push({ seat, col });
      }
    }

    leftSeats
      .sort((a, b) => {
        const distA = centerLeftIndex - a.col;
        const distB = centerLeftIndex - b.col;
        if (distA !== distB) return distA - distB;
        return b.col - a.col;
      })
      .forEach((entry, index) => {
        const labelNumber = 1 + index * 2;
        entry.seat.seatLabel = `${row + 1}排${labelNumber}号`;
      });

    rightSeats
      .sort((a, b) => {
        const distA = a.col - centerRightIndex;
        const distB = b.col - centerRightIndex;
        if (distA !== distB) return distA - distB;
        return a.col - b.col;
      })
      .forEach((entry, index) => {
        const labelNumber = 2 + index * 2;
        entry.seat.seatLabel = `${row + 1}排${labelNumber}号`;
      });

    const progress = getRowProgress(project, row);
    progress.leftNext = leftSeats.length > 0 ? leftSeats.length * 2 + 1 : 1;
    if (progress.leftNext % 2 === 0) progress.leftNext += 1;
    progress.rightNext = rightSeats.length > 0 ? rightSeats.length * 2 + 2 : 2;
    if (progress.rightNext % 2 !== 0) progress.rightNext += 1;
  }
};

const sanitizeSeatsUpdate = (project, updates = []) => {
  const { rows, cols } = project;
  const normalized = {};
  updates.forEach((seat) => {
    if (
      !seat ||
      typeof seat !== 'object' ||
      !Number.isInteger(seat.row) ||
      !Number.isInteger(seat.col)
    ) {
      return;
    }
    if (seat.row < 0 || seat.col < 0 || seat.row >= rows || seat.col >= cols) {
      return;
    }
    const allowedStatuses = ['disabled', 'available', 'locked', 'sold'];
    const status = allowedStatuses.includes(seat.status) ? seat.status : 'disabled';
    const price =
      typeof seat.price === 'number' && Number.isFinite(seat.price) && seat.price >= 0
        ? seat.price
        : null;
    const ticketNumber = typeof seat.ticketNumber === 'string' ? seat.ticketNumber.trim() || null : null;
    normalized[seatId(seat.row, seat.col)] = {
      row: seat.row,
      col: seat.col,
      status,
      price,
      ticketNumber,
    };
  });
  return normalized;
};

const ensureProjectTicketing = (project) => {
  if (!project.ticketing || typeof project.ticketing !== 'object') {
    project.ticketing = { mode: 'random', sequence: null };
  }
  if (!project.ticketing.mode) {
    project.ticketing.mode = 'random';
  }
  if (project.ticketing.mode !== 'sequence') {
    project.ticketing.sequence = null;
  } else {
    project.ticketing.sequence = {
      template: project.ticketing.sequence?.template || null,
      width: project.ticketing.sequence?.width || 0,
      startValue: project.ticketing.sequence?.startValue || 1,
      nextValue:
        typeof project.ticketing.sequence?.nextValue === 'number'
          ? project.ticketing.sequence.nextValue
          : (project.ticketing.sequence?.startValue || 1) - 1,
      maxValue: project.ticketing.sequence?.maxValue || 0,
      prefix: project.ticketing.sequence?.prefix || '',
    };
  }
};

const prepareSequenceState = (project) => {
  ensureProjectTicketing(project);
  if (project.ticketing.mode !== 'sequence') return null;
  const sequence = project.ticketing.sequence;
  if (!sequence || !sequence.template) return null;
  const match = sequence.template.match(/(X+)$/);
  if (!match) return null;
  const width = match[1].length;
  const prefix = sequence.template.slice(0, -width);
  const startValue = parseInt(String(sequence.startValue ?? '1'), 10);
  if (Number.isNaN(startValue)) return null;
  const maxValue = 10 ** width - 1;
  sequence.width = width;
  sequence.prefix = prefix;
  sequence.startValue = startValue;
  sequence.startString = String(sequence.startValue).padStart(width, '0');
  sequence.maxValue = maxValue;
  if (typeof sequence.nextValue !== 'number' || sequence.nextValue < startValue - 1) {
    sequence.nextValue = startValue - 1;
  }
  return sequence;
};

const formatSequenceTicketNumber = (sequence, value) => {
  if (!sequence) return null;
  const digits = String(value).padStart(sequence.width, '0');
  if (digits.length > sequence.width) return null;
  return `${sequence.prefix}${digits}`;
};

const deriveSequenceValue = (sequence, ticketNumber) => {
  if (!sequence || !ticketNumber) return null;
  if (!ticketNumber.startsWith(sequence.prefix)) return null;
  const digits = ticketNumber.slice(sequence.prefix.length);
  if (!/^\d+$/.test(digits) || digits.length !== sequence.width) return null;
  const value = parseInt(digits, 10);
  if (Number.isNaN(value)) return null;
  return value;
};

const assignTicketNumberToSeat = (project, seat, { force = false } = {}) => {
  ensureProjectTicketing(project);
  if (!seat) return;
  if (seat.status === 'disabled') {
    seat.ticketNumber = null;
    seat.ticketCode = null;
    seat.ticketSequenceValue = null;
    return;
  }
  if (!force && seat.ticketNumber) {
    seat.ticketCode = seat.ticketNumber;
    return;
  }
  if (project.ticketing.mode === 'sequence') {
    const sequence = prepareSequenceState(project);
    if (!sequence) {
      const ticketNumber = generateTicketCode(project.id, seat.row, seat.col);
      seat.ticketNumber = ticketNumber;
      seat.ticketCode = ticketNumber;
      seat.ticketSequenceValue = null;
      return;
    }
    const nextValue = sequence.nextValue + 1;
    if (nextValue > sequence.maxValue) {
      throw new Error('票号流水已超出范围');
    }
    sequence.nextValue = nextValue;
    const ticketNumber = formatSequenceTicketNumber(sequence, nextValue);
    seat.ticketNumber = ticketNumber;
    seat.ticketCode = ticketNumber;
    seat.ticketSequenceValue = nextValue;
  } else {
    const ticketNumber = generateTicketCode(project.id, seat.row, seat.col);
    seat.ticketNumber = ticketNumber;
    seat.ticketCode = ticketNumber;
    seat.ticketSequenceValue = null;
  }
};

const ensureSeatTicketNumbers = (project, { force = false } = {}) => {
  ensureProjectTicketing(project);
  const seats = Object.values(project.seats || {}).sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    const numA = parseSeatNumber(a.seatLabel) ?? a.col + 1;
    const numB = parseSeatNumber(b.seatLabel) ?? b.col + 1;
    return numA - numB;
  });
  const sequence = prepareSequenceState(project);
  if (sequence && force) {
    sequence.nextValue = sequence.startValue - 1;
  }
  if (sequence) {
    const activeSeatCount = seats.filter((seat) => seat.status !== 'disabled').length;
    const potentialMax = sequence.startValue - 1 + activeSeatCount;
    if (potentialMax > sequence.maxValue) {
      throw new Error('可用流水号不足以覆盖启用座位数量');
    }
  }
  seats.forEach((seat) => {
    if (sequence) {
      if (seat.ticketNumber && !seat.ticketSequenceValue) {
        const derived = deriveSequenceValue(sequence, seat.ticketNumber);
        if (derived !== null) {
          seat.ticketSequenceValue = derived;
        }
      }
      if (!force && seat.ticketSequenceValue) {
        if (seat.ticketSequenceValue > sequence.nextValue) {
          sequence.nextValue = seat.ticketSequenceValue;
        }
        if (seat.ticketNumber && seat.status !== 'disabled') {
          seat.ticketCode = seat.ticketNumber;
          return;
        }
      }
    }
    if (!force && seat.ticketNumber && seat.status !== 'disabled') {
      seat.ticketCode = seat.ticketNumber;
      return;
    }
    assignTicketNumberToSeat(project, seat, { force });
  });
};

const regenerateSeatTicketNumbers = (project, config = null) => {
  if (config && config.mode === 'sequence') {
    const { template, startValue } = config.sequence || {};
    const match = template && template.match(/(X+)$/);
    if (!match) {
      throw new Error('票号模板必须以连续的 X 结尾');
    }
    const width = match[1].length;
    if (!startValue || String(startValue).length !== width) {
      throw new Error('流水码起始长度需与模板中 X 的数量一致');
    }
    const numericStart = parseInt(String(startValue), 10);
    if (Number.isNaN(numericStart)) {
      throw new Error('流水码起始必须是数字');
    }
    project.ticketing = {
      mode: 'sequence',
      sequence: {
        template,
        width,
        startValue: numericStart,
        nextValue: numericStart - 1,
        maxValue: 10 ** width - 1,
        prefix: template.slice(0, -width),
        startString: String(startValue).padStart(width, '0'),
      },
    };
  } else if (config && config.mode === 'random') {
    project.ticketing = { mode: 'random', sequence: null };
  }
  ensureSeatTicketNumbers(project, { force: true });
};

const releaseSeatLock = (seat) => {
  seat.lockedBy = null;
  seat.lockExpiresAt = null;
  if (seat.status === 'locked') {
    seat.status = 'available';
  }
};

const enforceLockTimeouts = () => {
  const now = Date.now();
  let changedProjects = new Set();
  Object.values(state.projects).forEach((project) => {
    let changed = false;
    Object.values(project.seats).forEach((seat) => {
      if (seat.lockExpiresAt && seat.lockExpiresAt <= now) {
        releaseSeatLock(seat);
        changed = true;
      }
    });
    if (changed) {
      project.updatedAt = Date.now();
      changedProjects.add(project.id);
    }
  });
  if (changedProjects.size > 0) {
    saveState().catch((err) => console.error('Failed to persist state after lock timeout', err));
    changedProjects.forEach((projectId) => broadcastProject(projectId));
  }
};

setInterval(enforceLockTimeouts, 5 * 1000);

const parseSession = (req) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const sessionId = cookies[SESSION_COOKIE_NAME];
    if (!sessionId) return null;
    const session = sessions.get(sessionId);
    if (!session) return null;
    if (Date.now() - session.createdAt > SESSION_TTL_MS) {
      sessions.delete(sessionId);
      return null;
    }
    return { ...session, sessionId };
  } catch {
    return null;
  }
};

const setSessionCookie = (res, sessionId) => {
  const cookieValue = cookie.serialize(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL_MS / 1000,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookieValue);
};

const clearSessionCookie = (res) => {
  const cookieValue = cookie.serialize(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
  res.setHeader('Set-Cookie', cookieValue);
};

const requireRole = (role) => (req, res, next) => {
  const session = parseSession(req);
  if (!session) {
    return res.status(401).json({ error: '未登录' });
  }
  if (role === 'admin' && session.role !== 'admin') {
    return res.status(403).json({ error: '无权限' });
  }
  req.session = session;
  return next();
};

const requireAnyRole = (req, res, next) => {
  const session = parseSession(req);
  if (!session) {
    return res.status(401).json({ error: '未登录' });
  }
  req.session = session;
  next();
};

const optionalSession = (req, _res, next) => {
  const session = parseSession(req);
  if (session) {
    req.session = session;
  }
  next();
};

const guardPage = (role) => (req, res, next) => {
  const session = parseSession(req);
  if (!session) {
    return res.redirect(`/login.html?role=${role}`);
  }
  if (role === 'admin' && session.role !== 'admin') {
    return res.redirect('/login.html?role=admin');
  }
  if (role === 'sales' && !['sales', 'admin'].includes(session.role)) {
    return res.redirect('/login.html?role=sales');
  }
  next();
};

app.get('/admin.html', guardPage('admin'), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/sales.html', guardPage('sales'), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sales.html'));
});

// prevent favicon 404 noise
app.get('/favicon.ico', (_req, res) => res.status(204).end());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/auth/session', (req, res) => {
  const session = parseSession(req);
  if (!session) {
    return res.json({ authenticated: false, role: null, username: null });
  }
  return res.json({ authenticated: true, role: session.role, username: session.username });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: '请输入用户名与密码' });
  }
  const account = getAccount(username);
  if (!account) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  const verified = await verifyPassword(password, account.passwordHash).catch(() => false);
  if (!verified) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  const sessionId = uuidv4();
  sessions.set(sessionId, {
    role: account.role,
    username: account.username,
    createdAt: Date.now(),
  });
  setSessionCookie(res, sessionId);
  return res.json({ ok: true, role: account.role, username: account.username });
});

app.post('/api/auth/logout', requireAnyRole, (req, res) => {
  if (req.session) {
    sessions.delete(req.session.sessionId);
  }
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/accounts', requireRole('admin'), (_req, res) => {
  const accounts = Object.values(state.accounts)
    .map(({ username, role, createdAt, updatedAt }) => ({ username, role, createdAt, updatedAt }))
    .sort((a, b) => {
      if (a.role === b.role) {
        return a.username.localeCompare(b.username);
      }
      return a.role.localeCompare(b.role);
    });
  res.json({ accounts });
});

app.post('/api/accounts', requireRole('admin'), async (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: '用户名与密码不能为空' });
  }
  if (!['admin', 'sales'].includes(role)) {
    return res.status(400).json({ error: '角色无效' });
  }
  if (state.accounts[normalizeUsername(username)]) {
    return res.status(409).json({ error: '该用户名已存在' });
  }
  await ensureAccount(username, password, role, { overridePassword: true });
  await saveState();
  broadcastAdminUpdate();
  res.json({ ok: true });
});

app.get('/api/merch/products', optionalSession, (_req, res) => {
  ensureMerchState();
  const products = Object.values(state.merch.products).map(serializeProduct);
  res.json({ products });
});

app.post('/api/merch/products', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const { name, price, stock, description, imageData, enabled = true } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: '请输入商品名称' });
  }
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: '价格必须为非负数字' });
  }
  const numericStock = Number.isFinite(Number(stock)) ? Math.max(0, Math.floor(Number(stock))) : 0;
  if (numericStock < 0) {
    return res.status(400).json({ error: '库存数量无效' });
  }
  const id = uuidv4();
  let imagePath = null;
  if (imageData) {
    try {
      imagePath = await saveMerchImageFromDataUrl(imageData);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  const product = {
    id,
    name: name.trim(),
    price: Math.round(numericPrice * 100) / 100,
    stock: numericStock,
    description: typeof description === 'string' ? description.trim() : '',
    imageData: null,
    imagePath,
    enabled: Boolean(enabled),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  state.merch.products[id] = product;
  await saveState();
  res.json({ product: serializeProduct(product) });
});

app.put('/api/merch/products/:productId', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const product = state.merch.products[req.params.productId];
  if (!product) {
    return res.status(404).json({ error: '商品不存在' });
  }
  const payload = req.body || {};
  if (payload.name && typeof payload.name === 'string') {
    product.name = payload.name.trim();
  }
  if (payload.price !== undefined) {
    const numericPrice = Number(payload.price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: '价格必须为非负数字' });
    }
    product.price = Math.round(numericPrice * 100) / 100;
  }
  if (payload.stock !== undefined) {
    const numericStock = Number.isFinite(Number(payload.stock))
      ? Math.max(0, Math.floor(Number(payload.stock)))
      : null;
    if (numericStock === null) {
      return res.status(400).json({ error: '库存数量无效' });
    }
    product.stock = numericStock;
  }
  if (payload.description !== undefined) {
    product.description = typeof payload.description === 'string' ? payload.description.trim() : '';
  }
  if (payload.imageData !== undefined) {
    if (payload.imageData) {
      try {
        const newPath = await saveMerchImageFromDataUrl(payload.imageData, product.imagePath);
        product.imagePath = newPath;
        product.imageData = null;
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    } else {
      await deleteMerchImageFile(product.imagePath);
      product.imagePath = null;
      product.imageData = null;
    }
  }
  if (payload.enabled !== undefined) {
    product.enabled = Boolean(payload.enabled);
  }
  product.updatedAt = Date.now();
  await saveState();
  res.json({ product: serializeProduct(product) });
});

app.delete('/api/merch/products/:productId', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const product = state.merch.products[req.params.productId];
  if (!product) {
    return res.status(404).json({ error: '商品不存在' });
  }
  createStateBackup(`delete-product-${product.id}`).catch(() => {});
  await deleteMerchImageFile(product.imagePath);
  delete state.merch.products[req.params.productId];
  await saveState();
  res.json({ ok: true });
});

app.get('/api/merch/modes', optionalSession, (_req, res) => {
  ensureMerchState();
  const modes = Object.values(state.merch.checkoutModes).map(serializeCheckoutMode);
  res.json({ modes });
});

app.post('/api/merch/modes', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const { name } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: '请输入结账模式名称' });
  }
  let definitions;
  try {
    definitions = normalizeCheckoutModePayload(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  const id = uuidv4();
  const mode = {
    id,
    ...definitions,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  state.merch.checkoutModes[id] = mode;
  await saveState();
  res.json({ mode: serializeCheckoutMode(mode) });
});

app.put('/api/merch/modes/:modeId', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const mode = state.merch.checkoutModes[req.params.modeId];
  if (!mode) {
    return res.status(404).json({ error: '结账模式不存在' });
  }
  let updated;
  try {
    updated = normalizeCheckoutModePayload(req.body, mode);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  Object.assign(mode, updated, { updatedAt: Date.now() });
  await saveState();
  res.json({ mode: serializeCheckoutMode(mode) });
});

app.delete('/api/merch/modes/:modeId', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const mode = state.merch.checkoutModes[req.params.modeId];
  if (!mode) {
    return res.status(404).json({ error: '结账模式不存在' });
  }
  createStateBackup(`delete-mode-${mode.id}`).catch(() => {});
  delete state.merch.checkoutModes[req.params.modeId];
  if (!Object.keys(state.merch.checkoutModes).length) {
    await ensureMerchState();
  }
  await saveState();
  res.json({ ok: true });
});

app.get('/api/merch/orders', requireRole('admin'), (req, res) => {
  ensureMerchState();
  const { since, until, handler, mode, keyword, limit = 200, offset = 0 } = req.query || {};
  const parsedSince = since ? Number(since) : null;
  const parsedUntil = until ? Number(until) : null;
  const parsedLimit = Math.min(500, Math.max(1, Number(limit) || 200));
  const parsedOffset = Math.max(0, Number(offset) || 0);
  const keywordLower = keyword ? String(keyword).toLowerCase() : '';

  const filtered = state.merch.orders.filter((order) => {
    if (parsedSince && order.createdAt < parsedSince) return false;
    if (parsedUntil && order.createdAt > parsedUntil) return false;
    if (handler && order.handledBy !== handler) return false;
    if (mode && order.checkoutModeId !== mode) return false;
    if (keywordLower) {
      const haystack = [order.note, order.checkoutModeName, order.handledBy]
        .concat((order.items || []).map((i) => `${i.name} ${i.ticketNumber || ''}`))
        .join(' ') //
        .toLowerCase();
      if (!haystack.includes(keywordLower)) return false;
    }
    return true;
  });

  const orders = filtered
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(parsedOffset, parsedOffset + parsedLimit);
  Promise.all(orders.map((o) => ensureOrderHasNumber(o))).then(() => {
    res.json({ orders, total: filtered.length });
  });
});

const requireSalesOrAdmin = (req, res, next) => {
  const session = parseSession(req);
  if (!session) {
    return res.status(401).json({ error: '未登录' });
  }
  if (!['sales', 'admin'].includes(session.role)) {
    return res.status(403).json({ error: '无权限' });
  }
  req.session = session;
  return next();
};

const resolveCheckoutMode = (checkoutModeId) => {
  if (!checkoutModeId) return null;
  const mode = state.merch.checkoutModes[checkoutModeId];
  return mode && mode.enabled !== false ? mode : null;
};

const normalizeOrderItems = (items = []) => {
  if (!Array.isArray(items) || !items.length) {
    throw new Error('请至少添加一条商品记录');
  }
  return items.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`第 ${index + 1} 条商品数据无效`);
    }
    const name = (item.name || item.productName || '').trim();
    if (!name) {
      throw new Error(`第 ${index + 1} 条商品缺少名称`);
    }
    const unitPrice = Number(item.unitPrice ?? item.price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error(`第 ${index + 1} 条商品单价无效`);
    }
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 0));
    const subtotal = Math.round(unitPrice * quantity * 100) / 100;
    return {
      productId: item.productId || null,
      name,
      quantity,
      unitPrice: Math.round(unitPrice * 100) / 100,
      subtotal,
    };
  });
};

app.post('/api/merch/orders', requireSalesOrAdmin, async (req, res) => {
  ensureMerchState();
  const { items, checkoutModeId, note, paymentMethod } = req.body || {};
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: '请选择至少一件商品' });
  }
  const parsedItems = [];
  for (const entry of items) {
    if (!entry || typeof entry !== 'object') continue;
    const product = state.merch.products[entry.productId];
    if (!product || product.enabled === false) {
      return res.status(400).json({ error: '存在无效商品' });
    }
    const quantity = Math.max(1, Math.floor(Number(entry.quantity) || 0));
    if (product.stock < quantity) {
      return res.status(400).json({ error: `商品「${product.name}」库存不足` });
    }
    parsedItems.push({ product, quantity });
  }
  if (!parsedItems.length) {
    return res.status(400).json({ error: '未找到有效商品' });
  }

  const mode = checkoutModeId ? state.merch.checkoutModes[checkoutModeId] : null;
  if (checkoutModeId && !mode) {
    return res.status(400).json({ error: '结账模式不存在' });
  }

  let totalBefore = 0;
  const orderItems = parsedItems.map(({ product, quantity }) => {
    const subtotal = Math.round(product.price * quantity * 100) / 100;
    totalBefore += subtotal;
    return {
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      subtotal,
    };
  });
  totalBefore = Math.round(totalBefore * 100) / 100;
  const { totalAfter, discount } = applyCheckoutModeToTotal(mode, totalBefore);

  parsedItems.forEach(({ product, quantity }) => {
    product.stock -= quantity;
    if (product.stock < 0) product.stock = 0;
    product.updatedAt = Date.now();
  });

  const order = {
    id: uuidv4(),
    orderNumber: await nextMerchOrderNumber(),
    items: orderItems,
    checkoutModeId: mode ? mode.id : null,
    checkoutModeName: mode ? mode.name : '原价',
    discount,
    totalBefore,
    totalAfter: Math.round(totalAfter * 100) / 100,
    handledBy: req.session?.username || 'unknown',
    paymentMethod: typeof paymentMethod === 'string' && paymentMethod.trim() ? paymentMethod.trim() : '现金',
    note: typeof note === 'string' ? note.trim() : '',
    createdAt: Date.now(),
  };
  state.merch.orders.push(order);
  if (state.merch.orders.length > 2000) {
    state.merch.orders = state.merch.orders.slice(-2000);
  }
  appendAudit({ action: 'merch-order:create', actor: req.session?.username || 'unknown', detail: `创建文创订单 ${order.id}` });
  await saveState();
  res.json({ order });
});

app.post('/api/merch/orders/manual', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  let orderItems;
  try {
    orderItems = normalizeOrderItems(req.body?.items);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  const mode = resolveCheckoutMode(req.body?.checkoutModeId);
  const totalBefore =
    Math.round(orderItems.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
  const { totalAfter, discount } = applyCheckoutModeToTotal(mode, totalBefore);
  const handledBy =
    typeof req.body?.handledBy === 'string' && req.body.handledBy.trim()
      ? req.body.handledBy.trim()
      : req.session?.username || 'admin';
  const order = {
    id: uuidv4(),
    orderNumber: await nextMerchOrderNumber(),
    items: orderItems,
    checkoutModeId: mode ? mode.id : null,
    checkoutModeName: mode ? mode.name : '原价',
    discount,
    totalBefore,
    totalAfter: Math.round(totalAfter * 100) / 100,
    handledBy,
    paymentMethod:
      typeof req.body?.paymentMethod === 'string' && req.body.paymentMethod.trim()
        ? req.body.paymentMethod.trim()
        : '现金',
    note: typeof req.body?.note === 'string' ? req.body.note.trim() : '',
    createdAt: Number(req.body?.createdAt) || Date.now(),
    manual: true,
  };
  state.merch.orders.push(order);
  if (state.merch.orders.length > 2000) {
    state.merch.orders = state.merch.orders.slice(-2000);
  }
  appendAudit({ action: 'merch-order:manual', actor: req.session?.username || 'admin', detail: `录入订单 ${order.id}` });
  await saveState();
  res.json({ order });
});

app.get('/api/merch/orders/export/csv', requireRole('admin'), (req, res) => {
  ensureMerchState();
  const { since, until, handler, mode, keyword } = req.query || {};
  const parsedSince = since ? Number(since) : null;
  const parsedUntil = until ? Number(until) : null;
  const keywordLower = keyword ? String(keyword).toLowerCase() : '';
  const filtered = state.merch.orders.filter((order) => {
    if (parsedSince && order.createdAt < parsedSince) return false;
    if (parsedUntil && order.createdAt > parsedUntil) return false;
    if (handler && order.handledBy !== handler) return false;
    if (mode && order.checkoutModeId !== mode) return false;
    if (keywordLower) {
      const haystack = [order.note, order.checkoutModeName, order.handledBy]
        .concat((order.items || []).map((i) => `${i.name} ${i.ticketNumber || ''}`))
        .join(' ') //
        .toLowerCase();
      if (!haystack.includes(keywordLower)) return false;
    }
    return true;
  });
  const headers = ['序号', '订单编号', '时间', '操作人', '支付方式', '结账模式', '金额', '立减', '备注', '商品明细'];
  const lines = [headers.join(',')];
  filtered
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((order, idx) => {
      ensureOrderHasNumber(order);
      const detail = (order.items || [])
        .map((i) => `${i.name}×${i.quantity}(${i.subtotal ?? i.unitPrice})`)
        .join(' | ');
      const cols = [
        idx + 1,
        order.orderNumber || '',
        order.createdAt ? new Date(order.createdAt).toLocaleString() : '',
        order.handledBy || '',
        order.paymentMethod || '',
        order.checkoutModeName || '原价',
        order.totalAfter ?? '',
        order.discount ?? '',
        order.note || '',
        detail,
      ].map((v) => {
        const s = String(v ?? '');
        return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
      });
      lines.push(cols.join(','));
    });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Disposition', 'attachment; filename="merch-orders.csv"');
  res.send(lines.join('\n'));
});

app.put('/api/merch/orders/:orderId', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const index = state.merch.orders.findIndex((order) => order.id === req.params.orderId);
  if (index === -1) {
    return res.status(404).json({ error: '记录不存在' });
  }
  const existing = state.merch.orders[index];
  let updatedItems = existing.items;
  if (req.body?.items) {
    try {
      updatedItems = normalizeOrderItems(req.body.items);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  const mode = resolveCheckoutMode(req.body?.checkoutModeId ?? existing.checkoutModeId);
  const totalBefore =
    Math.round(updatedItems.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
  const { totalAfter, discount } = applyCheckoutModeToTotal(mode, totalBefore);
  const updatedOrder = {
    ...existing,
    items: updatedItems,
    checkoutModeId: mode ? mode.id : null,
    checkoutModeName: mode ? mode.name : '原价',
    discount,
    totalBefore,
    totalAfter: Math.round(totalAfter * 100) / 100,
    note:
      req.body?.note !== undefined ? (typeof req.body.note === 'string' ? req.body.note.trim() : '') : existing.note,
    handledBy:
      req.body?.handledBy !== undefined
        ? (typeof req.body.handledBy === 'string' ? req.body.handledBy.trim() : existing.handledBy)
        : existing.handledBy,
    paymentMethod:
      req.body?.paymentMethod !== undefined
        ? (typeof req.body.paymentMethod === 'string' && req.body.paymentMethod.trim()
            ? req.body.paymentMethod.trim()
            : existing.paymentMethod || '现金')
        : existing.paymentMethod || '现金',
    createdAt:
      req.body?.createdAt !== undefined && Number.isFinite(Number(req.body.createdAt))
        ? Number(req.body.createdAt)
        : existing.createdAt,
    manual: existing.manual || Boolean(req.body?.manual),
  };
  state.merch.orders[index] = updatedOrder;
  await saveState();
  appendAudit({ action: 'merch-order:update', actor: req.session?.username || 'admin', detail: `更新订单 ${existing.id}` });
  res.json({ order: updatedOrder });
});

app.delete('/api/merch/orders/:orderId', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const index = state.merch.orders.findIndex((order) => order.id === req.params.orderId);
  if (index === -1) {
    return res.status(404).json({ error: '记录不存在' });
  }
  createStateBackup(`delete-order-${req.params.orderId}`).catch(() => {});
  state.merch.orders.splice(index, 1);
  await saveState();
  appendAudit({ action: 'merch-order:delete', actor: req.session?.username || 'admin', detail: `删除订单 ${req.params.orderId}` });
  res.json({ ok: true });
});

app.get('/api/merch/orders/export', requireRole('admin'), (req, res) => {
  ensureMerchState();
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json({ orders: state.merch.orders });
});

app.get('/api/merch/orders/export/pdf', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  await ensureRedis(); // warm up redis if needed
  const { ids } = req.query || {};
  const idSet = new Set((ids || '').split(',').filter(Boolean));
  const orders =
    idSet.size > 0
      ? state.merch.orders.filter((o) => idSet.has(o.id)).slice(0, 500)
      : state.merch.orders.slice(0, 200);

  await Promise.all(orders.map((o) => ensureOrderHasNumber(o)));

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 30;
  const canvas = createCanvas(pageWidth, pageHeight, 'pdf');
  const ctx = canvas.getContext('2d');

  const drawPageHeader = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, pageWidth, pageHeight);
    ctx.fillStyle = '#111';
    ctx.font = 'bold 16px "Helvetica","Arial",sans-serif';
    ctx.fillText('文创订单导出', margin, margin);
    ctx.font = '12px "Helvetica","Arial",sans-serif';
    ctx.fillText(`生成时间：${new Date().toLocaleString()}`, margin, margin + 18);
  };

  const drawText = (text, x, yPos, font = '12px "Helvetica","Arial",sans-serif') => {
    ctx.font = font;
    ctx.fillStyle = '#111';
    ctx.fillText(text, x, yPos);
  };

  drawPageHeader();
  let y = margin + 40;

  for (let idx = 0; idx < orders.length; idx += 1) {
    const order = orders[idx];
    const items = order.items || [];
    const headerHeight = 140;
    const itemRowH = 64;
    const blockHeight = headerHeight + Math.max(1, items.length) * itemRowH;
    if (y + blockHeight + margin > pageHeight) {
      if (ctx.addPage) {
        ctx.addPage();
        drawPageHeader();
        y = margin + 40;
      }
    }
    ctx.fillStyle = '#f7f9fc';
    ctx.fillRect(margin, y - 8, pageWidth - margin * 2, blockHeight);
    ctx.strokeStyle = '#d8e2f1';
    ctx.strokeRect(margin, y - 8, pageWidth - margin * 2, blockHeight);
    drawText(
      `序号: ${idx + 1}    订单编号: ${order.orderNumber || order.id}`,
      margin + 8,
      y + 4,
      'bold 12px "Helvetica","Arial",sans-serif'
    );
    drawText(`时间: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}`, margin + 8, y + 24);
    drawText(`操作人: ${order.handledBy || '-'}`, margin + 8, y + 44);
    drawText(`支付方式: ${order.paymentMethod || '-'}`, margin + 8, y + 64);
    drawText(`结账模式: ${order.checkoutModeName || '原价'}`, margin + 8, y + 84);
    drawText(
      `金额: ¥${(order.totalAfter ?? 0).toFixed(2)}    立减: ¥${(order.discount ?? 0).toFixed(2)}`,
      margin + 8,
      y + 104
    );
    drawText(`备注: ${order.note || '-'}`, margin + 8, y + 124);
    const labelY = y + 140;
    drawText('商品明细:', margin + 8, labelY, 'bold 12px "Helvetica","Arial",sans-serif');

    let itemY = labelY + 14;
    for (const item of items) {
      const product = item.productId ? state.merch.products[item.productId] : null;
      const imgData = product?.imageData || product?.imagePath;
      let buf = null;
      if (imgData && typeof imgData === 'string') {
        if (imgData.startsWith('data:')) {
          buf = dataUriToBuffer(imgData);
        } else {
          try {
            const p = imgData.startsWith('/') ? path.join(__dirname, 'public', imgData) : path.join(__dirname, imgData);
            buf = fsSync.readFileSync(p);
          } catch {
            buf = null;
          }
        }
      }
      if (buf) {
        try {
          const img = await loadImage(buf);
          ctx.drawImage(img, margin + 8, itemY - 6, 36, 36);
        } catch {
          /* ignore bad image */
        }
      }
      drawText(
        `${item.name || ''} ×${item.quantity}  单价: ¥${(item.unitPrice ?? 0).toFixed(2)}  小计: ¥${(item.subtotal ?? 0).toFixed(2)}`,
        margin + 52,
        itemY + 10
      );
      itemY += itemRowH;
      if (itemY + 20 > y + blockHeight) break;
    }
    y += blockHeight + 16;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="merch-orders-${new Date().toISOString().slice(0, 10)}.pdf"`
  );
  const stream = canvas.createPDFStream();
  stream.pipe(res);
  stream.on('end', () => res.end());
});

app.post('/api/merch/orders/import', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const { orders, mode = 'replace' } = req.body || {};
  if (!Array.isArray(orders)) {
    return res.status(400).json({ error: '导入数据格式无效' });
  }
  const normalizedOrders = [];
  try {
    orders.forEach((entry) => {
      const items = normalizeOrderItems(entry.items || []);
      const modeInstance = resolveCheckoutMode(entry.checkoutModeId);
      const totalBefore = Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
      const result = applyCheckoutModeToTotal(modeInstance, totalBefore);
      normalizedOrders.push({
        id: entry.id && typeof entry.id === 'string' ? entry.id : uuidv4(),
        orderNumber:
          entry.orderNumber && /^297\d{9}\d$/.test(entry.orderNumber) ? entry.orderNumber : nextMerchOrderNumber(),
        items,
        checkoutModeId: modeInstance ? modeInstance.id : null,
        checkoutModeName: modeInstance ? modeInstance.name : '原价',
        discount: result.discount,
        totalBefore,
        totalAfter: Math.round(result.totalAfter * 100) / 100,
        handledBy: entry.handledBy || 'imported',
        paymentMethod:
          typeof entry.paymentMethod === 'string' && entry.paymentMethod.trim()
            ? entry.paymentMethod.trim()
            : '现金',
        note: typeof entry.note === 'string' ? entry.note.trim() : '',
        createdAt: Number(entry.createdAt) || Date.now(),
        manual: Boolean(entry.manual),
      });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  createStateBackup('import-orders').catch(() => {});
  if (mode === 'append') {
    state.merch.orders = [...state.merch.orders, ...normalizedOrders].slice(-2000);
  } else {
    state.merch.orders = normalizedOrders.slice(-2000);
  }
  await saveState();
  appendAudit({ action: 'merch-order:import', actor: req.session?.username || 'admin', detail: `导入订单 ${normalizedOrders.length} 条` });
  res.json({ count: normalizedOrders.length });
});

app.get('/api/merch/orders/:orderId/statement.pdf', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  const order = state.merch.orders.find((o) => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ error: '记录不存在' });

  const bwipjs = require('bwip-js');

  // A4 portrait @72dpi
  const width = 595;
  const height = 842;
  const margin = 28;

  // 4:1 split
  const topHeight = Math.floor(height * 0.8);
  const bottomHeight = height - topHeight;

  const canvas = createCanvas(width, height, 'pdf');
  const ctx = canvas.getContext('2d');

  // ---------- styles ----------
  const fonts = {
    title: 'bold 16px "Helvetica","Arial",sans-serif',
    subtitle: 'bold 11px "Helvetica","Arial",sans-serif',
    bold: 'bold 11px "Helvetica","Arial",sans-serif',
    normal: '11px "Helvetica","Arial",sans-serif',
    small: '9.5px "Helvetica","Arial",sans-serif',
  };
  const colors = {
    black: '#111111',
    gray: '#666666',
    line: '#bdbdbd',
    lightLine: '#e5e7eb',
    bg: '#ffffff',
    headerBg: '#f5f5f5',
    zebra: '#fafafa',
  };
  const lineH = 15;

  // ---------- data ----------
  const merchant = {
    name: '北京市八一学校学生会',
    addr: '北京市海淀区苏州街29号',
  };

  const operator = order.handledBy || '—';
  const orderId = order.id;
  const orderNo = order.orderNumber || order.id;
  const createdAtStr = new Date(order.createdAt).toLocaleString();
  const checkoutMode = order.checkoutModeName || '原价';
  const paymentMethod = order.paymentMethod || '线下';
  const note = order.note || '（无）';
  const items = order.items || [];

  const subtotal = order.totalBefore ?? order.totalAfter ?? 0; // 未折扣总金额
  const discount = order.discount ?? 0;
  const tax = order.tax ?? 0;
  const total = order.totalAfter ?? (subtotal - discount + tax);
  const totalQty = items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);

  // ---------- helpers ----------
  const text = (str, x, y, font = fonts.normal, color = colors.black, align = 'left') => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(String(str), x, y);
    ctx.textAlign = 'left';
  };

  const rect = (x, y, w, h, stroke = colors.line, lw = 1) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.strokeRect(x, y, w, h);
  };

  const hline = (x1, x2, y, stroke = colors.line, lw = 1, dash = []) => {
    ctx.save();
    ctx.setLineDash(dash);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    ctx.restore();
  };

  const vline = (x, y1, y2, stroke = colors.line, lw = 1) => {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  };

  const wrapText = (str, maxWidth, font = fonts.normal) => {
    ctx.font = font;
    const words = String(str || '').split(/(\s+)/);
    const lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur + w;
      if (ctx.measureText(t).width > maxWidth && cur) {
        lines.push(cur.trim());
        cur = w.trim();
      } else {
        cur = t;
      }
    }
    if (cur) lines.push(cur.trim());
    return lines;
  };

  const money = (n) => {
    const v = Number(n || 0);
    return '¥' + v.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // 真实可扫 PDF417（高分辨率+关闭插值+等比居中）
  const drawBarcodePDF417 = async (payload, x, y, boxW, boxH) => {
    const png = await bwipjs.toBuffer({
      bcid: 'pdf417',
      text: payload,
      scale: 6,
      columns: 8,
      eclevel: 4,
      includetext: false,
      paddingwidth: 2,
      paddingheight: 2,
      backgroundcolor: 'FFFFFF',
    });

    const img = new Image();
    img.src = png;

    rect(x, y, boxW, boxH, colors.line);

    const ratio = Math.min(boxW / img.width, boxH / img.height);
    const dw = Math.round(img.width * ratio);
    const dh = Math.round(img.height * ratio);
    const dx = Math.round(x + (boxW - dw) / 2);
    const dy = Math.round(y + (boxH - dh) / 2);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  };

  // ============================================================
  // 上半区：商品收据明细（4/5）
  // ============================================================
  let y = margin;

  // 标题区（高级感：短横线+灰色元信息）
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.black;
  ctx.beginPath();
  ctx.moveTo(margin, y + 4);
  ctx.lineTo(margin + 40, y + 4);
  ctx.stroke();

  text('商品收据明细', width / 2, y + 8, fonts.title, colors.black, 'center');
  text('Product Statement', width / 2, y + 24, fonts.subtitle, colors.gray, 'center');
  text(`订单编号 ${orderNo}  ·  ${createdAtStr}`, width / 2, y + 40, fonts.small, colors.gray, 'center');
  y += 54;

  // 抬头两列（按你要求字段）
  const headerTop = y;
  const leftColW = 250;
  const leftX = margin;
  const rightX = margin + leftColW + 12;

  text(`操作人：${operator}`, leftX, headerTop);
  text(`订单ID：${orderId}`, leftX, headerTop + lineH);
  text(`订单编号：${orderNo}`, leftX, headerTop + lineH * 2);

  text(`商家：${merchant.name}`, rightX, headerTop);
  text(`地址：${merchant.addr}`, rightX, headerTop + lineH);
  text(`时间：${createdAtStr}`, rightX, headerTop + lineH * 2);

  y = headerTop + lineH * 3 + 8;
  hline(margin, width - margin, y, colors.line);
  y += 10;

  // 明细表（6列）
  const tableX = margin;
  const tableW = width - margin * 2;
  const colDefs = [
    { label: '编号', w: 50, align: 'left' },
    { label: '名称', w: 250, align: 'left' },
    { label: '数量', w: 55, align: 'right' },
    { label: '单价', w: 75, align: 'right' },
    { label: '总价', w: 75, align: 'right' },
    { label: '备注', w: 62, align: 'left' },
  ];
  const headerH = 22;
  const rowMinH = 18;

  // 给上半区留出：右下角卡片 + 4格结算 + 备注签章 + 条码
  const tableMaxH = topHeight - y - 190;

  // 外框
  rect(tableX, y, tableW, tableMaxH, colors.line);

  // 表头背景浅灰
  ctx.fillStyle = colors.headerBg;
  ctx.fillRect(tableX, y, tableW, headerH);

  // 表头下边线稍粗
  hline(tableX, tableX + tableW, y + headerH, colors.black, 1.5);

  // 表头文本 + 竖线
  let cx = tableX;
  colDefs.forEach((c) => {
    text(c.label, cx + 4, y + 15, fonts.bold, colors.black);
    cx += c.w;
    vline(cx, y, y + tableMaxH, colors.line);
  });

  // 表体
  let ry = y + headerH + 4;
  items.forEach((it, i) => {
    const nameLines = wrapText(it.name || '', colDefs[1].w - 8);
    const noteLines = wrapText(it.note || '', colDefs[5].w - 8, fonts.small);
    const maxLines = Math.max(nameLines.length, noteLines.length, 1);
    const rowH = Math.max(rowMinH, maxLines * lineH);

    if (ry + rowH > y + tableMaxH - 6) return;

    // 斑马纹
    if (i % 2 === 1) {
      ctx.fillStyle = colors.zebra;
      ctx.fillRect(tableX, ry - 2, tableW, rowH);
    }

    // 行分隔线
    hline(tableX, tableX + tableW, ry - 2, colors.lightLine);

    cx = tableX;
    text(i + 1, cx + 4, ry + lineH - 3);
    cx += colDefs[0].w;

    nameLines.forEach((ln, li) => text(ln, cx + 4, ry + li * lineH + lineH - 3));
    cx += colDefs[1].w;

    text(it.quantity ?? 0, cx + colDefs[2].w - 6, ry + lineH - 3, fonts.normal, colors.black, 'right');
    cx += colDefs[2].w;

    text(it.unitPrice != null ? money(it.unitPrice) : '', cx + colDefs[3].w - 6, ry + lineH - 3, fonts.normal, colors.black, 'right');
    cx += colDefs[3].w;

    text(it.subtotal != null ? money(it.subtotal) : '', cx + colDefs[4].w - 6, ry + lineH - 3, fonts.normal, colors.black, 'right');
    cx += colDefs[4].w;

    noteLines.forEach((ln, li) => text(ln, cx + 4, ry + li * lineH + lineH - 3, fonts.small));

    ry += rowH;
  });

  const tableBottomY = y + tableMaxH;
  y = tableBottomY + 6;

  // 表格外右下角：小卡片（未折扣总金额 + 总件数）
  const cardW = 180;
  const cardH = 36;
  const cardX = width - margin - cardW;
  const cardY = tableBottomY + 6;
  rect(cardX, cardY, cardW, cardH, colors.line);

  text(`未折扣总金额 ${money(subtotal)}`, cardX + 8, cardY + 14, fonts.small, colors.black);
  text(`总件数 ${totalQty}`, cardX + 8, cardY + 30, fonts.small, colors.black);

  y = cardY + cardH + 8;

  // 四个横排小表格（未折扣总金额、应付金额、结账方式、支付方式）
  const grids = [
    { k: '未折扣总金额', v: money(subtotal) },
    { k: '应付金额', v: money(total) },
    { k: '结账方式', v: checkoutMode },
    { k: '支付方式', v: paymentMethod },
  ];

  const gridX = margin;
  const gap = 6;
  const gridW = (tableW - gap * 3) / 4;
  const gridH = 26;

  let gx = gridX;
  grids.forEach((g) => {
    rect(gx, y, gridW, gridH, colors.line);
    text(g.k, gx + 6, y + 10, fonts.small, colors.gray);
    text(g.v, gx + gridW - 6, y + 20, fonts.bold, colors.black, 'right');
    gx += gridW + gap;
  });

  y += gridH + 10;

  // 备注 + 签章区
  text(`订单备注：${note}`, margin, y + 12, fonts.normal);

  const stampW = 170;
  const stampH = 32;
  const stampX = width - margin - stampW;
  rect(stampX, y, stampW, stampH, colors.line);
  text('签章 / Stamp', stampX + 6, y + 20, fonts.small, colors.gray);

  y += stampH + 8;

  // 条码 payload（简短可扫）
  const payload = JSON.stringify({
    orderNo,
    total: Number(total.toFixed(2)),
    pay: paymentMethod,
    time: createdAtStr,
  });

  // 条码槽位（高级感：标题+留白）
  const barBoxW = 240;
  const barBoxH = 70;
  const barX = margin;
  const barY = topHeight - margin - barBoxH;

  text('条码 / Barcode', barX, barY - 6, fonts.small, colors.gray);
  await drawBarcodePDF417(payload, barX + 6, barY + 6, barBoxW - 12, barBoxH - 12);
  rect(barX, barY, barBoxW, barBoxH, colors.line);

  text('PDF417（扫码查看收据信息）', barX, barY + barBoxH + 12, fonts.small, colors.gray);

  // 虚线撕口
  hline(margin, width - margin, topHeight, colors.gray, 1, [5, 5]);

  // ============================================================
  // 下半区：收据联（1/5）
  // ============================================================
  let ry2 = topHeight + 14;
  const receiptBoxY = ry2 - 6;
  const receiptBoxH = bottomHeight - margin;
  rect(margin, receiptBoxY, tableW, receiptBoxH, colors.line);

  text('收据', width / 2, ry2 + 10, fonts.title, colors.black, 'center');
  text('Receipt Copy', width / 2, ry2 + 24, fonts.subtitle, colors.gray, 'center');
  ry2 += 42;

  // 预留条码区，避免遮挡文字
  const bar2W = 200;
  const bar2H = 50;
  const bar2X = margin + 6;
  const bar2Y = receiptBoxY + receiptBoxH - bar2H - 10;

  // 左侧信息
  text(`${merchant.name}`, margin + 6, ry2, fonts.normal);
  text(`订单编号：${orderNo}`, margin + 6, ry2 + lineH, fonts.small, colors.gray);
  text(`时间：${createdAtStr}`, margin + 6, ry2 + lineH * 2, fonts.small, colors.gray);

  // 右侧金额重点（高级感：大号右对齐）
  const rightInfoX2 = width / 2 + 20;
  text('总金额', rightInfoX2, ry2, fonts.small, colors.gray);
  text(money(total), width - margin - 6, ry2 + 6, 'bold 15px "Helvetica","Arial"', colors.black, 'right');
  text(`支付方式：${paymentMethod}`, rightInfoX2, ry2 + lineH * 2, fonts.normal);

  // 收据联条码（可扫）
  text('条码 / Barcode', bar2X, bar2Y - 4, fonts.small, colors.gray);
  await drawBarcodePDF417(payload, bar2X, bar2Y, bar2W, bar2H);

  // ---------- output ----------
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="merch-statement-${order.id}.pdf"`);

  const stream = canvas.createPDFStream();
  stream.pipe(res);
  stream.on('end', () => res.end());
});



app.post('/api/merch/orders/clear', requireRole('admin'), async (req, res) => {
  ensureMerchState();
  if (!state.merch.orders.length) {
    return res.json({ ok: true, cleared: 0 });
  }
  createStateBackup('clear-orders').catch(() => {});
  const cleared = state.merch.orders.length;
  state.merch.orders = [];
  await saveState();
  appendAudit({ action: 'merch-order:clear', actor: req.session?.username || 'admin', detail: `清除订单 ${cleared} 条` });
  res.json({ ok: true, cleared });
});

app.post('/api/checkins/seat', requireRole('admin'), async (req, res) => {
  const { ticketNumber, action } = req.body || {};
  if (!ticketNumber || typeof ticketNumber !== 'string') {
    return res.status(400).json({ error: '请输入票号' });
  }
  const normalized = ticketNumber.trim();
  let lock;
  try {
    lock = await acquireLock(`checkin:admin:${normalized.toUpperCase()}`);
  } catch (error) {
    return res.status(503).json({ error: '系统繁忙，请稍后重试' });
  }
  try {
    let foundSeat = null;
    let foundProject = null;
    Object.values(state.projects).some((project) => {
      const matches = findSeatsByTicketCode(project, normalized);
      if (matches.length > 1) {
        foundSeat = null;
        foundProject = null;
        return true;
      }
      if (matches.length === 1) {
        foundSeat = matches[0];
        foundProject = project;
        return true;
      }
      return false;
    });
    if (foundProject === null && foundSeat === null) {
      return res.status(409).json({ error: '票号重复，请先处理重复票号' });
    }
    if (!foundSeat || !foundProject) {
      return res.status(404).json({ error: '未找到该票号' });
    }
    ensureSeatCheckinState(foundSeat);
    if (action === 'clear') {
      resetSeatCheckin(foundSeat);
      appendAudit({
        action: 'checkin:clear',
        actor: req.session?.username || 'admin',
        detail: `清除检票 ${normalized}`,
      });
      appendCheckinLog({
        id: uuidv4(),
        ...buildSeatCheckinPayload(foundProject, foundSeat),
        status: 'cleared',
        message: '管理端清除检票状态',
        handledBy: req.session?.username || 'admin',
        createdAt: Date.now(),
      });
      await saveState();
      broadcastProject(foundProject.id);
      return res.json({ ok: true, seat: buildSeatCheckinPayload(foundProject, foundSeat) });
    }
    // action === 'checked'
    foundSeat.checkedInAt = Date.now();
    foundSeat.checkedInBy = req.session?.username || 'admin';
    appendAudit({
      action: 'checkin:override',
      actor: req.session?.username || 'admin',
      detail: `标记已检 ${normalized}`,
    });
    appendCheckinLog({
      id: uuidv4(),
      ...buildSeatCheckinPayload(foundProject, foundSeat),
      status: 'override',
      message: '管理端标记为已检',
      handledBy: foundSeat.checkedInBy,
      createdAt: foundSeat.checkedInAt,
    });
    await saveState();
    broadcastProject(foundProject.id);
    res.json({ ok: true, seat: buildSeatCheckinPayload(foundProject, foundSeat) });
  } finally {
    lock();
  }
});

app.patch('/api/accounts/:username', requireRole('admin'), async (req, res) => {
  const targetUsername = req.params.username;
  const account = getAccount(targetUsername);
  if (!account) {
    return res.status(404).json({ error: '账号不存在' });
  }
  const { password, role } = req.body || {};
  if (role && !['admin', 'sales'].includes(role)) {
    return res.status(400).json({ error: '角色无效' });
  }
  if (role && role !== account.role) {
    if (account.role === 'admin' && role !== 'admin' && countAccountsByRole('admin') <= 1) {
      return res.status(400).json({ error: '至少需要保留一个管理员账号' });
    }
    account.role = role;
  }
  if (password) {
    account.passwordHash = await hashPassword(password);
  }
  account.updatedAt = Date.now();
  state.accounts[normalizeUsername(account.username)] = account;
  await saveState();
  broadcastAdminUpdate();
  res.json({ ok: true });
});

app.delete('/api/accounts/:username', requireRole('admin'), (req, res) => {
  const targetUsername = req.params.username;
  const account = getAccount(targetUsername);
  if (!account) {
    return res.status(404).json({ error: '账号不存在' });
  }
  if (account.role === 'admin' && countAccountsByRole('admin') <= 1) {
    return res.status(400).json({ error: '至少需要保留一个管理员账号' });
  }
  const currentSession = parseSession(req);
  if (currentSession && normalizeUsername(currentSession.username) === normalizeUsername(targetUsername)) {
    return res.status(400).json({ error: '无法删除当前登录账号' });
  }
  createStateBackup(`delete-account-${normalizeUsername(targetUsername)}`).catch(() => {});
  removeAccount(targetUsername);
  saveState().catch((err) => console.error('Failed to save state after delete account', err));
  broadcastAdminUpdate();
  res.json({ ok: true });
});

app.get('/api/projects', optionalSession, (_req, res) => {
  const projects = Object.values(state.projects).map((project) => ({
    id: project.id,
    name: project.name,
    rows: project.rows,
    cols: project.cols,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    availableSeats: Object.values(project.seats).filter((seat) => seat.status === 'available')
      .length,
  }));
  res.json({ projects });
});

app.post('/api/projects', requireRole('admin'), (req, res) => {
  const { name, rows, cols, ticketing } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: '请输入项目名称' });
  }
  if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
    return res.status(400).json({ error: '行列数必须为正整数' });
  }
  if (rows > 200 || cols > 200) {
    return res.status(400).json({ error: '行列数过大，建议控制在 200 以内' });
  }
  const project = createEmptyProject({ name: name.trim(), rows, cols });
  try {
    if (ticketing) {
      regenerateSeatTicketNumbers(project, ticketing);
    } else {
      ensureSeatTicketNumbers(project, { force: true });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  assignSeatLabels(project);
  state.projects[project.id] = project;
  saveState().catch((err) => console.error('Failed to save state after create project', err));
  broadcastProject(project.id);
  res.json({ project });
});

app.delete('/api/projects/:projectId', requireRole('admin'), (req, res) => {
  const { projectId } = req.params;
  if (!state.projects[projectId]) {
    return res.status(404).json({ error: '项目不存在' });
  }
  createStateBackup(`delete-project-${projectId}`).catch(() => {});
  delete state.projects[projectId];
  saveState().catch((err) => console.error('Failed to save state after delete project', err));
  res.json({ ok: true });
});

const serializeProject = (project) => {
  ensureProjectTicketing(project);
  return {
    id: project.id,
    name: project.name,
    rows: project.rows,
    cols: project.cols,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    seats: project.seats,
    ticketing: project.ticketing,
    priceColorAssignments: project.priceColorAssignments,
    seatLabelProgress: project.seatLabelProgress,
  };
};

const exportProjectCsv = (project) => {
  const headers = ['row', 'col', 'status', 'price', 'ticketNumber', 'seatLabel'];
  const lines = [headers.join(',')];
  Object.values(project.seats || {})
    .sort((a, b) => (a.row === b.row ? a.col - b.col : a.row - b.row))
    .forEach((seat) => {
      const row = seat.row + 1;
      const col = seat.col + 1;
      const status = seat.status || '';
      const price = seat.price != null ? seat.price : '';
      const ticketNumber = seat.ticketNumber || '';
      const seatLabel = seat.seatLabel || '';
      const safe = [row, col, status, price, ticketNumber, seatLabel]
        .map((v) => {
          const s = String(v ?? '');
          return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(',');
      lines.push(safe);
    });
  return lines.join('\n');
};

const renderProjectPng = async (project) => {
  const rows = project.rows || 1;
  const cols = project.cols || 1;
  const cell = 14;
  const padding = 20;
  const width = cols * cell + padding * 2;
  const height = rows * cell + padding * 2 + 20;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#e5e7eb';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${project.name || '项目'} ${rows}x${cols}`, padding, padding - 6);
  const seats = project.seats || {};
  const statusColor = (seat) => {
    if (!seat || seat.status === 'disabled') return '#1f2430';
    if (seat.status === 'sold' && seat.checkedInAt) return '#2ecc71';
    if (seat.status === 'sold') return '#ffcf70';
    if (seat.status === 'locked') return '#3b82f6';
    return '#e5e7eb';
  };
  Object.values(seats).forEach((seat) => {
    const x = padding + seat.col * cell;
    const y = padding + seat.row * cell + 10;
    ctx.fillStyle = statusColor(seat);
    ctx.fillRect(x, y, cell - 2, cell - 2);
  });
  return canvas.toBuffer('image/png');
};

function broadcastProject(projectId) {
  const project = state.projects[projectId];
  if (!project) return;
  io.to(`project:${projectId}`).emit('project:update', {
    projectId,
    project: serializeProject(project),
  });
}

const listAccountsForClient = () =>
  Object.values(state.accounts)
    .map(({ username, role, createdAt, updatedAt }) => ({ username, role, createdAt, updatedAt }))
    .sort((a, b) => {
      if (a.role === b.role) {
        return a.username.localeCompare(b.username);
      }
      return a.role.localeCompare(b.role);
    });

const broadcastAdminUpdate = () => {
  io.emit('admin:accounts:update', { accounts: listAccountsForClient() });
};

app.get('/api/projects/:projectId', optionalSession, (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  res.json({ project: serializeProject(project) });
});

app.get('/api/projects/:projectId/export', requireRole('admin'), (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  res.json({ project: serializeProject(project) });
});

app.get('/api/projects/:projectId/export/json', requireRole('admin'), (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  const payload = { project: serializeProject(project) };
  const filename = `project-${project.id}.json`;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(JSON.stringify(payload, null, 2));
});

app.get('/api/projects/:projectId/export/csv', requireRole('admin'), (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  const csv = exportProjectCsv(project);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="project-${project.id}.csv"`);
  res.send(csv);
});

app.get('/api/projects/:projectId/export/png', requireRole('admin'), async (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  try {
    const buffer = await renderProjectPng(project);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="project-${project.id}.png"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message || '导出失败' });
  }
});

app.get('/api/projects/:projectId/checkin/stats', optionalSession, (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  const stats = computeCheckinStats(project);
  res.json({ stats });
});

app.post('/api/projects/:projectId/checkin', requireSalesOrAdmin, async (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  const ticketCode = typeof req.body?.ticketCode === 'string' ? req.body.ticketCode.trim() : '';
  const scannerId = typeof req.body?.scannerId === 'string' ? req.body.scannerId : '';
  if (!ticketCode) {
    return res.status(400).json({ error: '请提供票号' });
  }
  let lock;
  try {
    lock = await acquireLock(`checkin:${project.id}:${ticketCode.toUpperCase()}`);
  } catch (error) {
    return res.status(503).json({ error: '系统繁忙，请重试' });
  }
  const matches = findSeatsByTicketCode(project, ticketCode);
  try {
    if (!matches.length) {
      return res.status(404).json({ error: '未找到该票号' });
    }
    if (matches.length > 1) {
      return res.status(409).json({ error: '票号重复，请先处理重复票号后再检票' });
    }
    const seat = matches[0];
    ensureSeatCheckinState(seat);
    const payload = buildSeatCheckinPayload(project, seat);
    if (seat.status !== 'sold') {
      return res.status(400).json({ error: '该票尚未签发或已作废，无法检票', seat: payload });
    }
    if (seat.checkedInAt) {
      return res.status(409).json({
        error: '已检票',
        seat: payload,
        checkedInAt: seat.checkedInAt,
        checkedInBy: seat.checkedInBy,
      });
    }
    seat.checkedInAt = Date.now();
    seat.checkedInBy = req.session?.username || scannerId || 'unknown';
    project.updatedAt = Date.now();
    const updatedPayload = buildSeatCheckinPayload(project, seat);
    appendCheckinLog({
      id: uuidv4(),
      ...updatedPayload,
      status: 'success',
      message: '检票成功',
      handledBy: updatedPayload.checkedInBy,
      createdAt: seat.checkedInAt,
    });
    await saveState();
    broadcastProject(project.id);
    const stats = computeCheckinStats(project);
    res.json({ ok: true, seat: updatedPayload, stats });
  } finally {
    lock();
  }
});

app.post('/api/projects/:projectId/checkin/batch', requireSalesOrAdmin, async (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  const codes = Array.isArray(req.body?.ticketCodes) ? req.body.ticketCodes : [];
  if (!codes.length) {
    return res.status(400).json({ error: '请提供 ticketCodes 数组' });
  }
  const results = [];
  let hasSuccess = false;
  for (const raw of codes) {
    const ticketCode = typeof raw === 'string' ? raw.trim() : '';
    if (!ticketCode) {
      results.push({ ticketCode: raw, ok: false, error: '票号无效' });
      continue;
    }
    let lock;
    try {
      lock = await acquireLock(`checkin:${project.id}:${ticketCode.toUpperCase()}`);
    } catch (error) {
      results.push({ ticketCode, ok: false, error: '系统繁忙，请重试' });
      continue;
    }
    try {
      const matches = findSeatsByTicketCode(project, ticketCode);
      if (!matches.length) {
        results.push({ ticketCode, ok: false, error: '未找到该票号' });
        continue;
      }
      if (matches.length > 1) {
        results.push({ ticketCode, ok: false, error: '票号重复，请先处理重复票号' });
        continue;
      }
      const seat = matches[0];
      ensureSeatCheckinState(seat);
      const payload = buildSeatCheckinPayload(project, seat);
      if (seat.status !== 'sold') {
        results.push({ ticketCode, ok: false, error: '票未售出或已作废', seat: payload });
        continue;
      }
      if (seat.checkedInAt) {
        results.push({
          ticketCode,
          ok: false,
          error: '已检票',
          seat: payload,
          checkedInAt: seat.checkedInAt,
          checkedInBy: seat.checkedInBy,
        });
        continue;
      }
      seat.checkedInAt = Date.now();
      seat.checkedInBy = req.session?.username || req.body?.scannerId || 'unknown';
      project.updatedAt = Date.now();
      const updatedPayload = buildSeatCheckinPayload(project, seat);
      appendCheckinLog({
        id: uuidv4(),
        ...updatedPayload,
        status: 'success',
        message: '检票成功',
        handledBy: updatedPayload.checkedInBy,
        createdAt: seat.checkedInAt,
      });
      results.push({ ticketCode, ok: true, seat: updatedPayload });
      hasSuccess = true;
    } finally {
      lock();
    }
  }
  await saveState();
  if (hasSuccess) broadcastProject(project.id);
  res.json({ results });
});

app.get('/api/checkins', requireRole('admin'), (req, res) => {
  ensureCheckinLogs();
  const { projectId, limit = 500 } = req.query || {};
  const lim = Math.min(2000, Math.max(1, Number(limit) || 500));
  const logs = state.checkInLogs
    .filter((log) => (!projectId ? true : log.projectId === projectId))
    .slice(0, lim);
  res.json({ logs });
});

app.get('/api/audit', requireRole('admin'), (req, res) => {
  ensureAuditState();
  const { action, limit = 300, offset = 0 } = req.query || {};
  const lim = Math.min(2000, Math.max(1, Number(limit) || 300));
  const off = Math.max(0, Number(offset) || 0);
  const logs = state.auditLog
    .filter((log) => (!action ? true : log.action === action))
    .slice(off, off + lim);
  res.json({ logs });
});

app.get('/api/audit/export', requireRole('admin'), (req, res) => {
  ensureAuditState();
  const { action, limit = 1000 } = req.query || {};
  const lim = Math.min(5000, Math.max(1, Number(limit) || 1000));
  const logs = state.auditLog
    .filter((log) => (!action ? true : log.action === action))
    .slice(0, lim);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="audit-log.json"');
  res.send(JSON.stringify({ logs }, null, 2));
});

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/api/backups', requireRole('admin'), async (_req, res) => {
  const backups = await listBackups();
  res.json({ backups });
});

app.post('/api/backups/restore', requireRole('admin'), async (req, res) => {
  const { filename } = req.body || {};
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: '请提供 filename' });
  }
  const filePath = path.join(BACKUP_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return res.status(400).json({ error: '备份文件格式不正确' });
    }
    state = parsed;
    ensureMerchState();
    ensureAuditState();
    Object.values(state.projects).forEach(ensureProjectMetadata);
    await saveState();
    appendAudit({ action: 'backup:restore', actor: req.session?.username || 'admin', detail: `恢复备份 ${filename}` });
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message || '恢复失败' });
  }
});

app.get('/logs', requireRole('admin'), (req, res) => {
  ensureAuditState();
  const { limit = 500 } = req.query || {};
  const lim = Math.min(1000, Math.max(1, Number(limit) || 500));
  const audit = (state.auditLog || []).slice(0, lim).map((log) => ({
    createdAt: log.createdAt,
    action: log.action,
    actor: log.actor,
    detail: typeof log.detail === 'string' ? log.detail.slice(0, 200) : '',
  }));
  res.setHeader('Cache-Control', 'no-store');
  res.json({ audit });
});

app.post('/api/projects/:projectId/import', requireRole('admin'), async (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  ensureProjectMetadata(project);
  const body = req.body || {};
  const payload = (body && typeof body === 'object' && (body.project || body)) || {};
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: '导入数据无效' });
  }
  if (
    (payload.rows && payload.rows !== project.rows) ||
    (payload.cols && payload.cols !== project.cols)
  ) {
    return res.status(400).json({ error: '导入数据的行列数与现有项目不一致' });
  }
  if (payload.name && typeof payload.name === 'string' && payload.name.trim()) {
    project.name = payload.name.trim();
  }
  let incomingSeats = null;
  if (payload.seats && typeof payload.seats === 'object' && !Array.isArray(payload.seats)) {
    incomingSeats = payload.seats;
  } else if (Array.isArray(payload.seats)) {
    // 兼容 seats 数组格式
    incomingSeats = {};
    payload.seats.forEach((seat) => {
      if (!seat || typeof seat !== 'object') return;
      const r = Number(seat.row);
      const c = Number(seat.col);
      if (Number.isInteger(r) && Number.isInteger(c)) {
        incomingSeats[`r${r}-c${c}`] = { ...seat };
      }
    });
  }
  if (!incomingSeats) {
    return res.status(400).json({ error: '导入数据缺少座位信息（需要 seats 对象或数组）' });
  }
  const allowedStatuses = ['disabled', 'available', 'locked', 'sold'];
  Object.entries(project.seats).forEach(([id, seat]) => {
    ensureSeatCheckinState(seat);
    const incoming = incomingSeats[id];
    if (!incoming || typeof incoming !== 'object') {
      seat.status = 'disabled';
      seat.price = null;
      seat.ticketNumber = null;
      seat.ticketCode = null;
      seat.ticketSequenceValue = null;
      seat.seatLabel = null;
      seat.lockedBy = null;
      seat.lockExpiresAt = null;
      seat.issuedAt = null;
      resetSeatCheckin(seat);
      return;
    }
    const status = allowedStatuses.includes(incoming.status) ? incoming.status : 'disabled';
    seat.status = status;
    const incomingPrice = incoming.price;
    if (status === 'disabled') {
      seat.price = null;
    } else if (typeof incomingPrice === 'number' && Number.isFinite(incomingPrice)) {
      seat.price = incomingPrice;
      ensurePriceColorAssignment(project, seat.price);
    } else {
      seat.price = null;
    }
    const ticketNumber = typeof incoming.ticketNumber === 'string' ? incoming.ticketNumber.trim() : '';
    seat.ticketNumber = ticketNumber || null;
    seat.ticketCode = seat.ticketNumber;
    seat.ticketSequenceValue =
      typeof incoming.ticketSequenceValue === 'number' && Number.isFinite(incoming.ticketSequenceValue)
        ? incoming.ticketSequenceValue
        : null;
    if (status === 'sold') {
      seat.issuedAt = typeof incoming.issuedAt === 'number' ? incoming.issuedAt : Date.now();
    } else {
      seat.issuedAt = null;
    }
    seat.lockedBy = null;
    seat.lockExpiresAt = null;
    const incomingLabel = typeof incoming.seatLabel === 'string' ? incoming.seatLabel.trim() : '';
    seat.seatLabel = incomingLabel || null;
    seat.checkedInAt =
      status === 'sold' && typeof incoming.checkedInAt === 'number' ? incoming.checkedInAt : null;
    seat.checkedInBy =
      status === 'sold' && typeof incoming.checkedInBy === 'string' ? incoming.checkedInBy : null;
  });

  if (payload.ticketing && typeof payload.ticketing === 'object') {
    project.ticketing = payload.ticketing;
  }
  if (payload.priceColorAssignments && typeof payload.priceColorAssignments === 'object') {
    project.priceColorAssignments = { ...payload.priceColorAssignments };
  }
  if (payload.seatLabelProgress && typeof payload.seatLabelProgress === 'object') {
    project.seatLabelProgress = { ...payload.seatLabelProgress };
  }

  ensureProjectMetadata(project);
  ensureProjectTicketing(project);
  refreshPriceAssignments(project);
  assignSeatLabels(project);
  try {
    ensureSeatTicketNumbers(project);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  project.updatedAt = Date.now();
  await saveState();
  broadcastProject(project.id);
  res.json({ project: serializeProject(project) });
});

app.put('/api/projects/:projectId', requireRole('admin'), async (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  ensureProjectMetadata(project);
  const { name, seats: seatUpdates } = req.body || {};
  if (name && typeof name === 'string' && name.trim()) {
    project.name = name.trim();
  }
  if (Array.isArray(seatUpdates)) {
    const normalized = sanitizeSeatsUpdate(project, seatUpdates);
    const affectedRows = new Set();
    Object.entries(normalized).forEach(([id, payload]) => {
      const seat = project.seats[id];
      if (!seat) return;
      if (Number.isInteger(payload.row)) {
        affectedRows.add(payload.row);
      } else if (Number.isInteger(seat.row)) {
        affectedRows.add(seat.row);
      }
      if (payload.ticketNumber !== undefined) {
        const ticketNumber = payload.ticketNumber || null;
        seat.ticketNumber = ticketNumber;
        seat.ticketCode = ticketNumber;
        if (project.ticketing?.mode === 'sequence') {
          const sequence = prepareSequenceState(project);
          const value = deriveSequenceValue(sequence, ticketNumber);
          seat.ticketSequenceValue = value;
          if (sequence && value && value > sequence.nextValue) {
            sequence.nextValue = value;
          }
        } else {
          seat.ticketSequenceValue = null;
        }
      }
      if (payload.status) {
        const status = payload.status;
        if (status === 'available') {
          seat.status = 'available';
          seat.lockedBy = null;
          seat.lockExpiresAt = null;
          seat.issuedAt = null;
          resetSeatCheckin(seat);
          if (seat.price != null) {
            ensurePriceColorAssignment(project, seat.price);
          }
        } else if (status === 'locked') {
          seat.status = 'locked';
          seat.lockedBy = null;
          seat.lockExpiresAt = null;
          resetSeatCheckin(seat);
        } else if (status === 'sold') {
          seat.status = 'sold';
          seat.lockedBy = null;
          seat.lockExpiresAt = null;
          seat.issuedAt = Date.now();
        } else {
          seat.status = 'disabled';
          seat.lockedBy = null;
          seat.lockExpiresAt = null;
          seat.issuedAt = null;
          seat.price = null;
          seat.ticketNumber = null;
          seat.ticketCode = null;
          seat.ticketSequenceValue = null;
          resetSeatCheckin(seat);
        }
      }
      if (payload.price !== undefined) {
        if (seat.status === 'disabled') {
          seat.price = null;
        } else {
          seat.price = payload.price;
          if (seat.price != null) {
            ensurePriceColorAssignment(project, seat.price);
          }
        }
      }
    });
    refreshPriceAssignments(project);
    assignSeatLabels(project, affectedRows);
    try {
      ensureSeatTicketNumbers(project);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  project.updatedAt = Date.now();
  await saveState();
  broadcastProject(project.id);
  res.json({ project: serializeProject(project) });
});

app.post('/api/projects/:projectId/ticketing', requireRole('admin'), async (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  const config = req.body || {};
  try {
    if (!config.mode) {
      regenerateSeatTicketNumbers(project, null);
    } else {
      regenerateSeatTicketNumbers(project, config);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  project.updatedAt = Date.now();
  await saveState();
  broadcastProject(project.id);
  res.json({ project: serializeProject(project) });
});

app.post('/api/projects/:projectId/ticketing/regenerate', requireRole('admin'), async (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  try {
    let config = project.ticketing;
    if (project.ticketing?.mode === 'sequence' && project.ticketing.sequence) {
      const seq = project.ticketing.sequence;
      config = {
        mode: 'sequence',
        sequence: {
          template: seq.template,
          startValue: seq.startString || String(seq.startValue).padStart(seq.width || 0, '0'),
        },
      };
    }
    regenerateSeatTicketNumbers(project, config);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  project.updatedAt = Date.now();
  await saveState();
  broadcastProject(project.id);
  res.json({ project: serializeProject(project) });
});

app.patch('/api/projects/:projectId/seats/:seatId', requireRole('admin'), async (req, res) => {
  const project = state.projects[req.params.projectId];
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  const seat = project.seats[req.params.seatId];
  if (!seat) {
    return res.status(404).json({ error: '座位不存在' });
  }
  const lock = await acquireLock(`seat:${project.id}:${req.params.seatId}`);
  const { status, price, ticketNumber } = req.body || {};
  try {
    if (price !== undefined) {
      if (price === null || price === '') {
        seat.price = null;
      } else if (typeof price === 'number' && Number.isFinite(price) && price >= 0) {
        seat.price = price;
      } else {
        return res.status(400).json({ error: '票价必须为非负数字' });
      }
    }
    if (ticketNumber !== undefined) {
      const normalizedTicket = ticketNumber ? String(ticketNumber).trim() : null;
      if (normalizedTicket && isTicketDuplicate(project, normalizedTicket, req.params.seatId)) {
        return res.status(409).json({ error: '票号重复，请使用唯一票号' });
      }
      seat.ticketNumber = normalizedTicket;
      seat.ticketCode = normalizedTicket;
      if (project.ticketing?.mode === 'sequence') {
        const sequence = prepareSequenceState(project);
        const value = deriveSequenceValue(sequence, normalizedTicket);
        seat.ticketSequenceValue = value;
        if (sequence && value && value > sequence.nextValue) {
          sequence.nextValue = value;
        }
      } else {
        seat.ticketSequenceValue = null;
      }
    }
    if (status) {
      const allowedStatuses = ['available', 'locked', 'sold', 'disabled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: '无效的座位状态' });
      }
      if (status === 'available') {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        seat.issuedAt = null;
        resetSeatCheckin(seat);
      } else if (status === 'locked') {
        seat.status = 'locked';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        resetSeatCheckin(seat);
      } else if (status === 'sold') {
        seat.status = 'sold';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        seat.issuedAt = Date.now();
      } else if (status === 'disabled') {
        seat.status = 'disabled';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        seat.issuedAt = null;
        seat.price = null;
        seat.ticketNumber = null;
        seat.ticketCode = null;
        seat.ticketSequenceValue = null;
        resetSeatCheckin(seat);
      }
    }
    assignSeatLabels(project);
    try {
      ensureSeatTicketNumbers(project);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    project.updatedAt = Date.now();
    await saveState();
    broadcastProject(project.id);
    res.json({ ok: true, seat });
  } finally {
    lock();
  }
});

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: '请求体过大，请压缩图片或拆分内容后再试。' });
  }
  console.error('Unhandled request error:', err);
  return res.status(500).json({ error: '服务器繁忙，请稍后再试。' });
});

io.use((socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || '');
    const sessionId = cookies[SESSION_COOKIE_NAME];
    if (!sessionId) {
      return next(new Error('未登录'));
    }
    const session = sessions.get(sessionId);
    if (!session) {
      return next(new Error('会话已失效'));
    }
    if (Date.now() - session.createdAt > SESSION_TTL_MS) {
      sessions.delete(sessionId);
      return next(new Error('会话已过期'));
    }
    socket.data.session = { ...session, sessionId };
    return next();
  } catch (error) {
    return next(error);
  }
});

io.on('connection', (socket) => {
  socket.data.currentProjectId = null;

  if (socket.data.session?.role === 'admin') {
    socket.emit('admin:accounts:update', { accounts: listAccountsForClient() });
  }

  socket.on('project:join', ({ projectId }, ack = () => {}) => {
    const project = state.projects[projectId];
    if (!project) {
      return ack({ ok: false, message: '项目不存在' });
    }
    if (socket.data.currentProjectId) {
      socket.leave(`project:${socket.data.currentProjectId}`);
    }
    socket.join(`project:${projectId}`);
    socket.data.currentProjectId = projectId;
    return ack({ ok: true, project: serializeProject(project) });
  });

  socket.on('lock-seat', async ({ projectId, seatId: requestedId }, ack = () => {}) => {
    const project = state.projects[projectId];
    if (!project) {
      return ack({ ok: false, message: '项目不存在' });
    }
    const seat = project.seats[requestedId];
    if (!seat) {
      return ack({ ok: false, message: '座位不存在' });
    }
    if (seat.status === 'sold') {
      return ack({ ok: false, message: '座位已签发' });
    }
    if (seat.status === 'disabled') {
      return ack({ ok: false, message: '座位未启用' });
    }
    if (!seat.ticketNumber) {
      try {
        assignTicketNumberToSeat(project, seat, { force: true });
      } catch (error) {
        return ack({ ok: false, message: error.message });
      }
    }
    if (seat.status === 'locked' && seat.lockedBy && seat.lockedBy !== socket.id) {
      return ack({ ok: false, message: '座位已被其他终端锁定' });
    }
    seat.status = 'locked';
    seat.lockedBy = socket.id;
    seat.lockExpiresAt = Date.now() + LOCK_TIMEOUT_MS;
    project.updatedAt = Date.now();
    await saveState();
    broadcastProject(project.id);
    return ack({ ok: true });
  });

  socket.on('unlock-seat', async ({ projectId, seatId: requestedId }, ack = () => {}) => {
    const project = state.projects[projectId];
    if (!project) {
      return ack({ ok: false, message: '项目不存在' });
    }
    const seat = project.seats[requestedId];
    if (!seat) {
      return ack({ ok: false, message: '座位不存在' });
    }
    if (seat.lockedBy !== socket.id) {
      return ack({ ok: false, message: '没有权限释放该座位' });
    }
    if (seat.status === 'sold') {
      return ack({ ok: false, message: '座位已经签发' });
    }
    releaseSeatLock(seat);
    project.updatedAt = Date.now();
    await saveState();
    broadcastProject(project.id);
    return ack({ ok: true });
  });

  socket.on('seat:issue', async ({ projectId, seatId: requestedId, ticketCode }, ack = () => {}) => {
    const project = state.projects[projectId];
    if (!project) {
      return ack({ ok: false, message: '项目不存在' });
    }
    const seat = project.seats[requestedId];
    if (!seat) {
      return ack({ ok: false, message: '座位不存在' });
    }
    if (!ticketCode || ticketCode !== seat.ticketCode) {
      return ack({ ok: false, message: '票码不匹配' });
    }
    if (seat.lockedBy !== socket.id) {
      return ack({ ok: false, message: '当前终端未锁定该座位' });
    }
    seat.status = 'sold';
    seat.lockedBy = null;
    seat.lockExpiresAt = null;
    seat.issuedAt = Date.now();
    if (!seat.seatLabel) {
      assignSeatLabels(project, new Set([seat.row]));
    }
    project.updatedAt = Date.now();
    await saveState();
    broadcastProject(project.id);
    return ack({ ok: true });
  });

  socket.on('request-ticket-code', async ({ projectId, seatId: requestedId }, ack = () => {}) => {
    const project = state.projects[projectId];
    if (!project) {
      return ack({ ok: false, message: '项目不存在' });
    }
    const seat = project.seats[requestedId];
    if (!seat) {
      return ack({ ok: false, message: '座位不存在' });
    }
    if (!seat.ticketNumber) {
      try {
        assignTicketNumberToSeat(project, seat, { force: true });
      } catch (error) {
        return ack({ ok: false, message: error.message });
      }
      project.updatedAt = Date.now();
      await saveState();
    }
    const qrDataUrl = await QRCode.toDataURL(seat.ticketCode || seat.ticketNumber, {
      width: 256,
      margin: 1,
    }).catch(
      () => null
    );
    return ack({ ok: true, ticketCode: seat.ticketCode || seat.ticketNumber, qrDataUrl });
  });

  socket.on('disconnect', async () => {
    const { id } = socket;
    const touchedProjects = new Set();
    Object.values(state.projects).forEach((project) => {
      let changed = false;
      Object.values(project.seats).forEach((seat) => {
        if (seat.lockedBy === id && seat.status !== 'sold') {
          releaseSeatLock(seat);
          changed = true;
        }
      });
      if (changed) {
        project.updatedAt = Date.now();
        touchedProjects.add(project.id);
      }
    });
    if (touchedProjects.size > 0) {
      await saveState();
      touchedProjects.forEach((projectId) => broadcastProject(projectId));
    }
  });
});

(async () => {
  await ensureDataFile();
  await ensureMerchImageDir();
  await ensureLockDir();
  await ensureRedis();
  await loadState();
  await ensureDefaultAccounts();
  Object.values(state.projects).forEach((project) => {
    try {
      ensureProjectMetadata(project);
      ensureProjectTicketing(project);
      refreshPriceAssignments(project);
      Object.values(project.seats || {}).forEach((seat) => ensureSeatCheckinState(seat));
      assignSeatLabels(project);
      ensureSeatTicketNumbers(project);
    } catch (error) {
      console.error(`Failed to normalize project ${project.id}:`, error.message);
    }
  });
  ensureCheckinLogs();
  await saveState();
  server.listen(PORT, () => {
    if (isHttps) {
      console.log(`Server listening on https://localhost:${PORT} (cert: ${CERT_CERT_PATH})`);
    } else {
      console.log(`Server listening on http://localhost:${PORT} (no cert found, fallback HTTP)`);
    }
  });
})();
