/* global io */

const projectSelect = document.getElementById('project-select');
const btnRefreshProjects = document.getElementById('btn-refresh-projects');
const seatCanvas = document.getElementById('sales-seat-canvas');
const selectedList = document.getElementById('selected-list');
const selectedCountEl = document.getElementById('selected-count');
const selectedTotalEl = document.getElementById('selected-total');
const salesStatus = document.getElementById('sales-status');
const projectHint = document.getElementById('project-hint');
const scanOverlay = document.getElementById('scan-overlay');
const videoEl = document.getElementById('scan-video');
const scanCanvas = document.getElementById('scan-canvas');
const issueHttpsHelp = document.getElementById('issue-https-help');
const issueHttpsUrlEl = document.getElementById('issue-https-url');
const btnCopyIssueHttps = document.getElementById('btn-copy-issue-https');
const btnOpenIssueHttps = document.getElementById('btn-open-issue-https');
const manualCodeInput = document.getElementById('manual-ticket-code');
const issueUploadFile = document.getElementById('issue-upload-file');
const btnManualConfirm = document.getElementById('btn-manual-confirm');
const btnIssueUploadScan = document.getElementById('btn-issue-upload-scan');
const btnLogout = document.getElementById('btn-logout');
const btnHome = document.getElementById('btn-home');
const salesZoneSummaryList = document.getElementById('sales-zone-summary-list');
const autoSelectPrice = document.getElementById('auto-select-price');
const autoSelectCount = document.getElementById('auto-select-count');
const btnAutoSelect = document.getElementById('btn-auto-select');
const btnClearSelected = document.getElementById('btn-clear-selected');
const btnTicketCheckout = document.getElementById('btn-ticket-checkout');
const inputTicketCoupon = document.getElementById('input-ticket-coupon');
const btnScanTicketCoupon = document.getElementById('btn-scan-ticket-coupon');
const btnLookupTicketCoupon = document.getElementById('btn-lookup-ticket-coupon');
const btnRedeemTicketCoupon = document.getElementById('btn-redeem-ticket-coupon');
const btnClearTicketCoupon = document.getElementById('btn-clear-ticket-coupon');
const ticketCouponInfo = document.getElementById('ticket-coupon-info');
const dialogTicketCheckout = document.getElementById('dialog-ticket-checkout');
const ticketCheckoutForm = document.getElementById('ticket-checkout-form');
const ticketCheckoutCount = document.getElementById('ticket-checkout-count');
const ticketCheckoutOriginal = document.getElementById('ticket-checkout-original');
const ticketCheckoutDiscount = document.getElementById('ticket-checkout-discount');
const ticketCheckoutTotal = document.getElementById('ticket-checkout-total');
const ticketCheckoutCoupon = document.getElementById('ticket-checkout-coupon');
const ticketUseCoupon = document.getElementById('ticket-use-coupon');
const ticketPaymentSelect = document.getElementById('ticket-payment-method');
const btnConfirmTicketCheckout = document.getElementById('btn-confirm-ticket-checkout');
const btnCancelTicketCheckout = document.getElementById('btn-cancel-ticket-checkout');
const ticketCheckoutStatus = document.getElementById('ticket-checkout-status');
const stageLabelEl = document.getElementById('sales-stage-label');
const merchProductsContainer = document.getElementById('sales-merch-products');
const merchCartList = document.getElementById('merch-cart-list');
const merchCartTotal = document.getElementById('merch-cart-total');
const merchCheckoutModeSelect = document.getElementById('merch-checkout-mode');
const merchPaymentSelect = document.getElementById('merch-payment-method');
const merchStatusEl = document.getElementById('merch-status');
const btnSubmitMerchOrder = document.getElementById('btn-submit-merch-order');
const btnRefreshMerchSales = document.getElementById('btn-refresh-merch-sales');
const merchNoteInput = document.getElementById('input-merch-note');
const merchFulfillmentSelect = document.getElementById('merch-fulfillment-type');
const merchPresalePanel = document.getElementById('merch-presale-panel');
const inputPresaleCode = document.getElementById('input-presale-code');
const btnScanPresaleCode = document.getElementById('btn-scan-presale-code');
const inputRedeemCode = document.getElementById('input-redeem-code');
const btnScanRedeemCode = document.getElementById('btn-scan-redeem-code');
const btnLookupVoucher = document.getElementById('btn-lookup-voucher');
const btnRedeemVoucher = document.getElementById('btn-redeem-voucher');
const redeemVoucherInfo = document.getElementById('redeem-voucher-info');
const MERCH_PAYMENT_OPTIONS = [
  '现金（人民币）',
  '微信',
  '支付宝',
  '银联',
  'VISA',
  'MasterCard',
  'JCB',
  '免单',
  '其他',
];
const checkinVideo = document.getElementById('checkin-video');
const checkinOverlay = document.getElementById('checkin-overlay');
const checkinCanvas = document.getElementById('checkin-canvas');
const checkinSeatGrid = document.getElementById('checkin-seat-grid');
const checkinResultEl = document.getElementById('checkin-result');
const checkinStatsEl = document.getElementById('checkin-stats');
const checkinHttpsHelp = document.getElementById('checkin-https-help');
const checkinHttpsUrlEl = document.getElementById('checkin-https-url');
const btnCopyCheckinHttps = document.getElementById('btn-copy-checkin-https');
const btnOpenCheckinHttps = document.getElementById('btn-open-checkin-https');
const btnStartCheckin = document.getElementById('btn-start-checkin');
const btnStopCheckin = document.getElementById('btn-stop-checkin');
const btnSubmitCheckin = document.getElementById('btn-submit-checkin');
const inputCheckinCode = document.getElementById('input-checkin-code');
const checkinUploadFile = document.getElementById('checkin-upload-file');
const btnCheckinUploadScan = document.getElementById('btn-checkin-upload-scan');
const btnRefreshCheckin = document.getElementById('btn-refresh-checkin');
const pendingCheckinList = document.getElementById('pending-checkin-list');
const btnRetryPending = document.getElementById('btn-retry-pending');
const btnClearPending = document.getElementById('btn-clear-pending');
const salesTabs = document.querySelectorAll('.sales-tab');
const modules = {
  sales: [document.getElementById('module-sales')],
  merch: [document.getElementById('module-merch')],
  checkin: [document.getElementById('module-checkin')],
};

const PRICE_COLORS = [
  '#2B8A3E',
  '#1F76D0',
  '#ED553B',
  '#845EF7',
  '#20BF55',
  '#F6AE2D',
  '#FF6B6B',
  '#3CAEA3',
];
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f2f4f8" rx="16"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2399a5c2" font-size="24">No Image</text></svg>';

const IS_IOS_DEVICE = (() => {
  const ua = navigator.userAgent || '';
  const isAppleMobile = /iPad|iPhone|iPod/i.test(ua);
  const isIPadOS = ua.includes('Mac') && 'ontouchend' in document;
  return isAppleMobile || isIPadOS;
})();

const enableInlineVideoForIOS = (video) => {
  if (!video || !IS_IOS_DEVICE) return;
  try {
    video.playsInline = true;
  } catch {
    // ignore
  }
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
};

enableInlineVideoForIOS(document.getElementById('scan-video'));
enableInlineVideoForIOS(document.getElementById('checkin-video'));
enableInlineVideoForIOS(document.getElementById('voucher-scan-video'));

const socket = io({ withCredentials: true, transports: ['websocket', 'polling'] });
const BARCODE_FORMATS = [
  'qr_code',
  'aztec',
  'data_matrix',
  'pdf417',
  'code_128',
  'code_39',
  'ean_13',
  'upc_a',
];

let projects = [];
let activeProject = null;
let seatElements = new Map();
let seatGridElement = null;
let seatGridSignature = null;
let priceColorMap = new Map();
let mySocketId = null;
let pendingIssue = null;
let videoStream = null;
let barcodeDetector = null;
let jsQrDetector = null;
let zxingDetector = null;
let scanContext = null;
let scanningLoopActive = false;
let lastScannedCode = '';
let lastScanTime = 0;
let lastScanMessage = '等待签发指令...';
let detectFailCount = 0;
let zoneSummaryData = [];
let merchCatalog = [];
let merchCart = [];
let checkoutModes = [];
let voucherScanTarget = null;
let voucherScanMode = null;
let activeTicketCoupon = null;
let merchOrderRetry = null;

const voucherScanDialog = document.getElementById('dialog-voucher-scan');
const voucherScanTitle = document.getElementById('voucher-scan-title');
const voucherScanHint = document.getElementById('voucher-scan-hint');
const voucherScanVideo = document.getElementById('voucher-scan-video');
const voucherScanOverlay = document.getElementById('voucher-scan-overlay');
const voucherScanCanvas = document.getElementById('voucher-scan-canvas');
const voucherScanUploadFile = document.getElementById('voucher-scan-upload-file');
const voucherScanManual = document.getElementById('voucher-scan-manual');
const btnVoucherScanStart = document.getElementById('btn-voucher-scan-start');
const btnVoucherScanStop = document.getElementById('btn-voucher-scan-stop');
const btnVoucherUploadScan = document.getElementById('btn-voucher-upload-scan');
const btnVoucherUse = document.getElementById('btn-voucher-use');
const btnVoucherClose = document.getElementById('btn-voucher-close');
const issueScanMethods = document.getElementById('issue-scan-methods');
const checkinScanMethods = document.getElementById('checkin-scan-methods');
const voucherScanMethods = document.getElementById('voucher-scan-methods');

let voucherScanStream = null;
let voucherScanDetector = null;
let voucherScanCtx = null;
let voucherScanLoopActive = false;
let lastVoucherScanCode = '';
let lastVoucherScanTime = 0;
let checkinStats = { totalSold: 0, checkedIn: 0 };
let checkinDetector = null;
let checkinContext = null;
let checkinStream = null;
let checkinLoopActive = false;
let lastCheckinCode = '';
let lastCheckinTime = 0;
let pendingCheckins = [];
let jsQrCheckinDetector = null;
let zxingCheckinDetector = null;
let checkinDetectFailCount = 0;
let seatLockQueue = null;
let isRevertingProjectSelect = false;
let issueScanPreference = 'camera';
let checkinScanPreference = 'camera';
let voucherScanPreference = 'camera';
let issueCameraLastError = '';
let checkinCameraLastError = '';
let voucherCameraLastError = '';

const createZxingCanvasDetector = () => {
  if (!window.ZXingBrowser || !window.ZXingBrowser.BrowserMultiFormatReader) return null;
  const reader = new window.ZXingBrowser.BrowserMultiFormatReader();
  let lastAttemptAt = 0;
  return {
    detect: async (canvas) => {
      const now = Date.now();
      // ZXing 解码较重，限制尝试频率，避免占满 CPU
      if (now - lastAttemptAt < 250) return [];
      lastAttemptAt = now;
      try {
        const result = await reader.decodeFromCanvas(canvas);
        const raw = (result?.getText?.() || result?.text || '').trim();
        return raw ? [{ rawValue: raw }] : [];
      } catch {
        return [];
      }
    },
    reset: () => {
      try {
        if (typeof reader.reset === 'function') reader.reset();
      } catch {
        // ignore
      }
    },
  };
};

if (btnClearSelected) {
  btnClearSelected.disabled = true;
}

if (merchCheckoutModeSelect) {
  merchCheckoutModeSelect.innerHTML = '<option value="">原价</option>';
}

const authFetch = async (input, init = {}) => {
  const { timeoutMs, ...rest } = init || {};
  const finalInit = { ...rest, credentials: 'same-origin' };
  if (init && init.headers) {
    finalInit.headers = init.headers;
  }
  const resolvedTimeoutMs = Number.isFinite(Number(timeoutMs))
    ? Math.max(0, Number(timeoutMs))
    : 12000;
  const controller =
    !finalInit.signal && typeof window !== 'undefined' && 'AbortController' in window
      ? new AbortController()
      : null;
  if (controller) {
    finalInit.signal = controller.signal;
  }
  const timeoutId =
    controller && resolvedTimeoutMs
      ? window.setTimeout(() => controller.abort(), resolvedTimeoutMs)
      : null;
  let response;
  try {
    response = await fetch(input, finalInit);
  } catch (error) {
    if (timeoutId) window.clearTimeout(timeoutId);
    const isFile = window.location.protocol === 'file:';
    const host = window.location.host || 'localhost:3000';
    const isAbort =
      error &&
      (error.name === 'AbortError' ||
        String(error.message || '').toLowerCase().includes('aborted'));
    if (isAbort) {
      showStatus(`请求超时（${resolvedTimeoutMs / 1000}s），请检查服务器是否卡死或网络不稳定。`, true, [
        { label: '刷新页面', variant: 'secondary', onClick: () => window.location.reload() },
      ]);
      throw error;
    }
    const hint = isFile
      ? `当前以 file:// 打开页面，无法访问后端接口。请先运行 npm start，然后通过 http(s)://${host}/sales.html 打开。`
      : `无法连接服务器（${host}）。请确认服务已启动（npm start）且网络/证书正常。`;
    showStatus(hint, true, [
      {
        label: '复制访问链接',
        variant: 'secondary',
        onClick: () => copyTextToClipboard(`http://${host}/sales.html`),
      },
    ]);
    throw error;
  }
  if (timeoutId) window.clearTimeout(timeoutId);
  if (response.status === 401 || response.status === 403) {
    window.location.href = '/login.html?role=sales';
    throw new Error('会话已过期，请重新登录。');
  }
  return response;
};

const seatKey = (row, col) => `r${row}-c${col}`;

const ensureActiveProjectMetadata = () => {
  if (!activeProject) return;
  if (!activeProject.priceColorAssignments || typeof activeProject.priceColorAssignments !== 'object') {
    activeProject.priceColorAssignments = {};
  }
};

const ensureLocalPriceColor = (price) => {
  if (!activeProject || price == null) return null;
  ensureActiveProjectMetadata();
  const key = String(price);
  if (!activeProject.priceColorAssignments[key]) {
    const used = new Set(Object.values(activeProject.priceColorAssignments));
    let color = PRICE_COLORS.find((candidate) => !used.has(candidate));
    if (!color) {
      color = PRICE_COLORS[used.size % PRICE_COLORS.length];
    }
    activeProject.priceColorAssignments[key] = color;
  }
  return activeProject.priceColorAssignments[key];
};

const extractSeatNumber = (seat, fallback) => {
  if (!seat || !seat.seatLabel) return fallback;
  const match = seat.seatLabel.match(/(\d+)(?:号|座)?$/u);
  return match ? match[1] : fallback;
};

const formatSeatLabel = (seat) => {
  if (!seat) return '';
  return seat.seatLabel || `${seat.row + 1}排${seat.col + 1}号`;
};

const stopIssueScanner = () => {
  scanningLoopActive = false;
  pendingIssue = null;
  lastScannedCode = '';
  if (videoStream) {
    videoStream.getTracks().forEach((t) => t.stop());
    videoStream = null;
  }
  if (barcodeDetector && typeof barcodeDetector.reset === 'function') {
    try {
      barcodeDetector.reset();
    } catch {
      // ignore
    }
  }
  barcodeDetector = null;
  scanContext = null;
  showScanOverlayMessage('等待签发指令...', { visible: true });
  renderScanMethodsPanels();
};

const switchModule = (name) => {
  Object.entries(modules).forEach(([key, list]) => {
    const active = key === name;
    (list || []).forEach((el) => {
      if (!el) return;
      el.toggleAttribute('hidden', !active);
    });
  });
  salesTabs.forEach((tab) => {
    const active = tab.dataset.module === name;
    tab.classList.toggle('sales-tab--active', active);
    tab.classList.toggle('admin-tab--active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
    tab.setAttribute('tabindex', active ? '0' : '-1');
  });
  if (name === 'checkin') {
    refreshActiveProject();
  } else {
    stopCheckinScanner();
  }
  if (name !== 'sales') {
    stopIssueScanner();
  }
  if (name === 'merch') {
    fetchMerchData();
  }
};

const playBeep = (success = true) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = success ? 880 : 220;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // ignore audio errors
  }
};

const setCheckinOverlay = (message, highlight = false) => {
  if (!checkinOverlay) return;
  checkinOverlay.textContent = message || '';
  checkinOverlay.classList.toggle('scan-overlay--visible', highlight);
};

const emitAsync = (event, payload) =>
  new Promise((resolve) => {
    socket.emit(event, payload, (response = {}) => resolve(response));
  });

let salesStatusActions = new Map();
let merchStatusActions = new Map();
let checkinResultActions = new Map();
let actionSeq = 0;
let activeTicketOrder = null;

const renderActionButtons = (container, actions = [], store) => {
  if (!container) return;
  if (!Array.isArray(actions) || !actions.length) return;
  const wrap = document.createElement('span');
  wrap.className = 'status-actions';
  actions.forEach((action) => {
    if (!action || typeof action.onClick !== 'function') return;
    const id = `a${(actionSeq += 1)}`;
    store.set(id, action.onClick);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `button button--sm ${action.variant ? `button--${action.variant}` : 'button--secondary'}`;
    btn.dataset.actionId = id;
    btn.textContent = action.label || '操作';
    wrap.appendChild(btn);
  });
  if (!wrap.childNodes.length) return;
  container.appendChild(wrap);
};

const showStatus = (message, isError = false, actions = []) => {
  if (!salesStatus) return;
  salesStatusActions = new Map();
  salesStatus.textContent = '';
  salesStatus.classList.toggle('status--error', isError);
  salesStatus.classList.toggle('status--ok', !isError);
  if (message) {
    const span = document.createElement('span');
    span.textContent = message;
    salesStatus.appendChild(span);
  }
  renderActionButtons(salesStatus, actions, salesStatusActions);
};

if (salesStatus) {
  salesStatus.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action-id]');
    if (!btn) return;
    const handler = salesStatusActions.get(btn.dataset.actionId);
    if (handler) handler();
  });
}

const getSuggestedHttpsUrl = () => {
  try {
    const url = new URL(window.location.href);
    url.protocol = 'https:';
    return url.toString();
  } catch {
    return `https://${location.host}${location.pathname}${location.search}${location.hash}`;
  }
};

const suggestedHttpsUrl = getSuggestedHttpsUrl();

const shouldShowHttpsHelp = () => !window.isSecureContext;

const renderHttpsHelpPanels = () => {
  const show = shouldShowHttpsHelp();
  if (issueHttpsHelp) issueHttpsHelp.hidden = !show;
  if (checkinHttpsHelp) checkinHttpsHelp.hidden = !show;
  if (issueHttpsUrlEl) issueHttpsUrlEl.textContent = suggestedHttpsUrl;
  if (checkinHttpsUrlEl) checkinHttpsUrlEl.textContent = suggestedHttpsUrl;
  renderScanMethodsPanels();
};

const getCameraCapability = (lastError = '') => {
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
    return { ok: false, reason: '设备不支持摄像头调用' };
  }
  if (!window.isSecureContext) {
    return { ok: false, reason: '需要 HTTPS（或 localhost/127.0.0.1）才能调用摄像头', needsHttps: true };
  }
  if (lastError) {
    return { ok: false, reason: lastError };
  }
  return { ok: true, reason: '可用' };
};

const buildScanMethodsHtml = ({ title, cameraCap, running, preference }) => {
  const cameraBadgeClass = cameraCap.ok ? 'scan-badge--ok' : cameraCap.needsHttps ? 'scan-badge--warn' : 'scan-badge--error';
  const cameraBadgeText = cameraCap.ok ? `摄像头：${running ? '运行中' : '可用'}` : `摄像头：不可用`;
  const uploadBadgeClass = 'scan-badge--ok';
  const manualBadgeClass = 'scan-badge--ok';
  const hint = cameraCap.ok
    ? '可使用摄像头扫码，也可随时切换到上传图片或手动输入。'
    : cameraCap.reason || '摄像头暂不可用，可改用上传图片或手动输入。';
  const active = preference === 'upload' ? '当前：上传图片' : preference === 'manual' ? '当前：手动输入' : '当前：摄像头扫码';
  return `
    <div class="scan-methods__row">
      <div>
        <div class="scan-methods__title">${title}</div>
        <div class="scan-methods__hint">${active} · ${hint}</div>
      </div>
      <div class="scan-badges" aria-label="可用方式">
        <span class="scan-badge ${cameraBadgeClass}">${cameraBadgeText}</span>
        <span class="scan-badge ${uploadBadgeClass}">上传图片：可用</span>
        <span class="scan-badge ${manualBadgeClass}">手动输入：可用</span>
      </div>
    </div>
    <div class="scan-methods__row">
      <div class="scan-methods__actions">
        <button type="button" class="button button--sm button--secondary" data-scan-action="camera" ${cameraCap.ok ? '' : 'disabled'}>
          使用摄像头
        </button>
        <button type="button" class="button button--sm button--secondary" data-scan-action="upload">上传图片</button>
        <button type="button" class="button button--sm button--secondary" data-scan-action="manual">手动输入</button>
        ${
          cameraCap.needsHttps
            ? `<button type="button" class="button button--sm" data-scan-action="copy-https">复制 HTTPS 链接</button>
               <button type="button" class="button button--sm button--primary" data-scan-action="open-https">打开 HTTPS</button>`
            : ''
        }
      </div>
    </div>
  `;
};

const renderScanMethodsPanels = () => {
  const issueCap = getCameraCapability(issueCameraLastError);
  const checkinCap = getCameraCapability(checkinCameraLastError);
  const voucherCap = getCameraCapability(voucherCameraLastError);
  if (issueScanMethods) {
    issueScanMethods.innerHTML = buildScanMethodsHtml({
      title: '扫码方式（签发）',
      cameraCap: issueCap,
      running: Boolean(scanningLoopActive),
      preference: issueScanPreference,
    });
  }
  if (checkinScanMethods) {
    checkinScanMethods.innerHTML = buildScanMethodsHtml({
      title: '扫码方式（检票）',
      cameraCap: checkinCap,
      running: Boolean(checkinLoopActive),
      preference: checkinScanPreference,
    });
  }
  if (voucherScanMethods) {
    voucherScanMethods.innerHTML = buildScanMethodsHtml({
      title: '扫码方式（券码）',
      cameraCap: voucherCap,
      running: Boolean(voucherScanLoopActive),
      preference: voucherScanPreference,
    });
  }
};

const handleScanMethodAction = async (scope, action) => {
  if (!action) return;
  if (action === 'copy-https') {
    await copyTextToClipboard(suggestedHttpsUrl);
    return;
  }
  if (action === 'open-https') {
    openSuggestedHttps();
    return;
  }

  if (scope === 'issue') {
    if (action === 'camera') {
      issueScanPreference = 'camera';
      issueCameraLastError = '';
      await ensureScanner();
      renderHttpsHelpPanels();
      renderScanMethodsPanels();
      return;
    }
    if (action === 'upload') {
      issueScanPreference = 'upload';
      if (issueUploadFile) issueUploadFile.click();
      renderScanMethodsPanels();
      return;
    }
    if (action === 'manual') {
      issueScanPreference = 'manual';
      if (manualCodeInput) manualCodeInput.focus();
      renderScanMethodsPanels();
      return;
    }
  }

  if (scope === 'checkin') {
    if (action === 'camera') {
      checkinScanPreference = 'camera';
      checkinCameraLastError = '';
      await startCheckinScanner();
      renderHttpsHelpPanels();
      renderScanMethodsPanels();
      return;
    }
    if (action === 'upload') {
      checkinScanPreference = 'upload';
      if (checkinUploadFile) checkinUploadFile.click();
      renderScanMethodsPanels();
      return;
    }
    if (action === 'manual') {
      checkinScanPreference = 'manual';
      if (inputCheckinCode) inputCheckinCode.focus();
      renderScanMethodsPanels();
      return;
    }
  }

  if (scope === 'voucher') {
    if (action === 'camera') {
      voucherScanPreference = 'camera';
      voucherCameraLastError = '';
      await startVoucherScan();
      renderScanMethodsPanels();
      return;
    }
    if (action === 'upload') {
      voucherScanPreference = 'upload';
      if (voucherScanUploadFile) voucherScanUploadFile.click();
      renderScanMethodsPanels();
      return;
    }
    if (action === 'manual') {
      voucherScanPreference = 'manual';
      if (voucherScanManual) voucherScanManual.focus();
      renderScanMethodsPanels();
      return;
    }
  }
};

if (issueScanMethods) {
  issueScanMethods.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-scan-action]');
    if (!btn) return;
    handleScanMethodAction('issue', btn.dataset.scanAction);
  });
}
if (checkinScanMethods) {
  checkinScanMethods.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-scan-action]');
    if (!btn) return;
    handleScanMethodAction('checkin', btn.dataset.scanAction);
  });
}
if (voucherScanMethods) {
  voucherScanMethods.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-scan-action]');
    if (!btn) return;
    handleScanMethodAction('voucher', btn.dataset.scanAction);
  });
}

const copyTextToClipboard = async (text) => {
  if (!text) return;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showStatus('已复制链接到剪贴板。');
      return;
    }
  } catch {
    // ignore and fallback
  }
  window.prompt('复制以下链接：', text);
  showStatus('已显示链接，请手动复制。');
};

const openSuggestedHttps = () => {
  if (!suggestedHttpsUrl) return;
  window.location.href = suggestedHttpsUrl;
};

if (btnCopyIssueHttps) {
  btnCopyIssueHttps.addEventListener('click', () => copyTextToClipboard(suggestedHttpsUrl));
}
if (btnOpenIssueHttps) {
  btnOpenIssueHttps.addEventListener('click', openSuggestedHttps);
}
if (btnCopyCheckinHttps) {
  btnCopyCheckinHttps.addEventListener('click', () => copyTextToClipboard(suggestedHttpsUrl));
}
if (btnOpenCheckinHttps) {
  btnOpenCheckinHttps.addEventListener('click', openSuggestedHttps);
}
renderHttpsHelpPanels();

const setMerchStatus = (message, isError = false, actions = []) => {
  if (!merchStatusEl) return;
  merchStatusActions = new Map();
  merchStatusEl.textContent = '';
  merchStatusEl.classList.toggle('status--error', isError);
  merchStatusEl.classList.toggle('status--ok', !isError);
  if (message) {
    const span = document.createElement('span');
    span.textContent = message;
    merchStatusEl.appendChild(span);
  }
  renderActionButtons(merchStatusEl, actions, merchStatusActions);
};

if (merchStatusEl) {
  merchStatusEl.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action-id]');
    if (!btn) return;
    const handler = merchStatusActions.get(btn.dataset.actionId);
    if (handler) handler();
  });
}

const setRedeemInfo = (message, isError = false) => {
  if (!redeemVoucherInfo) return;
  redeemVoucherInfo.textContent = message || '';
  redeemVoucherInfo.style.color = isError ? '#e14949' : '#637591';
};

const setTicketCouponInfo = (message, isError = false) => {
  if (!ticketCouponInfo) return;
  ticketCouponInfo.textContent = message || '';
  ticketCouponInfo.style.color = isError ? '#e14949' : '#637591';
};

const normalizeTicketCouponInput = (raw) => {
  const input = String(raw || '').replace(/\s+/g, ' ').trim();
  if (!input) return '';
  const upper = input.toUpperCase();
  const tokens = upper.match(/[A-Z0-9][A-Z0-9_-]{2,}/g) || [];
  if (tokens.length) return tokens.sort((a, b) => b.length - a.length)[0];
  const parts = upper
    .split(/[:：]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length ? parts[parts.length - 1] : upper;
};

const renderTicketCoupon = (coupon, rule) => {
  activeTicketCoupon = coupon || null;
  if (!coupon) {
    setTicketCouponInfo('未使用优惠券。');
    if (btnRedeemTicketCoupon) btnRedeemTicketCoupon.disabled = true;
    updateSelectedList();
    return;
  }
  const lines = [];
  lines.push(`优惠券：${coupon.code}`);
  lines.push(`状态：${coupon.status || '-'}`);
  lines.push(`剩余张数：${coupon.remaining ?? '-'}`);
  if (rule?.name) lines.push(`规则：${rule.name}`);
  if (coupon.discountRate != null) lines.push(`折扣：${coupon.discountRate} 折`);
  if (coupon.allowedPrices && Array.isArray(coupon.allowedPrices) && coupon.allowedPrices.length) {
    lines.push(`限制票价：${coupon.allowedPrices.join(' / ')}`);
  }
  setTicketCouponInfo(lines.join('\n'));
  if (btnRedeemTicketCoupon) {
    btnRedeemTicketCoupon.disabled = !(coupon.status === 'issued' && Number(coupon.remaining) > 0);
  }
  updateSelectedList();
};

const lookupTicketCoupon = async () => {
  if (!activeProject) {
    setTicketCouponInfo('请先选择项目。', true);
    return;
  }
  const code = normalizeTicketCouponInput(inputTicketCoupon?.value || '');
  if (!code) {
    setTicketCouponInfo('请输入优惠券码。', true);
    return;
  }
  if (inputTicketCoupon && inputTicketCoupon.value.trim() !== code) inputTicketCoupon.value = code;
  setTicketCouponInfo('正在查询...');
  try {
    const resp = await authFetch(
      `/api/projects/${encodeURIComponent(activeProject.id)}/ticket-coupons/${encodeURIComponent(code)}?ts=${Date.now()}`
    );
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || '查询失败');
    renderTicketCoupon(data.coupon, data.rule);
  } catch (error) {
    renderTicketCoupon(null, null);
    setTicketCouponInfo(error.message || '查询失败', true);
  }
};

const clearTicketCoupon = () => {
  if (inputTicketCoupon) inputTicketCoupon.value = '';
  renderTicketCoupon(null, null);
};

const openDialog = (dialog) => {
  if (!dialog) return;
  try {
    if (!dialog.open && dialog.showModal) dialog.showModal();
  } catch {
    // ignore
  }
};

const closeDialog = (dialog) => {
  if (!dialog) return;
  try {
    if (dialog.open) dialog.close();
  } catch {
    // ignore
  }
};

const computeTicketCouponPlan = (seats, options = {}) => {
  const plan = {
    seatDiscountedPrices: new Map(),
    totalOriginal: 0,
    totalAfter: 0,
    discountTotal: 0,
    appliedCount: 0,
  };
  if (!Array.isArray(seats) || !seats.length) return plan;

  const enabled = options.enabled !== false;
  const coupon = enabled ? (options.coupon || activeTicketCoupon) : null;
  const remaining = coupon && coupon.status === 'issued' ? Number(coupon.remaining) || 0 : 0;
  const allowedPrices = coupon && Array.isArray(coupon.allowedPrices) ? coupon.allowedPrices : null;
  const discountRate = coupon ? Number(coupon.discountRate) : NaN;
  const multiplier = Number.isFinite(discountRate) ? Math.max(0, Math.min(1, discountRate / 10)) : 1;

  seats.forEach((seat) => {
    const basePrice = Number(seat.price) || 0;
    plan.totalOriginal += basePrice;
  });

  if (remaining > 0 && coupon) {
    const eligible = seats
      .map((seat) => ({ id: seatKey(seat.row, seat.col), seat }))
      .filter((entry) => entry.seat.price != null)
      .filter((entry) => {
        if (!allowedPrices) return true;
        const price = Number(entry.seat.price);
        return allowedPrices.some((p) => Number(p) === price);
      });
    eligible
      .slice()
      .sort((a, b) => {
        const ap = Number(a.seat.price) || 0;
        const bp = Number(b.seat.price) || 0;
        if (bp !== ap) return bp - ap;
        if (a.seat.row !== b.seat.row) return a.seat.row - b.seat.row;
        return a.seat.col - b.seat.col;
      })
      .slice(0, Math.min(remaining, eligible.length))
      .forEach((entry) => {
        const base = Number(entry.seat.price) || 0;
        const discounted = Math.round(base * multiplier * 100) / 100;
        plan.seatDiscountedPrices.set(entry.id, discounted);
        plan.appliedCount += 1;
      });
  }

  seats.forEach((seat) => {
    const id = seatKey(seat.row, seat.col);
    const basePrice = Number(seat.price) || 0;
    const discounted = plan.seatDiscountedPrices.has(id) ? plan.seatDiscountedPrices.get(id) : null;
    plan.totalAfter += discounted != null ? Number(discounted) : basePrice;
  });

  plan.totalOriginal = Math.round(plan.totalOriginal * 100) / 100;
  plan.totalAfter = Math.round(plan.totalAfter * 100) / 100;
  plan.discountTotal = Math.max(0, Math.round((plan.totalOriginal - plan.totalAfter) * 100) / 100);
  return plan;
};

const setTicketCheckoutStatus = (message, isError = false) => {
  if (!ticketCheckoutStatus) return;
  ticketCheckoutStatus.textContent = message || '';
  ticketCheckoutStatus.style.color = isError ? '#e14949' : '#1f76d0';
};

const renderTicketCheckoutSummary = () => {
  if (!activeProject) return;
  const seats = getSelfLockedSeats();
  const useCoupon = Boolean(ticketUseCoupon?.checked);
  const plan = computeTicketCouponPlan(seats, { enabled: useCoupon });
  if (ticketCheckoutCount) ticketCheckoutCount.textContent = String(seats.length);
  if (ticketCheckoutOriginal) ticketCheckoutOriginal.textContent = `¥${plan.totalOriginal.toFixed(2)}`;
  if (ticketCheckoutDiscount) ticketCheckoutDiscount.textContent = `-¥${plan.discountTotal.toFixed(2)}`;
  if (ticketCheckoutTotal) ticketCheckoutTotal.textContent = `¥${plan.totalAfter.toFixed(2)}`;
  const couponCode = normalizeTicketCouponInput(inputTicketCoupon?.value || activeTicketCoupon?.code || '');
  if (ticketCheckoutCoupon) {
    if (useCoupon && couponCode) {
      const applied = plan.appliedCount ? `（预计抵扣 ${plan.appliedCount} 张）` : '';
      ticketCheckoutCoupon.textContent = `优惠券：${couponCode}${applied}`;
    } else {
      ticketCheckoutCoupon.textContent = '优惠券：未使用';
    }
  }
};

const openTicketCheckout = async () => {
  if (!activeProject) {
    showStatus('请先选择项目。', true);
    return;
  }
  const seats = getSelfLockedSeats();
  if (!seats.length) {
    showStatus('请先锁定座位。', true);
    return;
  }
  populatePaymentOptions();
  const couponCode = normalizeTicketCouponInput(inputTicketCoupon?.value || activeTicketCoupon?.code || '');
  if (ticketUseCoupon) {
    ticketUseCoupon.checked = Boolean(couponCode);
  }
  if (couponCode && (!activeTicketCoupon || activeTicketCoupon.code !== couponCode)) {
    try {
      await lookupTicketCoupon();
    } catch {
      // ignore
    }
  }
  renderTicketCheckoutSummary();
  setTicketCheckoutStatus('');
  openDialog(dialogTicketCheckout);
};

const submitTicketCheckout = async () => {
  if (!activeProject) return;
  if (activeTicketOrder) {
    showStatus('当前已有待签发订单，请先完成扫码签发。', true);
    return;
  }
  const seats = getSelfLockedSeats();
  if (!seats.length) return;
  const seatIds = seats.map((seat) => seatKey(seat.row, seat.col));
  const couponCode = normalizeTicketCouponInput(inputTicketCoupon?.value || activeTicketCoupon?.code || '');
  const useCoupon = Boolean(ticketUseCoupon?.checked);
  if (useCoupon && !couponCode) {
    setTicketCheckoutStatus('已勾选使用优惠券，请先输入/查询优惠券码。', true);
    return;
  }
  const paymentMethod = ticketPaymentSelect?.value || MERCH_PAYMENT_OPTIONS[0];

  if (btnConfirmTicketCheckout) btnConfirmTicketCheckout.disabled = true;
  if (btnTicketCheckout) btnTicketCheckout.disabled = true;
  setTicketCheckoutStatus('正在结账签发...');

  try {
    const resp = await emitAsync('tickets:checkout', {
      projectId: activeProject.id,
      seatIds,
      couponCode: useCoupon ? couponCode : '',
      useCoupon,
      paymentMethod,
    });
    if (!resp.ok) throw new Error(resp.message || '结账失败');

    if (resp.coupon) {
      renderTicketCoupon(resp.coupon, null);
      if (resp.coupon.status === 'used' || resp.coupon.remaining <= 0) {
        if (inputTicketCoupon) inputTicketCoupon.value = '';
      }
    }

    const seatQueue = Array.isArray(resp.order?.seatQueue) ? resp.order.seatQueue : seatIds;
    activeTicketOrder = {
      orderId: resp.order?.id,
      orderNo: resp.order?.orderNo,
      seatQueue: seatQueue.slice(),
    };

    closeDialog(dialogTicketCheckout);
    showStatus(`已发起结账：${resp.order?.orderNo || ''}，请依次扫码签发。`.trim());
    updateSelectedList();
    updateProjectOptionStats();
    updateZoneSummary();

    const nextSeatId = activeTicketOrder.seatQueue.shift();
    if (nextSeatId) {
      beginIssuance(nextSeatId);
    } else {
      activeTicketOrder = null;
    }
  } catch (error) {
    setTicketCheckoutStatus(error.message || '结账失败', true);
    showStatus(error.message || '结账失败', true);
  } finally {
    if (btnConfirmTicketCheckout) btnConfirmTicketCheckout.disabled = false;
    updateSelectedList();
  }
};

const redeemTicketCoupon = async () => {
  if (!activeProject) {
    setTicketCouponInfo('请先选择项目。', true);
    return;
  }
  const code = normalizeTicketCouponInput(inputTicketCoupon?.value || activeTicketCoupon?.code || '');
  if (!code) {
    setTicketCouponInfo('请输入优惠券码。', true);
    return;
  }
  if (!window.confirm(`确认核销优惠券 ${code} 1 次？`)) return;
  if (btnRedeemTicketCoupon) btnRedeemTicketCoupon.disabled = true;
  setTicketCouponInfo('正在核销...');
  try {
    const resp = await authFetch(`/api/projects/${encodeURIComponent(activeProject.id)}/ticket-coupons/${encodeURIComponent(code)}/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 1 }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || '核销失败');
    renderTicketCoupon(data.coupon, null);
    showStatus(`已核销优惠券 ${code} 1 次。`);
  } catch (error) {
    setTicketCouponInfo(error.message || '核销失败', true);
    showStatus(error.message || '核销失败', true);
  } finally {
    if (btnRedeemTicketCoupon) {
      btnRedeemTicketCoupon.disabled = !(activeTicketCoupon && activeTicketCoupon.status === 'issued' && activeTicketCoupon.remaining > 0);
    }
  }
};

const setVoucherOverlay = (message) => {
  if (!voucherScanOverlay) return;
  voucherScanOverlay.textContent = message || '';
};

const closeVoucherDialog = () => {
  try {
    if (voucherScanDialog && voucherScanDialog.open) voucherScanDialog.close();
  } catch {
    // ignore
  }
};

const stopVoucherScan = () => {
  voucherScanLoopActive = false;
  if (voucherScanDetector && typeof voucherScanDetector.reset === 'function') {
    try {
      voucherScanDetector.reset();
    } catch {
      // ignore
    }
  }
  voucherScanDetector = null;
  voucherScanCtx = null;
  if (voucherScanStream) {
    voucherScanStream.getTracks().forEach((t) => t.stop());
    voucherScanStream = null;
  }
  setVoucherOverlay('已停止扫码');
  renderScanMethodsPanels();
};

const applyVoucherCode = (code) => {
  const normalized =
    voucherScanMode === 'ticket-coupon'
      ? normalizeTicketCouponInput(code || '')
      : String(code || '').trim();
  if (!normalized) return;
  if (voucherScanTarget) {
    voucherScanTarget.value = normalized;
    voucherScanTarget.dispatchEvent(new Event('input'));
    voucherScanTarget.dispatchEvent(new Event('change'));
  }
  setVoucherOverlay(`已识别：${normalized}`);
  stopVoucherScan();
  closeVoucherDialog();
  if (voucherScanMode === 'redeem') {
    setRedeemInfo('已填入预购券码，可点击“查询”。');
  } else if (voucherScanMode === 'presale') {
    setMerchStatus('已填入预购券码，可继续提交预售订单。');
  } else if (voucherScanMode === 'ticket-coupon') {
    setTicketCouponInfo('已填入优惠券码，可点击“查询”。');
  }
};

const runVoucherScanLoop = async () => {
  if (!voucherScanLoopActive) return;
  try {
    if (voucherScanDetector && voucherScanCtx && voucherScanVideo && voucherScanVideo.readyState >= 2) {
      voucherScanCtx.drawImage(voucherScanVideo, 0, 0, voucherScanCanvas.width, voucherScanCanvas.height);
      const codes = await voucherScanDetector.detect(voucherScanCanvas);
      if (codes.length) {
        const raw = (codes[0].rawValue || '').trim();
        const now = Date.now();
        if (raw && (raw !== lastVoucherScanCode || now - lastVoucherScanTime > 1500)) {
          lastVoucherScanCode = raw;
          lastVoucherScanTime = now;
          applyVoucherCode(raw);
          return;
        }
      }
    }
  } catch {
    // ignore
  }
  requestAnimationFrame(runVoucherScanLoop);
};

const startVoucherScan = async () => {
  if (!voucherScanVideo || !voucherScanCanvas) return;
  if (!navigator.mediaDevices) {
    setVoucherOverlay('设备不支持摄像头，请使用上传图片或手动输入。');
    voucherCameraLastError = '设备不支持摄像头调用';
    renderScanMethodsPanels();
    return;
  }
  renderHttpsHelpPanels();
  if (!window.isSecureContext) {
    setVoucherOverlay('摄像头扫码需要 HTTPS（或 localhost）。可使用上传图片或手动输入。');
    voucherCameraLastError = '需要 HTTPS（或 localhost/127.0.0.1）才能调用摄像头';
    renderScanMethodsPanels();
    return;
  }
  try {
    if (!voucherScanVideo.hasAttribute('playsinline')) voucherScanVideo.setAttribute('playsinline', 'true');
    voucherScanStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    voucherScanVideo.srcObject = voucherScanStream;
  } catch (error) {
    const reason =
      error && error.name === 'NotAllowedError'
        ? '摄像头权限被拒绝，请允许权限或改用上传图片/手动输入。'
        : '无法访问摄像头，请检查权限或改用上传图片/手动输入。';
    setVoucherOverlay(reason);
    voucherCameraLastError = reason;
    renderScanMethodsPanels();
    return;
  }
  voucherCameraLastError = '';
  renderScanMethodsPanels();
  if (!('BarcodeDetector' in window)) {
    const detector = createZxingCanvasDetector();
    if (!detector) {
      setVoucherOverlay('浏览器不支持实时扫码，请使用上传图片或手动输入。');
      return;
    }
    voucherScanDetector = detector;
    voucherScanCanvas.width = 640;
    voucherScanCanvas.height = 360;
    voucherScanCtx = voucherScanCanvas.getContext('2d');
    voucherScanLoopActive = true;
    setVoucherOverlay('已切换到软件识别模式（ZXing），请对准条码/二维码。');
    runVoucherScanLoop();
    return;
  }
  try {
    try {
      voucherScanDetector = new window.BarcodeDetector({ formats: BARCODE_FORMATS });
    } catch {
      voucherScanDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
    }
    voucherScanCanvas.width = 640;
    voucherScanCanvas.height = 360;
    voucherScanCtx = voucherScanCanvas.getContext('2d');
    voucherScanLoopActive = true;
    setVoucherOverlay('摄像头已就绪，请对准条码。');
    runVoucherScanLoop();
  } catch {
    const detector = createZxingCanvasDetector();
    if (!detector) {
      setVoucherOverlay('初始化扫码失败，请使用上传图片或手动输入。');
      return;
    }
    voucherScanDetector = detector;
    voucherScanCanvas.width = 640;
    voucherScanCanvas.height = 360;
    voucherScanCtx = voucherScanCanvas.getContext('2d');
    voucherScanLoopActive = true;
    setVoucherOverlay('已切换到软件识别模式（ZXing），请对准条码/二维码。');
    runVoucherScanLoop();
  }
};

const openVoucherDialog = ({ title, targetInput, mode }) => {
  voucherScanTarget = targetInput || null;
  voucherScanMode = mode || null;
  if (voucherScanTitle) voucherScanTitle.textContent = title || '扫码';
  if (voucherScanHint) {
    voucherScanHint.textContent =
      '可使用摄像头扫码（需 HTTPS），或上传条码图片/手动输入。';
  }
  if (voucherScanManual) voucherScanManual.value = '';
  if (voucherScanUploadFile) voucherScanUploadFile.value = '';
  stopVoucherScan();
  setVoucherOverlay('等待扫码...');
  voucherCameraLastError = '';
  voucherScanPreference = 'camera';
  renderScanMethodsPanels();
  try {
    if (voucherScanDialog) voucherScanDialog.showModal();
  } catch {
    // ignore
  }
  if (voucherScanManual) voucherScanManual.focus();
};

const formatCurrency = (value) => `¥${Number(value || 0).toFixed(2)}`;

const formatDurationSeconds = (ms) => {
  const seconds = Math.max(0, Math.ceil((Number(ms) || 0) / 1000));
  return seconds;
};

const describeLockOwner = (lockedBy) => {
  if (!lockedBy) return '其他终端';
  if (typeof lockedBy === 'string') return lockedBy;
  return lockedBy.username || lockedBy.socketId || '其他终端';
};

const ensureSeatLockQueue = () => {
  if (!seatLockQueue) seatLockQueue = new Map();
  return seatLockQueue;
};

const clearSeatLockQueue = () => {
  if (!seatLockQueue) return;
  for (const pending of seatLockQueue.values()) {
    if (pending?.timer) clearTimeout(pending.timer);
  }
  seatLockQueue.clear();
};

socket.on('connect', () => {
  showStatus('');
});

socket.on('disconnect', (reason) => {
  if (reason === 'io client disconnect' || reason === 'io server disconnect') return;
  showStatus('实时连接已断开，正在尝试重连...', true);
});

socket.on('connect_error', (error) => {
  const message = error?.message || '';
  if (message.includes('未登录') || message.includes('会话')) {
    window.location.href = '/login.html?role=sales';
    return;
  }
  showStatus(message || '实时连接失败，请稍后重试。', true);
});

const showScanOverlayMessage = (message, { visible = true } = {}) => {
  lastScanMessage = message;
  if (!scanOverlay) return;
  scanOverlay.textContent = message;
  if (visible) {
    scanOverlay.classList.add('scan-overlay--visible');
  } else {
    scanOverlay.classList.remove('scan-overlay--visible');
  }
};

showScanOverlayMessage(lastScanMessage, { visible: true });

const resetSeatCanvas = (message = '等待选择项目...') => {
  clearSeatLockQueue();
  seatCanvas.innerHTML = '';
  seatGridElement = null;
  seatGridSignature = null;
  delete seatCanvas.dataset.gridSignature;
  showScanOverlayMessage('等待签发指令...', { visible: true });
  const placeholder = document.createElement('p');
  placeholder.className = 'placeholder';
  placeholder.textContent = message;
  seatCanvas.appendChild(placeholder);
  seatElements.clear();
  priceColorMap = new Map();
  salesZoneSummaryList.innerHTML = '<li>暂无数据</li>';
  autoSelectPrice.innerHTML = '<option value="any">全部价位</option>';
  zoneSummaryData = [];
  if (stageLabelEl) {
    stageLabelEl.style.transform = 'translateX(-50%)';
  }
  btnAutoSelect.disabled = true;
  if (btnClearSelected) {
    btnClearSelected.disabled = true;
  }
  renderCheckinSeatGrid();
  updateCheckinStats();
  setCheckinResult('等待检票...', null);
};

const renderMerchProducts = () => {
  if (!merchProductsContainer) return;
  merchProductsContainer.innerHTML = '';
  if (!merchCatalog.length) {
    const placeholder = document.createElement('p');
    placeholder.className = 'placeholder';
    placeholder.textContent = '暂无文创商品。';
    merchProductsContainer.appendChild(placeholder);
    return;
  }
  merchCatalog.forEach((product) => {
    if (product.enabled === false) return;
    const card = document.createElement('div');
    card.className = 'merch-card';
    const img = document.createElement('img');
    img.className = 'merch-card__img';
    img.src = product.imageData || PLACEHOLDER_IMAGE;
    img.alt = product.name;
    card.appendChild(img);
    const title = document.createElement('strong');
    title.textContent = product.name;
    card.appendChild(title);
    const meta = document.createElement('div');
    meta.className = 'merch-card__meta';
    meta.innerHTML = `<span>${formatCurrency(product.price)}</span><span>库存 ${product.stock}</span>`;
    card.appendChild(meta);
    if (product.description) {
      const desc = document.createElement('p');
      desc.className = 'hint';
      desc.textContent = product.description;
      card.appendChild(desc);
    }
    const addBtn = document.createElement('button');
    addBtn.className = 'button button--primary';
    addBtn.type = 'button';
    addBtn.dataset.action = 'add-merch';
    addBtn.dataset.id = product.id;
    addBtn.textContent = '加入购物车';
    card.appendChild(addBtn);
    merchProductsContainer.appendChild(card);
  });
};

const getSelectedCheckoutMode = () => {
  if (!merchCheckoutModeSelect) return null;
  const selectedId = merchCheckoutModeSelect.value;
  if (!selectedId) return null;
  return checkoutModes.find((mode) => mode.id === selectedId && mode.enabled !== false) || null;
};

const applyCheckoutModeToTotal = (totalBefore) => {
  const mode = getSelectedCheckoutMode();
  if (!mode || totalBefore <= 0) {
    return { totalAfter: totalBefore, discount: 0, mode: null };
  }
  let totalAfter = totalBefore;
  let discount = 0;
  if (mode.type === 'discount' || mode.type === 'percentage') {
    const multiplier = Math.min(1, Math.max(0, Number(mode.value) || 1));
    totalAfter = Math.max(0, Math.round(totalBefore * multiplier * 100) / 100);
    discount = Math.max(0, Math.round((totalBefore - totalAfter) * 100) / 100);
  } else if (mode.type === 'fullcut') {
    const threshold = Math.max(0, Number(mode.threshold) || 0);
    const cutAmount = Math.max(0, Number(mode.cutAmount) || 0);
    const stackLimit = Number.isFinite(Number(mode.stackLimit))
      ? Math.max(1, Math.floor(Number(mode.stackLimit)))
      : null;
    if (threshold > 0 && cutAmount > 0) {
      const possibleStacks = Math.floor(totalBefore / threshold);
      const stacks = stackLimit ? Math.min(possibleStacks, stackLimit) : possibleStacks;
      discount = Math.max(0, Math.min(totalBefore, stacks * cutAmount));
      totalAfter = totalBefore - discount;
    }
  }
  return {
    totalAfter: Math.max(0, Math.round(totalAfter * 100) / 100),
    discount: Math.max(0, Math.round(discount * 100) / 100),
    mode,
  };
};

const setCheckinResult = (message, status = null, detail = null, actions = []) => {
  if (!checkinResultEl) return;
  checkinResultActions = new Map();
  checkinResultEl.textContent = '';
  if (message) {
    const line = document.createElement('div');
    line.textContent = message;
    checkinResultEl.appendChild(line);
  }
  checkinResultEl.classList.remove('checkin-result--notice', 'checkin-result--success', 'checkin-result--error');
  if (status === 'notice') {
    checkinResultEl.classList.add('checkin-result--notice');
  } else if (status === 'success') {
    checkinResultEl.classList.add('checkin-result--success');
  } else if (status === 'error') {
    checkinResultEl.classList.add('checkin-result--error');
  }
  if (detail) {
    const extra = document.createElement('div');
    extra.className = 'hint';
    extra.textContent = detail;
    checkinResultEl.appendChild(extra);
  }
  renderActionButtons(checkinResultEl, actions, checkinResultActions);
};

if (checkinResultEl) {
  checkinResultEl.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action-id]');
    if (!btn) return;
    const handler = checkinResultActions.get(btn.dataset.actionId);
    if (handler) handler();
  });
}

const updateCheckinStats = () => {
  if (!checkinStatsEl) return;
  const seats = Object.values(activeProject?.seats || {});
  const totalSold = seats.filter((s) => s.status === 'sold').length;
  const checked = seats.filter((s) => s.status === 'sold' && s.checkedInAt).length;
  checkinStats = { totalSold, checkedIn: checked };
  checkinStatsEl.textContent = `已检 ${checked} / 总票数 ${totalSold}`;
};

const renderCheckinSeatGrid = () => {
  if (!checkinSeatGrid) return;
  if (!activeProject) {
    checkinSeatGrid.innerHTML = '<p class="hint">请选择项目后查看检票进度。</p>';
    return;
  }
  const seats = Object.values(activeProject.seats || {});
  if (!seats.length) {
    checkinSeatGrid.innerHTML = '<p class="hint">当前项目无座位。</p>';
    return;
  }
  const sorted = seats.slice().sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  const cols = activeProject ? activeProject.cols : 0;
  checkinSeatGrid.style.gridTemplateColumns = `repeat(${Math.max(cols, 1)}, minmax(10px, 1fr))`;
  checkinSeatGrid.innerHTML = '';
  sorted.forEach((seat) => {
    const dot = document.createElement('div');
    dot.className = 'seat-dot';
    if (seat.status === 'disabled') {
      dot.classList.add('seat-dot--disabled');
    } else if (seat.status === 'sold' && seat.checkedInAt) {
      dot.classList.add('seat-dot--checked');
    } else if (seat.status === 'sold') {
      dot.classList.add('seat-dot--sold');
    } else {
      dot.classList.add('seat-dot--idle');
    }
    checkinSeatGrid.appendChild(dot);
  });
};

const renderMerchCart = () => {
  if (!merchCartList) return;
  merchCartList.innerHTML = '';
  if (!merchCart.length) {
    merchCartList.innerHTML = '<li class="hint">购物车为空。</li>';
    if (merchCartTotal) merchCartTotal.innerHTML = '¥0.00';
    if (merchPaymentSelect) merchPaymentSelect.disabled = true;
    return;
  }
  if (merchPaymentSelect) merchPaymentSelect.disabled = false;
  let total = 0;
  merchCart.forEach((entry) => {
    const product = merchCatalog.find((item) => item.id === entry.productId);
    if (!product) return;
    const subtotal = Math.round(product.price * entry.quantity * 100) / 100;
    total += subtotal;
    const li = document.createElement('li');
    li.dataset.id = entry.productId;
    li.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <p class="hint">${formatCurrency(product.price)} × ${entry.quantity} = ${formatCurrency(subtotal)}</p>
      </div>
      <div class="merch-cart__actions" aria-label="调整数量">
        <button class="button merch-cart__btn" data-action="dec" type="button" aria-label="减少数量">−</button>
        <span class="merch-cart__qty" aria-live="polite">${entry.quantity}</span>
        <button class="button merch-cart__btn" data-action="inc" type="button" aria-label="增加数量">+</button>
        <button class="button button--danger merch-cart__btn merch-cart__btn--remove" data-action="remove" type="button">
          删除
        </button>
      </div>
    `;
    merchCartList.appendChild(li);
  });
  const { totalAfter, discount, mode } = applyCheckoutModeToTotal(total);
  if (merchCartTotal) {
    merchCartTotal.innerHTML = `${formatCurrency(totalAfter)}${
      discount
        ? `<span class="merch-cart__discount">${mode?.name || '优惠'} -${formatCurrency(discount)}</span>`
        : ''
    }`;
  }
};

const syncCartWithStock = () => {
  merchCart = merchCart
    .map((entry) => {
      const product = merchCatalog.find((item) => item.id === entry.productId);
      if (!product || product.enabled === false || product.stock <= 0) {
        return null;
      }
      return {
        productId: entry.productId,
        quantity: Math.min(entry.quantity, product.stock),
      };
    })
    .filter(Boolean);
};

const addProductToCart = (productId) => {
  const product = merchCatalog.find((item) => item.id === productId && item.enabled !== false);
  if (!product) {
    setMerchStatus('该商品不可用。', true);
    return;
  }
  const existing = merchCart.find((item) => item.productId === productId);
  const inCartQty = existing ? existing.quantity : 0;
  if (product.stock <= inCartQty) {
    setMerchStatus('库存不足，无法继续添加。', true);
    return;
  }
  if (existing) {
    existing.quantity += 1;
  } else {
    merchCart.push({ productId, quantity: 1 });
  }
  setMerchStatus('已加入购物车。');
  renderMerchCart();
};

const updateCartQuantity = (productId, delta) => {
  const entry = merchCart.find((item) => item.productId === productId);
  if (!entry) return;
  const product = merchCatalog.find((item) => item.id === productId);
  if (!product) {
    merchCart = merchCart.filter((item) => item.productId !== productId);
    renderMerchCart();
    return;
  }
  entry.quantity += delta;
  if (entry.quantity <= 0) {
    merchCart = merchCart.filter((item) => item.productId !== productId);
  } else if (entry.quantity > product.stock) {
    entry.quantity = product.stock;
  }
  renderMerchCart();
};

const removeCartItem = (productId) => {
  merchCart = merchCart.filter((item) => item.productId !== productId);
  renderMerchCart();
};

const populateCheckoutModes = () => {
  if (!merchCheckoutModeSelect) return;
  const previousValue = merchCheckoutModeSelect.value || '';
  let hasMatch = false;
  const options = ['<option value="">原价</option>'];
  checkoutModes
    .filter((mode) => mode.enabled !== false)
    .forEach((mode) => {
      if (mode.id === previousValue) {
        hasMatch = true;
      }
      options.push(`<option value="${mode.id}">${mode.name}</option>`);
    });
  merchCheckoutModeSelect.innerHTML = options.join('');
  merchCheckoutModeSelect.value = hasMatch ? previousValue : '';
  renderMerchCart();
};

const populatePaymentOptions = () => {
  const prevMerch = merchPaymentSelect?.value || '';
  const prevTicket = ticketPaymentSelect?.value || '';
  const options = MERCH_PAYMENT_OPTIONS.map(
    (opt) => `<option value="${opt}">${opt}</option>`
  ).join('');
  if (merchPaymentSelect) {
    merchPaymentSelect.innerHTML = options;
    merchPaymentSelect.value = MERCH_PAYMENT_OPTIONS.includes(prevMerch) ? prevMerch : MERCH_PAYMENT_OPTIONS[0];
  }
  if (ticketPaymentSelect) {
    ticketPaymentSelect.innerHTML = options;
    ticketPaymentSelect.value = MERCH_PAYMENT_OPTIONS.includes(prevTicket) ? prevTicket : MERCH_PAYMENT_OPTIONS[0];
  }
};

const renderMerchModes = () => {
  populateCheckoutModes();
  populatePaymentOptions();
};

const cancelMerchOrderRetry = () => {
  if (!merchOrderRetry) return;
  if (merchOrderRetry.timer) clearTimeout(merchOrderRetry.timer);
  merchOrderRetry = null;
  if (btnSubmitMerchOrder) btnSubmitMerchOrder.disabled = false;
  setMerchStatus('已取消排队等待。');
};

const scheduleMerchOrderRetry = (payload, reason = '') => {
  const attempt = (merchOrderRetry?.attempt || 0) + 1;
  cancelMerchOrderRetry();
  const base = Math.min(8000, 800 * 2 ** Math.min(4, attempt - 1));
  const jitter = Math.floor(Math.random() * 400);
  const delay = base + jitter;
  const seconds = Math.max(1, Math.round(delay / 1000));
  if (btnSubmitMerchOrder) btnSubmitMerchOrder.disabled = true;
  const prefix = reason ? `${reason}；` : '';
  setMerchStatus(`${prefix}${seconds}s 后自动重试提交（已排队）。`, true, [
    { label: '立即重试', variant: 'primary', onClick: () => submitMerchOrder(payload, true) },
    { label: '取消排队', variant: 'secondary', onClick: cancelMerchOrderRetry },
  ]);
  const timer = setTimeout(() => submitMerchOrder(payload, true), delay);
  merchOrderRetry = { timer, payload, attempt };
};

const submitMerchOrder = async (payload, isRetry = false) => {
  if (!payload) return;
  if (!isRetry) cancelMerchOrderRetry();
  setMerchStatus(payload.orderType === 'presale' ? '正在签发预购券...' : '正在提交订单...');
  try {
    const response = await authFetch('/api/merch/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      if (response.status === 409 && error?.code === 'VOUCHER_EXISTS') {
        cancelMerchOrderRetry();
        setMerchStatus('该预购券已使用/已签发，请更换预购券。', true);
        return;
      }
      if (response.status === 400 && error?.code === 'VOUCHER_REQUIRED') {
        cancelMerchOrderRetry();
        setMerchStatus('预售订单需要预购券条码。', true);
        return;
      }
      if (response.status === 409 && error?.code === 'OUT_OF_STOCK') {
        cancelMerchOrderRetry();
        const shortages = Array.isArray(error.shortages) ? error.shortages : [];
        const detail = shortages.length
          ? shortages
              .slice(0, 5)
              .map((s) => `${s.name}（需 ${s.requested}，余 ${s.stock}）`)
              .join('；')
          : '';
        setMerchStatus(`库存不足：${detail || '请刷新商品后重试'}。正在自动刷新库存...`, true);
        await fetchMerchData();
        syncCartWithStock();
        renderMerchCart();
        return;
      }
      if (response.status === 429 && (error?.code === 'BUSY' || error?.code === 'TOO_BUSY')) {
        scheduleMerchOrderRetry(payload);
        return;
      }
      cancelMerchOrderRetry();
      throw new Error(error?.error || '提交失败');
    }
    cancelMerchOrderRetry();
    const data = await response.json().catch(() => ({}));
    if (payload.orderType === 'presale') {
      setMerchStatus(`预购券已签发：${data.voucher?.code || payload.voucherCode || ''}`);
    } else {
      setMerchStatus('已记录文创订单。');
    }
    merchCart = [];
    renderMerchCart();
    if (merchNoteInput) merchNoteInput.value = '';
    if (inputPresaleCode) inputPresaleCode.value = '';
    await fetchMerchData();
  } catch (error) {
    scheduleMerchOrderRetry(payload, error.message || '提交失败');
  }
};

const submitCheckin = async (code) => {
  if (!activeProject) {
    setCheckinResult('请先选择项目。', 'error');
    return;
  }
  const ticketCode = (code || inputCheckinCode?.value || '').trim();
  if (!ticketCode) {
    setCheckinResult('请输入票号。', 'error');
    return;
  }
  setCheckinResult('检票中...', null);
  try {
    const response = await authFetch(`/api/projects/${activeProject.id}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCode, scannerId: mySocketId || 'scanner' }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const seatInfo = data.seat
        ? `座位：${data.seat.seatLabel || ''}；状态：${data.seat.status || ''}`
        : '';
      if (response.status === 409 && data.error === '已检票') {
        const when = data.checkedInAt ? new Date(data.checkedInAt).toLocaleString() : '未知时间';
        const who = data.checkedInBy ? `，检票员：${data.checkedInBy}` : '';
        setCheckinResult(`该票已入场（${when}${who}）`, 'notice', seatInfo, [
          { label: '刷新统计', variant: 'secondary', onClick: () => refreshActiveProject() },
        ]);
        playBeep(false);
        return;
      }
      const errorMessage = data.error || '检票失败';
      const actions = [];
      if (response.status === 429 || data.code === 'BUSY') {
        actions.push({
          label: '立即重试',
          variant: 'primary',
          onClick: () => submitCheckin(ticketCode),
        });
      }
      actions.push({
        label: '加入待重试',
        variant: 'secondary',
        onClick: async () => {
          await addPendingCheckin(ticketCode, errorMessage);
          setCheckinResult('已加入待重试列表。', 'notice');
        },
      });
      setCheckinResult(errorMessage, 'error', seatInfo, actions);
      playBeep(false);
      // 仅对“可重试”的失败加入待重试列表
      if (response.status !== 409) {
        await addPendingCheckin(ticketCode, data.error || '检票失败');
      }
      return;
    }
    if (data.seat) {
      const seatIdKey = seatKey(data.seat.row, data.seat.col);
      if (activeProject.seats[seatIdKey]) {
        activeProject.seats[seatIdKey] = { ...activeProject.seats[seatIdKey], ...data.seat, status: 'sold' };
      }
    }
    updateCheckinStats();
    renderCheckinSeatGrid();
    refreshActiveProject();
    const seatInfo = data.seat
      ? `座位：${data.seat.seatLabel || ''}   票价：${data.seat.price ?? '-'}   售票时间：${
          data.seat.issuedAt ? new Date(data.seat.issuedAt).toLocaleString() : '未知'
        }`
      : '';
    setCheckinResult('检票成功', 'success', seatInfo);
    playBeep(true);
    if (inputCheckinCode) inputCheckinCode.value = '';
  } catch (error) {
    setCheckinResult(error.message || '检票失败', 'error', null, [
      { label: '立即重试', variant: 'primary', onClick: () => submitCheckin(ticketCode) },
      {
        label: '加入待重试',
        variant: 'secondary',
        onClick: async () => {
          await addPendingCheckin(ticketCode, error.message || '检票失败');
          setCheckinResult('已加入待重试列表。', 'notice');
        },
      },
    ]);
    await addPendingCheckin(ticketCode, error.message || '检票失败');
    playBeep(false);
  }
};

const fetchMerchData = async () => {
  if (!merchProductsContainer) return;
  setMerchStatus('正在载入商品...');
  try {
    const [productsRes, modesRes] = await Promise.all([
      authFetch('/api/merch/products'),
      authFetch('/api/merch/modes'),
    ]);
    const productsData = await productsRes.json();
    const modesData = await modesRes.json();
    merchCatalog = (productsData.products || []).filter((item) => item.enabled !== false);
    checkoutModes = modesData.modes || [];
    syncCartWithStock();
    renderMerchProducts();
    renderMerchCart();
    populateCheckoutModes();
    setMerchStatus('文创商品已更新。');
  } catch (error) {
    setMerchStatus(error.message || '获取文创商品失败。', true);
  }
};
const computePriceColorMap = () => {
  if (!activeProject) {
    priceColorMap = new Map();
    return;
  }
  ensureActiveProjectMetadata();
  priceColorMap = new Map();
  const activePrices = new Set();
  Object.values(activeProject.seats || {}).forEach((seat) => {
    if (seat && seat.status !== 'disabled' && seat.price != null) {
      activePrices.add(String(seat.price));
    }
  });
  [...activePrices]
    .sort((a, b) => Number(a) - Number(b))
    .forEach((priceKey) => {
      const priceValue = Number(priceKey);
      const color = ensureLocalPriceColor(priceValue);
      if (color) {
        priceColorMap.set(priceValue, color);
      }
    });
};

const updateProjectOptionStats = (projectData = activeProject) => {
  if (!projectData) return;
  const seats = Object.values(projectData.seats || {});
  const available = seats.filter((seat) => seat.status === 'available').length;
  const option = [...projectSelect.options].find((opt) => opt.value === projectData.id);
  if (option) {
    option.textContent = `${projectData.name}（剩余 ${available}）`;
  }
  const projectIndex = projects.findIndex((item) => item.id === projectData.id);
  if (projectIndex >= 0) {
    projects[projectIndex] = {
      ...projects[projectIndex],
      availableSeats: available,
      updatedAt: projectData.updatedAt ?? Date.now(),
      name: projectData.name,
      rows: projectData.rows ?? projects[projectIndex].rows,
      cols: projectData.cols ?? projects[projectIndex].cols,
    };
  } else if (projectData.id) {
    projects.push({
      id: projectData.id,
      name: projectData.name,
      availableSeats: available,
      rows: projectData.rows,
      cols: projectData.cols,
      createdAt: projectData.createdAt,
      updatedAt: projectData.updatedAt ?? Date.now(),
    });
  }

  if (!option) {
    const currentValue = projectSelect.value;
    populateProjectSelect();
    if (currentValue) {
      projectSelect.value = currentValue;
    }
  }
};

const updateAutoSelectOptions = () => {
  if (!activeProject) {
    autoSelectPrice.innerHTML = '<option value="any">全部价位</option>';
    return;
  }
  const options = ['<option value="any">全部价位</option>'];
  zoneSummaryData.forEach((item) => {
    const value = item.price == null ? 'null' : String(item.price);
    const label = item.price != null ? `¥${item.price}` : '未设置票价';
    options.push(`<option value="${value}">${label}</option>`);
  });
  autoSelectPrice.innerHTML = options.join('');
  autoSelectPrice.value = 'any';
};

const updateZoneSummary = () => {
  if (!activeProject) {
    salesZoneSummaryList.innerHTML = '<li>暂无数据</li>';
    zoneSummaryData = [];
    updateAutoSelectOptions();
    return;
  }
  const summaryMap = new Map();
  Object.values(activeProject.seats || {}).forEach((seat) => {
    if (!seat || seat.status === 'disabled') return;
    const key = seat.price ?? null;
    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        price: key,
        total: 0,
        available: 0,
        locked: 0,
        sold: 0,
      });
    }
    const bucket = summaryMap.get(key);
    bucket.total += 1;
    if (seat.status === 'sold') {
      bucket.sold += 1;
    } else if (seat.status === 'locked') {
      bucket.locked += 1;
    } else {
      bucket.available += 1;
    }
  });
  zoneSummaryData = [...summaryMap.values()].sort((a, b) => {
    if (a.price == null && b.price == null) return 0;
    if (a.price == null) return 1;
    if (b.price == null) return -1;
    return b.price - a.price;
  });
  if (!zoneSummaryData.length) {
    salesZoneSummaryList.innerHTML = '<li>暂无启用座位</li>';
    updateAutoSelectOptions();
    return;
  }
  const fragment = document.createDocumentFragment();
  zoneSummaryData.forEach((item) => {
    const li = document.createElement('li');
    const label = item.price != null ? `¥${item.price}` : '未设置票价';
    li.textContent = `${label}：可售 ${item.available} / 锁定 ${item.locked} / 已售 ${item.sold}`;
    fragment.appendChild(li);
  });
  salesZoneSummaryList.innerHTML = '';
  salesZoneSummaryList.appendChild(fragment);
  updateAutoSelectOptions();
};

const adjustStageLabel = () => {
  if (!stageLabelEl || !activeProject) return;
  const cols = activeProject.cols || 1;
  const scale = Math.min(1.4, Math.max(0.6, cols / 20));
  stageLabelEl.style.transform = `translateX(-50%) scale(${scale.toFixed(2)})`;
};

const updateSeatElement = (seatId) => {
  if (!activeProject) return;
  const seat = activeProject.seats[seatId];
  const button = seatElements.get(seatId);
  if (!button) return;
  button.classList.remove(
    'seat--disabled',
    'seat--available',
    'seat--locked',
    'seat--held',
    'seat--sold',
    'seat--priced'
  );
  button.style.removeProperty('--seat-price-color');
  const fallbackNumber = button.dataset.col || '';
  button.textContent = extractSeatNumber(seat, fallbackNumber);
  button.dataset.label = seat?.seatLabel || '';

  let disable = false;

  if (!seat || seat.status === 'disabled') {
    button.classList.add('seat--disabled');
    disable = true;
  } else if (seat.status === 'sold') {
    button.classList.add('seat--sold');
    disable = true;
  } else if (seat.status === 'locked') {
    if (seat.lockedBy === mySocketId) {
      button.classList.add('seat--locked');
    } else {
      button.classList.add('seat--held');
      disable = false;
    }
  } else {
    button.classList.add('seat--available');
  }

  const allowPriceColor =
    seat &&
    seat.price != null &&
    priceColorMap.has(seat.price) &&
    seat.status !== 'sold' &&
    (seat.status !== 'locked' || seat.lockedBy === mySocketId);
  if (allowPriceColor) {
    button.classList.add('seat--priced');
    button.style.setProperty('--seat-price-color', priceColorMap.get(seat.price));
  }

  button.disabled = disable;
  const rowIndex = Number(button.dataset.row ?? '-1');
  button.title = seat && seat.seatLabel
    ? `${seat.seatLabel}${seat.price != null ? `| ¥${seat.price}` : ''}`
    : `行 ${Number.isNaN(rowIndex) ? '-' : rowIndex + 1} / 列 ${button.dataset.col}`;
};

const handleSeatGridClick = (event) => {
  const grid = event.currentTarget;
  const button = event.target.closest('button[data-seat-id]');
  if (!grid || !button || !grid.contains(button)) return;
  if (!activeProject) return;
  const seatId = button.dataset.seatId;
  const currentSeat = activeProject.seats[seatId];
  if (!currentSeat) return;

  const queue = ensureSeatLockQueue();
  const lockSeatOnce = () =>
    new Promise((resolve) => {
      socket.emit('lock-seat', { projectId: activeProject.id, seatId }, (resp) => resolve(resp || {}));
    });

  const cancelQueue = () => {
    const pending = queue.get(seatId);
    if (!pending) return false;
    clearTimeout(pending.timer);
    queue.delete(seatId);
    showStatus('已取消排队等待。');
    return true;
  };

  const scheduleRetry = (retryAfterMs, lockedBy, lockExpiresAt) => {
    cancelQueue();
    const ownerName = describeLockOwner(lockedBy);
    const seconds = formatDurationSeconds(retryAfterMs);
    const displaySeconds = Math.min(999, seconds);
    showStatus(
      `座位被 ${ownerName} 占用，预计 ${displaySeconds}s 后可重试。已开启排队等待。`,
      true,
      [
        {
          label: '立即重试',
          variant: 'primary',
          onClick: async () => {
            const resp = await lockSeatOnce();
            if (!resp.ok) {
              if (resp.code === 'LOCKED') {
                const now = resp.serverTime || Date.now();
                const ms = resp.retryAfterMs ?? Math.max(1000, (resp.lockExpiresAt || now) - now);
                scheduleRetry(ms, resp.lockedBy, resp.lockExpiresAt);
              } else {
                showStatus(resp.message || '锁定失败', true);
              }
              return;
            }
            const seatRef = activeProject.seats[seatId];
            if (seatRef) {
              seatRef.status = 'locked';
              seatRef.lockedBy = mySocketId;
              seatRef.lockExpiresAt = resp.lockExpiresAt || Date.now() + 120000;
              showStatus(`${formatSeatLabel(seatRef)} 已锁定，请在右侧签发。`);
            } else {
              showStatus('座位已锁定，请在右侧签发。');
            }
            updateSeatElement(seatId);
            updateSelectedList();
            updateProjectOptionStats();
            updateZoneSummary();
          },
        },
        {
          label: '取消排队',
          variant: 'secondary',
          onClick: () => cancelQueue(),
        },
      ]
    );
    const delay = Math.min(Math.max(900, retryAfterMs || 1000), 10_000);
    const timer = setTimeout(() => {
      socket.emit('lock-seat', { projectId: activeProject.id, seatId }, (resp) => {
        if (!resp.ok) {
          if (resp.code === 'LOCKED') {
            const now = resp.serverTime || Date.now();
            const ms = resp.retryAfterMs ?? Math.max(1000, (resp.lockExpiresAt || now) - now);
            scheduleRetry(ms, resp.lockedBy, resp.lockExpiresAt);
          } else {
            queue.delete(seatId);
            showStatus(resp.message || '锁定失败', true, [
              {
                label: '重试',
                variant: 'primary',
                onClick: async () => {
                  const retry = await lockSeatOnce();
                  if (!retry.ok) {
                    showStatus(retry.message || '锁定失败', true);
                    return;
                  }
                  const seatRef = activeProject.seats[seatId];
                  if (seatRef) {
                    seatRef.status = 'locked';
                    seatRef.lockedBy = mySocketId;
                    seatRef.lockExpiresAt = retry.lockExpiresAt || Date.now() + 120000;
                  }
                  updateSeatElement(seatId);
                  updateSelectedList();
                  updateProjectOptionStats();
                  updateZoneSummary();
                  showStatus('座位已锁定，请在右侧签发。');
                },
              },
            ]);
          }
          return;
        }
        queue.delete(seatId);
        const seatRef = activeProject.seats[seatId];
        if (seatRef) {
          seatRef.status = 'locked';
          seatRef.lockedBy = mySocketId;
          seatRef.lockExpiresAt = resp.lockExpiresAt || Date.now() + 120000;
          showStatus(`${formatSeatLabel(seatRef)} 已锁定，请在右侧签发。`);
        } else {
          showStatus('座位已锁定，请在右侧签发。');
        }
        updateSeatElement(seatId);
        updateSelectedList();
        updateProjectOptionStats();
        updateZoneSummary();
      });
    }, delay);
    queue.set(seatId, { timer, lockExpiresAt });
  };

  if (currentSeat.status === 'available') {
    if (cancelQueue()) return;
    socket.emit('lock-seat', { projectId: activeProject.id, seatId }, (resp) => {
      if (!resp.ok) {
        if (resp.code === 'LOCKED') {
          const now = resp.serverTime || Date.now();
          const retryAfterMs = resp.retryAfterMs ?? Math.max(1000, (resp.lockExpiresAt || now) - now);
          scheduleRetry(retryAfterMs, resp.lockedBy, resp.lockExpiresAt);
          return;
        }
        showStatus(resp.message || '锁定失败', true, [
          {
            label: '重试',
            variant: 'primary',
            onClick: async () => {
              const retry = await lockSeatOnce();
              if (!retry.ok) {
                if (retry.code === 'LOCKED') {
                  const now = retry.serverTime || Date.now();
                  const ms = retry.retryAfterMs ?? Math.max(1000, (retry.lockExpiresAt || now) - now);
                  scheduleRetry(ms, retry.lockedBy, retry.lockExpiresAt);
                } else {
                  showStatus(retry.message || '锁定失败', true);
                }
                return;
              }
              const seatRef = activeProject.seats[seatId];
              if (seatRef) {
                seatRef.status = 'locked';
                seatRef.lockedBy = mySocketId;
                seatRef.lockExpiresAt = retry.lockExpiresAt || seatRef.lockExpiresAt;
              }
              updateSeatElement(seatId);
              updateSelectedList();
              updateProjectOptionStats();
              updateZoneSummary();
              showStatus('座位已锁定，请在右侧签发。');
            },
          },
        ]);
      } else {
        const seatRef = activeProject.seats[seatId];
        if (seatRef) {
          seatRef.status = 'locked';
          seatRef.lockedBy = mySocketId;
          seatRef.lockExpiresAt = resp.lockExpiresAt || seatRef.lockExpiresAt;
          showStatus(`${formatSeatLabel(seatRef)} 已锁定，请在右侧签发。`);
        } else {
          showStatus('座位已锁定，请在右侧签发。');
        }
        updateSeatElement(seatId);
        updateSelectedList();
        updateProjectOptionStats();
        updateZoneSummary();
      }
    });
  } else if (currentSeat.status === 'locked') {
    if (currentSeat.lockedBy === mySocketId) {
      socket.emit('unlock-seat', { projectId: activeProject.id, seatId }, (resp) => {
        if (!resp.ok) {
          showStatus(resp.message, true, [
            {
              label: '重试',
              variant: 'primary',
              onClick: () => handleSeatGridClick({ currentTarget: grid, target: button }),
            },
          ]);
        } else {
          const seatRef = activeProject.seats[seatId];
          if (seatRef) {
            seatRef.status = 'available';
            seatRef.lockedBy = null;
            seatRef.lockExpiresAt = null;
            showStatus(`${formatSeatLabel(seatRef)} 已取消选中。`);
          } else {
            showStatus('已取消选中。');
          }
          if (pendingIssue && pendingIssue.seatId === seatId) {
            clearPendingIssue();
          }
          updateSeatElement(seatId);
          updateSelectedList();
          updateProjectOptionStats();
          updateZoneSummary();
        }
      });
    } else {
      if (cancelQueue()) return;
      socket.emit('lock-seat', { projectId: activeProject.id, seatId }, (resp) => {
        if (!resp.ok) {
          if (resp.code === 'LOCKED') {
            const now = resp.serverTime || Date.now();
            const retryAfterMs = resp.retryAfterMs ?? Math.max(1000, (resp.lockExpiresAt || now) - now);
            scheduleRetry(retryAfterMs, resp.lockedBy, resp.lockExpiresAt);
            return;
          }
          showStatus(resp.message || '锁定失败', true, [
            {
              label: '重试',
              variant: 'primary',
              onClick: async () => {
                const retry = await lockSeatOnce();
                if (!retry.ok) {
                  if (retry.code === 'LOCKED') {
                    const now = retry.serverTime || Date.now();
                    const ms = retry.retryAfterMs ?? Math.max(1000, (retry.lockExpiresAt || now) - now);
                    scheduleRetry(ms, retry.lockedBy, retry.lockExpiresAt);
                  } else {
                    showStatus(retry.message || '锁定失败', true);
                  }
                  return;
                }
                const seatRef = activeProject.seats[seatId];
                if (seatRef) {
                  seatRef.status = 'locked';
                  seatRef.lockedBy = mySocketId;
                  seatRef.lockExpiresAt = retry.lockExpiresAt || seatRef.lockExpiresAt;
                }
                updateSeatElement(seatId);
                updateSelectedList();
                updateProjectOptionStats();
                updateZoneSummary();
                showStatus('座位已锁定，请在右侧签发。');
              },
            },
          ]);
          return;
        }
        const seatRef = activeProject.seats[seatId];
        if (seatRef) {
          seatRef.status = 'locked';
          seatRef.lockedBy = mySocketId;
          seatRef.lockExpiresAt = resp.lockExpiresAt || seatRef.lockExpiresAt;
          showStatus(`${formatSeatLabel(seatRef)} 已锁定，请在右侧签发。`);
        } else {
          showStatus('座位已锁定，请在右侧签发。');
        }
        updateSeatElement(seatId);
        updateSelectedList();
        updateProjectOptionStats();
        updateZoneSummary();
      });
    }
  } else if (currentSeat.status === 'sold') {
    showStatus('该座位已经签发。', true);
  }
};

const bindSeatGridEvents = (grid) => {
  if (!grid || grid.dataset.bound === 'true') return;
  grid.dataset.bound = 'true';
  grid.addEventListener('click', handleSeatGridClick);
};

const buildSeatGrid = (force = false) => {
  if (!activeProject) {
    resetSeatCanvas();
    return;
  }
  const { rows, cols } = activeProject;
  const signature = `${rows}x${cols}`;
  if (!force && seatGridElement && seatGridSignature === signature) {
    computePriceColorMap();
    Object.keys(activeProject.seats).forEach(updateSeatElement);
    updateZoneSummary();
    adjustStageLabel();
    return;
  }
  seatGridSignature = signature;
  seatCanvas.innerHTML = '';
  seatElements.clear();
  const container = document.createElement('div');
  container.className = 'seat-grid-container';

  const columnsHeader = document.createElement('div');
  columnsHeader.className = 'seat-grid-columns';
  columnsHeader.style.gridTemplateColumns = `repeat(${cols}, 34px)`;
  for (let col = 0; col < cols; col += 1) {
    const label = document.createElement('span');
    label.textContent = String(col + 1);
    columnsHeader.appendChild(label);
  }

  const content = document.createElement('div');
  content.className = 'seat-grid-content';

  const rowsHeader = document.createElement('div');
  rowsHeader.className = 'seat-grid-rows';
  rowsHeader.style.gridTemplateRows = `repeat(${rows}, 34px)`;
  for (let row = 0; row < rows; row += 1) {
    const label = document.createElement('span');
    label.textContent = String(row + 1);
    rowsHeader.appendChild(label);
  }

  const grid = document.createElement('div');
  grid.className = 'seat-grid';
  grid.style.gridTemplateColumns = `repeat(${cols}, 34px)`;
  const fragment = document.createDocumentFragment();

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const id = seatKey(row, col);
      const seat = activeProject.seats[id];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'seat-button';
      button.dataset.seatId = id;
      button.dataset.row = String(row);
      button.dataset.col = String(col + 1);
      button.title = seat?.seatLabel || `行 ${row + 1} / 列 ${col + 1}`;
      button.dataset.label = seat?.seatLabel || '';
      button.textContent = extractSeatNumber(seat, String(col + 1));

      fragment.appendChild(button);
      seatElements.set(id, button);
    }
  }

  grid.appendChild(fragment);
  bindSeatGridEvents(grid);
  content.appendChild(rowsHeader);
  content.appendChild(grid);
  container.appendChild(columnsHeader);
  container.appendChild(content);
  seatCanvas.appendChild(container);
  seatGridElement = grid;
  seatCanvas.dataset.gridSignature = signature;
  computePriceColorMap();
  Object.keys(activeProject.seats).forEach(updateSeatElement);
  updateZoneSummary();
  adjustStageLabel();
};

const getSelfLockedSeats = () => {
  if (!activeProject) return [];
  return Object.values(activeProject.seats).filter(
    (seat) => seat.status === 'locked' && seat.lockedBy === mySocketId
  );
};

const findAutoSelection = (priceFilter, count) => {
  if (!activeProject) return null;
  const matchesPrice = (seat) => {
    if (priceFilter === 'any') return true;
    if (priceFilter === null) return seat.price == null;
    return Number(seat.price) === Number(priceFilter);
  };
  const center = (activeProject.cols - 1) / 2;
  let best = null;
  for (let row = 0; row < activeProject.rows; row += 1) {
    let streak = [];
    for (let col = 0; col < activeProject.cols; col += 1) {
      const id = seatKey(row, col);
      const seat = activeProject.seats[id];
      if (seat && seat.status === 'available' && matchesPrice(seat)) {
        streak.push({ id, seat });
        if (streak.length === count) {
          const group = streak.slice();
          const midPoint = (group[0].seat.col + group[group.length - 1].seat.col) / 2;
          const distance = Math.abs(midPoint - center);
          if (
            !best ||
            row < best.row ||
            (row === best.row && distance < best.distance)
          ) {
            best = {
              row,
              distance,
              seats: group.map((entry) => entry.id),
            };
          }
          streak.shift();
        }
      } else {
        streak = [];
      }
    }
  }
  return best ? best.seats : null;
};

const updateSelectedList = () => {
  const seats = getSelfLockedSeats();
  selectedList.innerHTML = '';
  const seatDiscountedPrices = new Map();
  seats
    .sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    })
    .forEach((seat) => {
      const item = document.createElement('li');
      item.className = 'selected-item';
      item.dataset.seatId = seatKey(seat.row, seat.col);

      const info = document.createElement('div');
      info.className = 'selected-item__info';
      const title = document.createElement('strong');
      title.textContent = formatSeatLabel(seat);
      const price = document.createElement('span');
      const id = seatKey(seat.row, seat.col);
      const basePrice = Number(seat.price) || 0;
      const discounted = seatDiscountedPrices.has(id) ? seatDiscountedPrices.get(id) : null;
      if (discounted != null && discounted !== basePrice) {
        price.textContent = `票价：¥${basePrice.toFixed(2)} → ¥${Number(discounted).toFixed(2)}`;
      } else {
        price.textContent = `票价：¥${basePrice.toFixed(2)}`;
      }
      info.appendChild(title);
      info.appendChild(price);

      const actions = document.createElement('div');
      actions.className = 'selected-item__actions';
      const removeBtn = document.createElement('button');
      removeBtn.className = 'button';
      removeBtn.type = 'button';
      removeBtn.dataset.action = 'remove';
      removeBtn.textContent = '删除';
      if (activeTicketOrder) {
        removeBtn.disabled = true;
      }

      actions.appendChild(removeBtn);

      item.appendChild(info);
      item.appendChild(actions);
      selectedList.appendChild(item);
    });

  selectedCountEl.textContent = String(seats.length);
  const total = seats.reduce((sum, seat) => sum + (Number(seat.price) || 0), 0);
  selectedTotalEl.textContent = `¥${total.toFixed(2)}`;
  if (btnClearSelected) {
    btnClearSelected.disabled = seats.length === 0;
  }
  if (btnTicketCheckout) {
    btnTicketCheckout.disabled = seats.length === 0;
  }
  if (btnClearSelected && activeTicketOrder) btnClearSelected.disabled = true;
  if (btnTicketCheckout && activeTicketOrder) btnTicketCheckout.disabled = true;
  if (!seats.length) {
    const empty = document.createElement('li');
    empty.className = 'hint';
    empty.textContent = '尚未选中座位。点击座位图中的可售座位即可锁定。';
    selectedList.appendChild(empty);
  }
};

if (selectedList) selectedList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const item = event.target.closest('.selected-item');
  if (!item) return;
  const seatId = item.dataset.seatId;
  if (!seatId || !activeProject) return;

  if (action === 'remove') {
    socket.emit('unlock-seat', { projectId: activeProject.id, seatId }, (resp) => {
      if (!resp.ok) {
        showStatus(resp.message, true);
      } else {
        showStatus('已取消该座位。');
      }
    });
  }
});

const populateProjectSelect = () => {
  if (!projectSelect) return;
  projectSelect.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.disabled = true;
  placeholder.textContent = projects.length ? '请选择售票项目' : '暂无可用项目';
  projectSelect.appendChild(placeholder);
  projects
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((project) => {
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = `${project.name}（剩余 ${project.availableSeats}）`;
      if (activeProject && activeProject.id === project.id) {
        option.selected = true;
      }
      projectSelect.appendChild(option);
    });
  if (!activeProject) {
    placeholder.selected = true;
  }
  projectSelect.disabled = false;
};

const fetchProjects = async () => {
  try {
    const response = await authFetch('/api/projects');
    if (!response.ok) throw new Error('无法获取项目列表');
    const data = await response.json();
    projects = data.projects || [];
    populateProjectSelect();
    pendingCheckins = await loadPendingCheckins();
    renderPendingCheckins();
    if (!activeProject && projects.length) {
      const firstId = projects[0].id;
      if (firstId) {
        projectSelect.value = firstId;
        loadProject(firstId);
      }
    }
  } catch (error) {
    showStatus(error.message, true);
    projectSelect.disabled = false;
  }
};

const joinProjectRoom = (projectId) => {
  socket.emit('project:join', { projectId }, (resp) => {
    if (!resp.ok) {
      showStatus(resp.message, true);
    }
  });
};

const buildProjectSwitchWarning = () => {
  const warnings = [];
  const lockedSeats = getSelfLockedSeats();
  if (lockedSeats.length) warnings.push(`已锁定座位：${lockedSeats.length} 个`);
  if (pendingIssue) warnings.push('有待签发/待扫码任务');
  if (checkinLoopActive || scanningLoopActive || voucherScanLoopActive) warnings.push('摄像头扫码正在运行');
  if (pendingCheckins.length) warnings.push(`待重试检票：${pendingCheckins.length} 条`);
  if (merchCart.length) warnings.push(`文创购物车：${merchCart.length} 种商品`);
  if (activeTicketCoupon) warnings.push('已绑定优惠券');
  if (voucherScanDialog?.open) warnings.push('扫码弹窗未关闭');
  return warnings;
};

const resetLocalStateForProjectSwitch = async () => {
  stopCheckinScanner();
  stopIssueScanner();
  stopVoucherScan();
  closeVoucherDialog();
  clearSeatLockQueue();

  if (manualCodeInput) manualCodeInput.value = '';
  if (issueUploadFile) issueUploadFile.value = '';
  if (scanOverlay) scanOverlay.textContent = '等待签发指令...';

  // 释放本机锁座
  const lockedSeats = getSelfLockedSeats();
  if (lockedSeats.length && activeProject?.id) {
    lockedSeats.forEach((seat) => {
      const id = seatKey(seat.row, seat.col);
      const seatRef = activeProject?.seats?.[id];
      if (seatRef) {
        seatRef.status = 'available';
        seatRef.lockedBy = null;
        seatRef.lockExpiresAt = null;
        updateSeatElement(id);
      }
    });
    await Promise.allSettled(
      lockedSeats.map((seat) =>
        emitAsync('unlock-seat', { projectId: activeProject.id, seatId: seatKey(seat.row, seat.col) })
      )
    );
  }

  // 清空优惠券/待重试/购物车等本机状态
  clearTicketCoupon();
  pendingIssue = null;
  pendingCheckins = [];
  await savePendingCheckins(pendingCheckins);
  renderPendingCheckins();

  merchCart = [];
  if (inputPresaleCode) inputPresaleCode.value = '';
  if (inputRedeemCode) inputRedeemCode.value = '';
  if (merchNoteInput) merchNoteInput.value = '';
  if (merchStatusEl) merchStatusEl.textContent = '';
  if (redeemVoucherInfo) redeemVoucherInfo.textContent = '暂无预购券信息。';
  renderMerchCart();
  renderMerchProducts();
  renderMerchModes();

  if (checkinResultEl) checkinResultEl.textContent = '等待检票...';
  setCheckinOverlay('等待检票...', false);
  updateSelectedList();
};

const refreshActiveProject = async () => {
  if (!activeProject) {
    const candidateId = projectSelect?.value || projects?.[0]?.id;
    if (candidateId) {
      await loadProject(candidateId);
    }
    return;
  }
  try {
    const response = await authFetch(`/api/projects/${activeProject.id}`);
    if (!response.ok) throw new Error('无法刷新项目数据');
    const data = await response.json();
    activeProject = data.project;
    ensureActiveProjectMetadata();
    computePriceColorMap();
    buildSeatGrid(true);
    updateSelectedList();
    updateProjectOptionStats();
    updateZoneSummary();
    updateCheckinStats();
    renderCheckinSeatGrid();
  } catch (error) {
    showStatus(error.message || '刷新失败', true);
  }
};

const loadProject = async (projectId) => {
  resetSeatCanvas('载入座位中...');
  try {
    const response = await authFetch(`/api/projects/${projectId}`);
    if (!response.ok) throw new Error('项目不存在或已删除');
    const data = await response.json();
    activeProject = data.project;
    ensureActiveProjectMetadata();
    computePriceColorMap();
    buildSeatGrid();
    updateSelectedList();
    projectSelect.value = projectId;
    updateProjectOptionStats();
    btnAutoSelect.disabled = false;
    joinProjectRoom(projectId);
    projectHint.textContent = `当前项目：${activeProject.name}，座位 ${activeProject.rows}×${activeProject.cols}。`;
    showStatus('座位已同步，请选择需要签发的座位。');
    updateCheckinStats();
    renderCheckinSeatGrid();
  } catch (error) {
    activeProject = null;
    resetSeatCanvas(error.message);
    updateSelectedList();
    projectHint.textContent = error.message;
    showStatus(error.message, true);
    btnAutoSelect.disabled = true;
  }
};

if (projectSelect) {
  projectSelect.addEventListener('change', async (event) => {
    if (isRevertingProjectSelect) return;
    const projectId = event.target.value;
    if (!projectId) return;
    const prevProjectId = activeProject?.id || '';
    if (prevProjectId && prevProjectId !== projectId) {
      const warnings = buildProjectSwitchWarning();
      if (warnings.length) {
        const ok = window.confirm(
          `切换项目将自动清空/停止以下本机状态，以避免跨项目误操作：\n\n- ${warnings.join(
            '\n- '
          )}\n\n是否继续切换？`
        );
        if (!ok) {
          isRevertingProjectSelect = true;
          projectSelect.value = prevProjectId;
          window.setTimeout(() => {
            isRevertingProjectSelect = false;
          }, 0);
          return;
        }
      }
      await resetLocalStateForProjectSwitch();
    }
    await loadProject(projectId);
  });
}

if (btnRefreshProjects) {
  btnRefreshProjects.addEventListener('click', () => {
    fetchProjects().then(() => refreshActiveProject());
  });
}

if (salesTabs.length) {
  salesTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchModule(tab.dataset.module);
    });
  });
}

const ensureScanner = async () => {
  if (barcodeDetector || scanContext) return Boolean(barcodeDetector);
  if (!navigator.mediaDevices) {
    showStatus('该设备不支持摄像头调用，请使用手动输入。', true);
    issueCameraLastError = '设备不支持摄像头调用';
    renderScanMethodsPanels();
    return false;
  }
  renderHttpsHelpPanels();
  if (!window.isSecureContext) {
    showStatus('摄像头扫码需要受信任的 HTTPS（或 localhost/127.0.0.1），已切换到手动输入。', true);
    showScanOverlayMessage('摄像头扫码需要 HTTPS：可在下方一键复制/打开 HTTPS 链接。', { visible: true });
    issueCameraLastError = '需要 HTTPS（或 localhost/127.0.0.1）才能调用摄像头';
    renderScanMethodsPanels();
    return false;
  }
  try {
    if (videoEl && !videoEl.hasAttribute('playsinline')) videoEl.setAttribute('playsinline', 'true');
    renderHttpsHelpPanels();
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    videoEl.srcObject = videoStream;
    if (videoEl.play) {
      videoEl.play().catch(() => {});
    }
  } catch (error) {
    const reason =
      error && error.name === 'NotAllowedError'
        ? '摄像头权限被拒绝，请在浏览器/系统设置中允许摄像头权限，或改用手动输入。'
        : '无法访问摄像头，请检查权限或改用手动输入。';
    showStatus(reason, true);
    issueCameraLastError = reason;
    renderScanMethodsPanels();
    return false;
  }
  issueCameraLastError = '';
  renderScanMethodsPanels();
	  if ('BarcodeDetector' in window) {
	    try {
	      try {
	        barcodeDetector = new window.BarcodeDetector({ formats: BARCODE_FORMATS });
	      } catch {
	        barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
	      }
	      scanCanvas.width = 640;
	      scanCanvas.height = 360;
	      scanContext = scanCanvas.getContext('2d');
	      startScanLoop();
	    } catch (error) {
	      barcodeDetector = null;
	      // 原生初始化失败时尝试 ZXing（多码制）回退，再尝试 jsQR
	      zxingDetector = zxingDetector || createZxingCanvasDetector();
	      if (zxingDetector) {
	        scanCanvas.width = 640;
	        scanCanvas.height = 360;
	        scanContext = scanCanvas.getContext('2d');
	        barcodeDetector = zxingDetector;
	        startScanLoop();
	        showStatus('已切换到软件识别模式（ZXing）。');
	        showScanOverlayMessage('已切换到软件识别模式（ZXing），请继续对准条码/二维码。', { visible: true });
	      } else if (window.jsQR) {
	        scanCanvas.width = 640;
	        scanCanvas.height = 360;
	        scanContext = scanCanvas.getContext('2d');
	        jsQrDetector = jsQrDetector || {
	          detect: async (canvas) => {
	            const ctx = canvas.getContext('2d');
	            if (!ctx) return [];
	            const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const result = window.jsQR(img.data, canvas.width, canvas.height, {
              inversionAttempts: 'attemptBoth',
            });
            return result ? [{ rawValue: result.data }] : [];
	          },
	        };
	        barcodeDetector = jsQrDetector;
	        startScanLoop();
	      } else {
	        showStatus('扫码引擎不可用：未能初始化识别器，请使用手动输入。', true);
	      }
	    }
	  } else {
	    // Fallback：ZXing（多码制）→ jsQR（仅二维码）
	    zxingDetector = zxingDetector || createZxingCanvasDetector();
	    if (zxingDetector) {
	      scanCanvas.width = 640;
	      scanCanvas.height = 360;
	      scanContext = scanCanvas.getContext('2d');
	      barcodeDetector = zxingDetector;
	      startScanLoop();
	      showStatus('已切换到软件识别模式（ZXing）。');
	      showScanOverlayMessage('已切换到软件识别模式（ZXing），请继续对准条码/二维码。', { visible: true });
	    } else if (window.jsQR) {
	      scanCanvas.width = 640;
	      scanCanvas.height = 360;
	      scanContext = scanCanvas.getContext('2d');
	      jsQrDetector = jsQrDetector || {
	        detect: async (canvas) => {
	          const ctx = canvas.getContext('2d');
	          if (!ctx) return [];
	          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = window.jsQR(img.data, canvas.width, canvas.height, {
            inversionAttempts: 'attemptBoth',
          });
          return result ? [{ rawValue: result.data }] : [];
        },
      };
      barcodeDetector = jsQrDetector;
      startScanLoop();
    } else {
      showStatus('浏览器不支持扫码，且未加载回退识别脚本（可能离线）。请使用手动输入。', true);
    }
  }
  return Boolean(barcodeDetector);
};

const drawImageFileToCanvas = async (file, maxDim = 1200) => {
  if (!file) return null;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const loadViaImg = () =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('图片加载失败'));
      };
      img.src = url;
    });

  let source = null;
  try {
    source = window.createImageBitmap ? await createImageBitmap(file) : await loadViaImg();
  } catch {
    try {
      source = await loadViaImg();
    } catch {
      return null;
    }
  }

  const srcW = source.width || source.videoWidth;
  const srcH = source.height || source.videoHeight;
  if (!srcW || !srcH) return null;
  const scale = Math.min(1, maxDim / Math.max(srcW, srcH));
  canvas.width = Math.max(1, Math.floor(srcW * scale));
  canvas.height = Math.max(1, Math.floor(srcH * scale));
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if (source && typeof source.close === 'function') {
    source.close();
  }
  return { canvas, ctx };
};

const decodeBarcodeFromImageFile = async (file) => {
  const drawn = await drawImageFileToCanvas(file, 1280);
  if (!drawn) return null;
  const { canvas, ctx } = drawn;

  if ('BarcodeDetector' in window) {
    try {
      let detector = null;
      try {
        detector = new window.BarcodeDetector({ formats: BARCODE_FORMATS });
      } catch {
        detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      }
      const codes = await detector.detect(canvas);
      const raw = (codes?.[0]?.rawValue || '').trim();
      if (raw) return raw;
    } catch {
      // ignore and fallback
    }
  }

  if (window.jsQR) {
    try {
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = window.jsQR(img.data, canvas.width, canvas.height, {
        inversionAttempts: 'attemptBoth',
      });
      const raw = (result?.data || '').trim();
      if (raw) return raw;
    } catch {
      // ignore
    }
  }

  // 最终兜底：ZXing（支持 PDF417/一维码/二维码等），用于“上传图片识别”等场景
  if (window.ZXingBrowser && window.ZXingBrowser.BrowserMultiFormatReader) {
    try {
      // 为 PDF417 等提高一次分辨率（过小会影响识别）
      const hiRes = await drawImageFileToCanvas(file, 2048);
      const targetCanvas = hiRes?.canvas || canvas;
      const reader = new window.ZXingBrowser.BrowserMultiFormatReader();
      try {
        const result = await reader.decodeFromCanvas(targetCanvas);
        const raw = (result?.getText?.() || result?.text || '').trim();
        if (raw) return raw;
      } finally {
        if (typeof reader.reset === 'function') reader.reset();
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const stopCheckinScanner = () => {
  checkinLoopActive = false;
  if (checkinStream) {
    checkinStream.getTracks().forEach((t) => t.stop());
    checkinStream = null;
  }
  if (checkinDetector && typeof checkinDetector.reset === 'function') {
    try {
      checkinDetector.reset();
    } catch {
      // ignore
    }
  }
  checkinDetector = null;
  checkinContext = null;
  setCheckinOverlay('已停止检票', true);
  renderScanMethodsPanels();
};

const startCheckinScanner = async () => {
  if (!checkinVideo || !checkinCanvas) return;
  if (!navigator.mediaDevices) {
    setCheckinResult('设备不支持摄像头，请使用手动检票。', 'error');
    checkinCameraLastError = '设备不支持摄像头调用';
    renderScanMethodsPanels();
    return;
  }
  renderHttpsHelpPanels();
  if (!window.isSecureContext) {
    setCheckinOverlay('摄像头扫码需要 HTTPS，可在下方复制/打开 HTTPS 链接。', true);
    setCheckinResult('摄像头扫码需要受信任的 HTTPS（或 localhost/127.0.0.1）。', 'error');
    checkinCameraLastError = '需要 HTTPS（或 localhost/127.0.0.1）才能调用摄像头';
    renderScanMethodsPanels();
    return;
  }
  try {
    if (!checkinVideo.hasAttribute('playsinline')) checkinVideo.setAttribute('playsinline', 'true');
    renderHttpsHelpPanels();
    checkinStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    checkinVideo.srcObject = checkinStream;
  } catch (error) {
    const reason =
      error && error.name === 'NotAllowedError'
        ? '摄像头权限被拒绝，请在浏览器/系统设置中允许摄像头权限，或改用手动检票。'
        : '无法访问摄像头，请检查权限或改用手动检票。';
    setCheckinResult(reason, 'error');
    checkinCameraLastError = reason;
    renderScanMethodsPanels();
    return;
  }
  checkinCameraLastError = '';
  renderScanMethodsPanels();
  if ('BarcodeDetector' in window) {
    try {
      try {
        checkinDetector = new window.BarcodeDetector({ formats: BARCODE_FORMATS });
      } catch {
        checkinDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      }
      checkinCanvas.width = 640;
      checkinCanvas.height = 360;
      checkinContext = checkinCanvas.getContext('2d');
      checkinLoopActive = true;
      runCheckinLoop();
      setCheckinOverlay('摄像头已就绪，开始扫码检票。', true);
      setCheckinResult('摄像头已就绪，开始扫码检票。', null);
    } catch (error) {
      // 回退：ZXing（多码制）→ jsQR（仅二维码）
      zxingCheckinDetector = zxingCheckinDetector || createZxingCanvasDetector();
      if (zxingCheckinDetector) {
        checkinDetector = zxingCheckinDetector;
        checkinCanvas.width = 640;
        checkinCanvas.height = 360;
        checkinContext = checkinCanvas.getContext('2d');
        checkinLoopActive = true;
        runCheckinLoop();
        setCheckinOverlay('已切换到软件识别模式（ZXing），请将条码/二维码对准取景框。', true);
        setCheckinResult('已切换到软件识别模式（ZXing）。', 'notice');
        return;
      }
      if (window.jsQR) {
        jsQrCheckinDetector = jsQrCheckinDetector || {
          detect: async (canvas) => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return [];
            const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const result = window.jsQR(img.data, canvas.width, canvas.height, {
              inversionAttempts: 'attemptBoth',
            });
            return result ? [{ rawValue: result.data }] : [];
          },
        };
        checkinDetector = jsQrCheckinDetector;
        checkinCanvas.width = 640;
        checkinCanvas.height = 360;
        checkinContext = checkinCanvas.getContext('2d');
        checkinLoopActive = true;
        runCheckinLoop();
        setCheckinOverlay('已切换到软件识别模式（jsQR），请将二维码对准取景框。', true);
        setCheckinResult('已切换到软件识别模式（jsQR）。', 'notice');
      } else {
        setCheckinResult('浏览器不支持扫码，请使用手动检票。', 'error');
      }
    }
  } else {
    zxingCheckinDetector = zxingCheckinDetector || createZxingCanvasDetector();
    if (zxingCheckinDetector) {
      checkinDetector = zxingCheckinDetector;
      checkinCanvas.width = 640;
      checkinCanvas.height = 360;
      checkinContext = checkinCanvas.getContext('2d');
      checkinLoopActive = true;
      runCheckinLoop();
      setCheckinOverlay('已切换到软件识别模式（ZXing），请将条码/二维码对准取景框。', true);
      setCheckinResult('已切换到软件识别模式（ZXing）。', 'notice');
      return;
    }
    if (window.jsQR) {
      jsQrCheckinDetector = jsQrCheckinDetector || {
        detect: async (canvas) => {
          const ctx = canvas.getContext('2d');
          if (!ctx) return [];
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = window.jsQR(img.data, canvas.width, canvas.height, {
            inversionAttempts: 'attemptBoth',
          });
          return result ? [{ rawValue: result.data }] : [];
        },
      };
      checkinDetector = jsQrCheckinDetector;
      checkinCanvas.width = 640;
      checkinCanvas.height = 360;
      checkinContext = checkinCanvas.getContext('2d');
      checkinLoopActive = true;
      runCheckinLoop();
      setCheckinOverlay('已切换到软件识别模式（jsQR），请将二维码对准取景框。', true);
      setCheckinResult('已切换到软件识别模式（jsQR）。', 'notice');
    } else {
      setCheckinResult('浏览器不支持扫码，请使用手动检票。', 'error');
    }
  }
};

const runCheckinLoop = async () => {
  if (checkinLoopActive === false) return;
  try {
    if (checkinDetector && checkinContext && checkinVideo.readyState >= 2) {
      checkinContext.drawImage(checkinVideo, 0, 0, checkinCanvas.width, checkinCanvas.height);
      const codes = await checkinDetector.detect(checkinCanvas);
      if (codes.length) {
        const raw = (codes[0].rawValue || '').trim();
        const now = Date.now();
        if (raw && (raw !== lastCheckinCode || now - lastCheckinTime > 1500)) {
          lastCheckinCode = raw;
          lastCheckinTime = now;
          submitCheckin(raw);
        }
        checkinDetectFailCount = 0;
      } else {
        checkinDetectFailCount += 1;
        if (checkinDetectFailCount > 3) {
          zxingCheckinDetector = zxingCheckinDetector || createZxingCanvasDetector();
          if (zxingCheckinDetector && checkinDetector !== zxingCheckinDetector) {
            checkinDetector = zxingCheckinDetector;
            checkinDetectFailCount = 0;
            setCheckinOverlay('已自动切换到软件识别模式（ZXing）', true);
            setCheckinResult('已自动切换到软件识别模式（ZXing）。', 'notice');
          } else if (window.jsQR && checkinDetector !== jsQrCheckinDetector) {
            jsQrCheckinDetector = jsQrCheckinDetector || {
              detect: async (canvas) => {
                const ctx = canvas.getContext('2d');
                if (!ctx) return [];
                const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const result = window.jsQR(img.data, canvas.width, canvas.height, {
                  inversionAttempts: 'attemptBoth',
                });
                return result ? [{ rawValue: result.data }] : [];
              },
            };
            checkinDetector = jsQrCheckinDetector;
            checkinDetectFailCount = 0;
            setCheckinOverlay('已自动切换到软件识别模式（jsQR）', true);
            setCheckinResult('已自动切换到软件识别模式（jsQR）。', 'notice');
          }
        }
      }
    }
  } catch {
    // ignore detection errors
  }
  requestAnimationFrame(runCheckinLoop);
};

const startScanLoop = () => {
  if (scanningLoopActive) return;
  scanningLoopActive = true;
  const loop = async () => {
    if (!scanningLoopActive) return;
    if (barcodeDetector && pendingIssue && videoEl.readyState >= 2) {
      scanContext.drawImage(videoEl, 0, 0, scanCanvas.width, scanCanvas.height);
      try {
        const barcodes = await barcodeDetector.detect(scanCanvas);
        if (barcodes.length) {
          const code = (barcodes[0].rawValue || '').trim();
          const now = Date.now();
          if (code && (code !== lastScannedCode || now - lastScanTime > 2000)) {
            lastScannedCode = code;
            lastScanTime = now;
            handleScannedCode(code);
          }
        }
        detectFailCount = 0;
      } catch {
        detectFailCount += 1;
        // 连续失败时尝试切换识别引擎：ZXing（多码制）→ jsQR（仅二维码）
        if (detectFailCount > 3) {
          zxingDetector = zxingDetector || createZxingCanvasDetector();
          if (zxingDetector && barcodeDetector !== zxingDetector) {
            barcodeDetector = zxingDetector;
            detectFailCount = 0;
            showStatus('已切换到软件识别模式（ZXing），请继续对准条码/二维码。');
            showScanOverlayMessage('已切换到软件识别模式（ZXing），请继续对准条码/二维码。', { visible: true });
          } else if (window.jsQR && barcodeDetector !== jsQrDetector) {
            jsQrDetector = jsQrDetector || {
              detect: async (canvas) => {
                const ctx = canvas.getContext('2d');
                if (!ctx) return [];
                const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const result = window.jsQR(img.data, canvas.width, canvas.height, {
                  inversionAttempts: 'attemptBoth',
                });
                return result ? [{ rawValue: result.data }] : [];
              },
            };
            barcodeDetector = jsQrDetector;
            detectFailCount = 0;
            showStatus('已切换到软件识别模式（jsQR），请继续对准二维码。');
            showScanOverlayMessage('已切换到软件识别模式（jsQR），请继续对准二维码。', { visible: true });
          }
        }
      }
    }
    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);
};

const requestTicketCode = (seatId) =>
  new Promise((resolve, reject) => {
    socket.emit('request-ticket-code', { projectId: activeProject.id, seatId }, (resp) => {
      if (!resp.ok) {
        reject(new Error(resp.message || '无法获取票码'));
      } else {
        const seat = activeProject.seats[seatId];
        if (seat) {
          seat.ticketCode = resp.ticketCode;
        }
        resolve(resp);
      }
    });
  });

const handleScannedCode = (code) => {
  if (!pendingIssue) return;
  if (code === pendingIssue.ticketCode) {
    showScanOverlayMessage('二维码匹配，正在签发...', { visible: true });
    issueSeat(pendingIssue.seatId, code);
  } else {
    showStatus('票码与当前座位不匹配，请确认后重试。', true);
    showScanOverlayMessage('票码不匹配，请重新扫描。', { visible: true });
  }
};

const clearPendingIssue = ({ keepMessage = false } = {}) => {
  pendingIssue = null;
  if (!keepMessage) {
    showScanOverlayMessage('等待签发指令...', { visible: true });
  }
};

const issueSeat = (seatId, ticketCode) => {
  const isOrderFlow = Boolean(activeTicketOrder && activeTicketOrder.orderId);
  const couponCode = isOrderFlow ? '' : normalizeTicketCouponInput(inputTicketCoupon?.value || '');
  if (!isOrderFlow && couponCode && inputTicketCoupon && inputTicketCoupon.value.trim() !== couponCode) {
    inputTicketCoupon.value = couponCode;
  }
  const orderId = isOrderFlow ? activeTicketOrder.orderId : null;
  socket.emit('seat:issue', { projectId: activeProject.id, seatId, ticketCode, couponCode, orderId }, (resp) => {
    if (!resp.ok) {
      showStatus(resp.message || '签发失败', true);
      showScanOverlayMessage(resp.message || '签发失败，请重试。', { visible: true });
      if (resp.code && String(resp.code).startsWith('COUPON_')) {
        setTicketCouponInfo(resp.message || '优惠券不可用', true);
      }
      return;
    }
    const seat = activeProject?.seats?.[seatId];
    if (seat) {
      seat.status = 'sold';
      seat.lockedBy = null;
      seat.lockExpiresAt = null;
      seat.issuedAt = Date.now();
      if (resp.seat && typeof resp.seat === 'object') {
        if (resp.seat.price !== undefined) seat.price = resp.seat.price;
        if (resp.seat.status) seat.status = resp.seat.status;
      }
    }
    if (resp.coupon && resp.coupon.code) {
      const label = `已使用优惠券 ${resp.coupon.code}，剩余 ${resp.coupon.remaining}`;
      setTicketCouponInfo(label);
      if (!activeTicketCoupon || activeTicketCoupon.code !== resp.coupon.code) {
        activeTicketCoupon = {
          code: resp.coupon.code,
          remaining: resp.coupon.remaining,
          status: resp.coupon.status,
          discountRate: resp.coupon.discountRate ?? null,
          allowedPrices: null,
        };
      } else {
        activeTicketCoupon.remaining = resp.coupon.remaining;
        activeTicketCoupon.status = resp.coupon.status;
        if (resp.coupon.discountRate != null) activeTicketCoupon.discountRate = resp.coupon.discountRate;
      }
      if (btnRedeemTicketCoupon) {
        btnRedeemTicketCoupon.disabled = !(activeTicketCoupon.status === 'issued' && Number(activeTicketCoupon.remaining) > 0);
      }
      if (resp.coupon.status === 'used' || resp.coupon.remaining <= 0) {
        setTicketCouponInfo(`优惠券 ${resp.coupon.code} 已用尽。`);
        if (inputTicketCoupon) inputTicketCoupon.value = '';
        activeTicketCoupon = null;
        if (btnRedeemTicketCoupon) btnRedeemTicketCoupon.disabled = true;
      }
    }
    updateSeatElement(seatId);
    updateSelectedList();
    updateProjectOptionStats();
    updateZoneSummary();
    showStatus('签发成功，座位已更新。');
    const seatLabel = seat ? formatSeatLabel(seat) : '';
    showScanOverlayMessage(
      seatLabel ? `${seatLabel} 已签发成功` : '签发成功，座位已更新。',
      { visible: true }
    );
    clearPendingIssue({ keepMessage: true });
    manualCodeInput.value = '';

    if (isOrderFlow && activeTicketOrder) {
      if (resp.order && resp.order.status === 'completed') {
        showStatus(`订单 ${resp.order.orderNo || ''} 已完成签发。`.trim());
        activeTicketOrder = null;
        updateSelectedList();
        return;
      }
      const nextSeatId = activeTicketOrder.seatQueue.shift();
      if (nextSeatId) {
        beginIssuance(nextSeatId);
      } else {
        activeTicketOrder = null;
        updateSelectedList();
      }
    }
  });
};

const beginIssuance = async (seatId) => {
  if (!activeProject) return;
  const seat = activeProject.seats[seatId];
  if (!seat) {
    showStatus('座位数据异常。', true);
    return;
  }
  if (seat.status === 'sold') {
    showStatus('该座位已经完成签发。', true);
    return;
  }
  if (seat.lockedBy !== mySocketId) {
    showStatus('请先锁定该座位。', true);
    return;
  }
  const scannerReady = await ensureScanner();
  issueScanPreference = scannerReady ? 'camera' : 'manual';
  renderScanMethodsPanels();
  if (!seat.ticketCode) {
    try {
      const { ticketCode } = await requestTicketCode(seatId);
      seat.ticketCode = ticketCode;
    } catch (error) {
      showStatus(error.message, true);
      return;
    }
  }
  pendingIssue = {
    seatId,
    ticketCode: seat.ticketCode,
  };
  const label = seat.seatLabel || `行${seat.row + 1}列${seat.col + 1}`;
  showScanOverlayMessage(
    scannerReady ? `请扫描 ${label} 的二维码` : '等待手动输入票码...',
    { visible: true }
  );
  showStatus(scannerReady ? '正在等待二维码...' : '请输入票码进行验证。');
  if (!scannerReady && manualCodeInput) manualCodeInput.focus();
};

if (btnManualConfirm) btnManualConfirm.addEventListener('click', async () => {
  if (!activeProject) {
    showStatus('请选择项目后再操作。', true);
    return;
  }
  const code = manualCodeInput.value.trim();
  if (!code) {
    showStatus('请输入票码。', true);
    return;
  }
  let seat = getSelfLockedSeats().find(
    (candidate) => candidate.ticketCode === code && candidate.status !== 'sold'
  );
  if (!seat) {
    const selfSeats = getSelfLockedSeats().filter((candidate) => !candidate.ticketCode);
    try {
      await Promise.all(
        selfSeats.map((candidate) => requestTicketCode(seatKey(candidate.row, candidate.col)))
      );
    } catch (error) {
      showStatus(error.message, true);
      return;
    }
    seat = getSelfLockedSeats().find(
      (candidate) => candidate.ticketCode === code && candidate.status !== 'sold'
    );
  }
  if (!seat) {
    showStatus('未找到与票码匹配的锁定座位，请确认票码或先锁定座位。', true);
    return;
  }
  pendingIssue = { seatId: seatKey(seat.row, seat.col), ticketCode: code };
  showScanOverlayMessage('正在验证票码，请稍候...', { visible: true });
  issueSeat(pendingIssue.seatId, code);
});

if (manualCodeInput) manualCodeInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    btnManualConfirm.click();
  }
});

if (manualCodeInput) {
  manualCodeInput.addEventListener('focus', () => {
    issueScanPreference = 'manual';
    renderScanMethodsPanels();
  });
}

if (issueUploadFile) {
  issueUploadFile.addEventListener('click', () => {
    issueScanPreference = 'upload';
    renderScanMethodsPanels();
  });
  issueUploadFile.addEventListener('change', () => {
    issueScanPreference = 'upload';
    renderScanMethodsPanels();
  });
}

if (btnIssueUploadScan) {
  btnIssueUploadScan.addEventListener('click', async () => {
    issueScanPreference = 'upload';
    renderScanMethodsPanels();
    if (!pendingIssue) {
      showStatus('请先选择座位并点击“签发”，再上传二维码图片。', true);
      return;
    }
    const file = issueUploadFile?.files?.[0];
    if (!file) {
      showStatus('请选择二维码图片。', true);
      return;
    }
    showScanOverlayMessage('正在识别图片中的二维码...', { visible: true });
    const code = await decodeBarcodeFromImageFile(file);
    if (issueUploadFile) issueUploadFile.value = '';
    if (!code) {
      showStatus('未识别到二维码，请换一张更清晰的图片或使用手动输入。', true);
      showScanOverlayMessage('未识别到二维码，请重试或手动输入票码。', { visible: true });
      return;
    }
    manualCodeInput.value = code;
    handleScannedCode(code);
  });
}

if (btnAutoSelect) btnAutoSelect.addEventListener('click', async () => {
  if (!activeProject) {
    showStatus('请选择项目。', true);
    return;
  }
  const count = Number(autoSelectCount.value) || 1;
  const priceValue = autoSelectPrice.value;
  const priceFilter = priceValue === 'any' ? 'any' : priceValue === 'null' ? null : Number(priceValue);
  const candidate = findAutoSelection(priceFilter, count);
  if (!candidate || candidate.length !== count) {
    showStatus('未找到符合条件的连续座位。', true);
    return;
  }
  btnAutoSelect.disabled = true;
  const lockedIds = [];
  try {
    for (const seatId of candidate) {
      const resp = await emitAsync('lock-seat', { projectId: activeProject.id, seatId });
      if (!resp.ok) {
        throw new Error(resp.message || '自动选座失败');
      }
      lockedIds.push(seatId);
      const seatRef = activeProject.seats[seatId];
      if (seatRef) {
        seatRef.status = 'locked';
        seatRef.lockedBy = mySocketId;
        updateSeatElement(seatId);
      }
    }
    updateSelectedList();
    updateProjectOptionStats();
    updateZoneSummary();
    showStatus(`已自动锁定 ${lockedIds.length} 个座位，请完成签发。`);
  } catch (error) {
    showStatus(error.message, true);
    await Promise.all(
      lockedIds.map(async (seatId) => {
        await emitAsync('unlock-seat', { projectId: activeProject.id, seatId });
        const seatRef = activeProject.seats[seatId];
        if (seatRef) {
          seatRef.status = 'available';
          seatRef.lockedBy = null;
          updateSeatElement(seatId);
        }
      })
    );
    updateSelectedList();
    updateProjectOptionStats();
    updateZoneSummary();
  } finally {
    btnAutoSelect.disabled = false;
  }
});

if (btnClearSelected) {
  btnClearSelected.addEventListener('click', async () => {
    if (!activeProject) {
      showStatus('请选择项目后再操作。', true);
      return;
    }
    const seats = getSelfLockedSeats();
    if (!seats.length) {
      showStatus('当前没有已选座位。');
      return;
    }
    btnClearSelected.disabled = true;
    showStatus('正在释放已选座位，请稍候...');
    try {
      await Promise.all(
        seats.map((seat) =>
          emitAsync('unlock-seat', {
            projectId: activeProject.id,
            seatId: seatKey(seat.row, seat.col),
          })
        )
      );
      seats.forEach((seat) => {
        const seatId = seatKey(seat.row, seat.col);
        const seatRef = activeProject.seats[seatId];
        if (seatRef) {
          seatRef.status = 'available';
          seatRef.lockedBy = null;
          seatRef.lockExpiresAt = null;
          updateSeatElement(seatId);
        }
      });
      clearPendingIssue();
      updateSelectedList();
      updateProjectOptionStats();
      updateZoneSummary();
      showStatus('已释放所有选中座位。');
    } catch (error) {
      showStatus(error.message || '释放座位失败，请重试。', true);
      if (activeProject?.id) {
        await loadProject(activeProject.id).catch(() => {});
      }
    } finally {
      btnClearSelected.disabled = getSelfLockedSeats().length === 0;
    }
  });
}

if (btnTicketCheckout) {
  btnTicketCheckout.addEventListener('click', () => openTicketCheckout());
}

if (btnCancelTicketCheckout) {
  btnCancelTicketCheckout.addEventListener('click', () => closeDialog(dialogTicketCheckout));
}

if (ticketCheckoutForm) {
  ticketCheckoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitTicketCheckout();
  });
}

if (ticketUseCoupon) {
  ticketUseCoupon.addEventListener('change', () => {
    renderTicketCheckoutSummary();
    setTicketCheckoutStatus('');
  });
}

socket.on('connect', () => {
  mySocketId = socket.id;
  clearPendingIssue();
  if (activeProject) {
    Object.keys(activeProject.seats).forEach(updateSeatElement);
    updateSelectedList();
    updateZoneSummary();
    adjustStageLabel();
  }
});

socket.on('project:update', ({ projectId, project }) => {
  if (activeProject && projectId === activeProject.id) {
    activeProject = project;
    ensureActiveProjectMetadata();
    computePriceColorMap();
    Object.keys(activeProject.seats).forEach(updateSeatElement);
    updateSelectedList();
    updateProjectOptionStats(project);
    updateZoneSummary();
    adjustStageLabel();
    updateCheckinStats();
    renderCheckinSeatGrid();
    if (pendingIssue) {
      const seat = activeProject.seats[pendingIssue.seatId];
      if (!seat || seat.status !== 'locked' || seat.lockedBy !== mySocketId) {
        clearPendingIssue();
      }
    }
  } else {
    updateProjectOptionStats(project);
  }
});

const openPendingDb = () =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open('checkin-pending-db', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pending')) {
        db.createObjectStore('pending', { keyPath: 'ticketCode' });
      }
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });

const loadPendingCheckins = async () => {
  if (!window.indexedDB) return [];
  const db = await openPendingDb();
  return new Promise((resolve) => {
    const tx = db.transaction('pending', 'readonly');
    const store = tx.objectStore('pending');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
};

const savePendingCheckins = async (list) => {
  if (!window.indexedDB) return;
  const db = await openPendingDb();
  await new Promise((resolve) => {
    const tx = db.transaction('pending', 'readwrite');
    const store = tx.objectStore('pending');
    store.clear();
    list.forEach((item) => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
};

const addPendingCheckin = async (ticketCode, reason = '') => {
  const entry = {
    ticketCode,
    reason,
    lastTriedAt: Date.now(),
  };
  pendingCheckins = pendingCheckins.filter((p) => p.ticketCode !== ticketCode);
  pendingCheckins.push(entry);
  await savePendingCheckins(pendingCheckins);
  renderPendingCheckins();
};

const renderPendingCheckins = () => {
  if (!pendingCheckinList) return;
  pendingCheckinList.innerHTML = '';
  if (!pendingCheckins.length) {
    pendingCheckinList.innerHTML = '<li class="hint">暂无待重试记录。</li>';
    return;
  }
  pendingCheckins
    .slice()
    .sort((a, b) => b.lastTriedAt - a.lastTriedAt)
    .forEach((item) => {
      const li = document.createElement('li');
      li.className = 'selected-item';
      li.innerHTML = `
        <div class="selected-item__info">
          <strong>${item.ticketCode}</strong>
          <span class="hint">${item.reason || '待重试'} · ${new Date(item.lastTriedAt).toLocaleString()}</span>
        </div>
        <div class="selected-item__actions">
          <button class="button button--secondary" data-action="retry" data-code="${item.ticketCode}">重试</button>
          <button class="button button--danger" data-action="remove" data-code="${item.ticketCode}">删除</button>
        </div>
      `;
      pendingCheckinList.appendChild(li);
    });
};

const retryPending = async (codes) => {
  const ticketCodes = (codes && codes.length ? codes : pendingCheckins.map((p) => p.ticketCode)).filter(Boolean);
  if (!ticketCodes.length) return;
  try {
    const response = await authFetch(`/api/projects/${activeProject.id}/checkin/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketCodes, scannerId: mySocketId || 'scanner' }),
    });
    const data = await response.json().catch(() => ({}));
    const results = data.results || [];
    const failed = [];
    results.forEach((result) => {
      if (result.ok) {
        pendingCheckins = pendingCheckins.filter((p) => p.ticketCode !== result.ticketCode);
      } else {
        failed.push({
          ticketCode: result.ticketCode,
          reason: result.error || '检票失败',
          lastTriedAt: Date.now(),
        });
      }
    });
    pendingCheckins = [
      ...pendingCheckins.filter((p) => !ticketCodes.includes(p.ticketCode)),
      ...failed,
    ];
    await savePendingCheckins(pendingCheckins);
    renderPendingCheckins();
    if (failed.length) {
      setCheckinResult(`重试完成，失败 ${failed.length} 条。`, 'error');
    } else {
      setCheckinResult('重试完成，全部成功。', 'success');
    }
    updateCheckinStats();
    renderCheckinSeatGrid();
  } catch (error) {
    setCheckinResult(error.message || '重试失败', 'error');
  }
};
if (btnLogout) btnLogout.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore
  }
  window.location.href = '/login.html?role=sales';
});

if (btnHome) btnHome.addEventListener('click', () => {
  window.location.href = '/';
});

if (btnRefreshMerchSales) {
  btnRefreshMerchSales.addEventListener('click', () => {
    fetchMerchData();
  });
}

if (btnStartCheckin) {
  btnStartCheckin.addEventListener('click', () => {
    checkinScanPreference = 'camera';
    renderScanMethodsPanels();
    startCheckinScanner();
  });
}

if (btnStopCheckin) {
  btnStopCheckin.addEventListener('click', () => {
    stopCheckinScanner();
    setCheckinResult('已停止检票。', null);
  });
}

if (btnSubmitCheckin) {
  btnSubmitCheckin.addEventListener('click', () => submitCheckin());
}

if (btnCheckinUploadScan) {
  btnCheckinUploadScan.addEventListener('click', async () => {
    checkinScanPreference = 'upload';
    renderScanMethodsPanels();
    if (!activeProject) {
      setCheckinResult('请选择项目后再检票。', 'error');
      return;
    }
    const file = checkinUploadFile?.files?.[0];
    if (!file) {
      setCheckinResult('请选择二维码图片。', 'error');
      return;
    }
    setCheckinOverlay('正在识别图片中的二维码...', true);
    setCheckinResult('正在识别二维码...', 'notice');
    const code = await decodeBarcodeFromImageFile(file);
    if (checkinUploadFile) checkinUploadFile.value = '';
    if (!code) {
      setCheckinOverlay('未识别到二维码，请改用手动输入。', true);
      setCheckinResult('未识别到二维码，请换一张更清晰的图片或手动输入。', 'error');
      return;
    }
    if (inputCheckinCode) inputCheckinCode.value = code;
    submitCheckin(code);
  });
}

if (inputCheckinCode) {
  inputCheckinCode.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitCheckin();
    }
  });
}

if (inputCheckinCode) {
  inputCheckinCode.addEventListener('focus', () => {
    checkinScanPreference = 'manual';
    renderScanMethodsPanels();
  });
}

if (checkinUploadFile) {
  checkinUploadFile.addEventListener('click', () => {
    checkinScanPreference = 'upload';
    renderScanMethodsPanels();
  });
  checkinUploadFile.addEventListener('change', () => {
    checkinScanPreference = 'upload';
    renderScanMethodsPanels();
  });
}

if (btnRefreshCheckin) {
  btnRefreshCheckin.addEventListener('click', () => {
    refreshActiveProject();
  });
}

if (pendingCheckinList) {
  pendingCheckinList.addEventListener('click', async (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    const code = btn.dataset.code;
    if (!code) return;
    if (btn.dataset.action === 'retry') {
      await retryPending([code]);
    } else if (btn.dataset.action === 'remove') {
      pendingCheckins = pendingCheckins.filter((p) => p.ticketCode !== code);
      await savePendingCheckins(pendingCheckins);
      renderPendingCheckins();
    }
  });
}

if (btnRetryPending) {
  btnRetryPending.addEventListener('click', () => retryPending());
}

if (btnClearPending) {
  btnClearPending.addEventListener('click', async () => {
    pendingCheckins = [];
    await savePendingCheckins(pendingCheckins);
    renderPendingCheckins();
  });
}

if (merchProductsContainer) {
  merchProductsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="add-merch"]');
    if (!button) return;
    addProductToCart(button.dataset.id);
  });
}

if (merchCartList) {
  merchCartList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const li = button.closest('li');
    if (!li) return;
    const productId = li.dataset.id;
    if (!productId) return;
    if (button.dataset.action === 'inc') {
      addProductToCart(productId);
    } else if (button.dataset.action === 'dec') {
      updateCartQuantity(productId, -1);
    } else if (button.dataset.action === 'remove') {
      removeCartItem(productId);
    }
  });
}

if (merchCheckoutModeSelect) {
  merchCheckoutModeSelect.addEventListener('change', () => {
    renderMerchCart();
  });
}

if (merchPaymentSelect) {
  populatePaymentOptions();
}

const updateMerchFulfillmentUi = () => {
  const type = merchFulfillmentSelect?.value || 'stock';
  const presale = type === 'presale';
  if (merchPresalePanel) merchPresalePanel.hidden = !presale;
  if (btnSubmitMerchOrder) btnSubmitMerchOrder.textContent = presale ? '签发预购券（预售）' : '提交文创订单';
};

const renderVoucherInfo = (voucher) => {
  if (!voucher) {
    setRedeemInfo('暂无预购券信息。');
    if (btnRedeemVoucher) btnRedeemVoucher.disabled = true;
    return;
  }
  const lines = [];
  lines.push(`预购券：${voucher.code}`);
  const statusLabel =
    voucher.status === 'redeemed'
      ? '已核销'
      : voucher.status === 'issued'
        ? '未核销'
        : voucher.status === 'replaced'
          ? '已换码'
          : voucher.status === 'voided'
            ? '已作废'
            : voucher.status === 'refunded'
              ? '已退款'
              : voucher.status || '未知';
  lines.push(`状态：${statusLabel}`);
  if (voucher.replacedBy) lines.push(`新券码：${voucher.replacedBy}`);
  if (voucher.createdAt) lines.push(`签发时间：${new Date(voucher.createdAt).toLocaleString()}`);
  if (voucher.createdBy) lines.push(`签发人：${voucher.createdBy}`);
  if (voucher.redeemedAt) lines.push(`核销时间：${new Date(voucher.redeemedAt).toLocaleString()}`);
  if (voucher.redeemedBy) lines.push(`核销人：${voucher.redeemedBy}`);
  const items = Array.isArray(voucher.items) ? voucher.items : [];
  if (items.length) {
    lines.push('商品：');
    items.slice(0, 10).forEach((it) => {
      lines.push(`- ${it.name} ×${it.quantity}  单价¥${Number(it.unitPrice).toFixed(2)}`);
    });
    if (items.length > 10) lines.push('...更多商品未显示');
  }
  lines.push(`应付：¥${Number(voucher.totalAfter ?? 0).toFixed(2)}`);
  setRedeemInfo(lines.join('\n'));
  if (btnRedeemVoucher) btnRedeemVoucher.disabled = voucher.status !== 'issued';
};

const lookupVoucher = async () => {
  const code = (inputRedeemCode?.value || '').trim();
  if (!code) {
    setRedeemInfo('请输入预购券码。', true);
    return;
  }
  setRedeemInfo('正在查询...');
  if (btnRedeemVoucher) btnRedeemVoucher.disabled = true;
  try {
    const resp = await authFetch(`/api/merch/vouchers/${encodeURIComponent(code)}`);
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || '查询失败');
    renderVoucherInfo(data.voucher);
  } catch (error) {
    setRedeemInfo(error.message || '查询失败', true);
  }
};

const redeemVoucher = async () => {
  const code = (inputRedeemCode?.value || '').trim();
  if (!code) {
    setRedeemInfo('请输入预购券码。', true);
    return;
  }
  setRedeemInfo('正在核销...');
  if (btnRedeemVoucher) btnRedeemVoucher.disabled = true;
  try {
    const resp = await authFetch(`/api/merch/vouchers/${encodeURIComponent(code)}/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      if (resp.status === 409 && data.code === 'VOUCHER_REPLACED' && data.replacedBy) {
        throw new Error(`该预购券已换码，请使用新券码：${data.replacedBy}`);
      }
      if (resp.status === 409 && data.code === 'OUT_OF_STOCK') {
        const shortages = Array.isArray(data.shortages) ? data.shortages : [];
        const detail = shortages.length
          ? shortages
              .slice(0, 5)
              .map((s) => `${s.name}（需 ${s.requested}，余 ${s.stock}）`)
              .join('；')
          : '';
        throw new Error(`库存不足，无法核销：${detail || ''}`);
      }
      throw new Error(data.error || '核销失败');
    }
    renderVoucherInfo(data.voucher);
    setRedeemInfo('核销成功，库存已扣减。');
    await fetchMerchData();
  } catch (error) {
    setRedeemInfo(error.message || '核销失败', true);
  }
};

if (btnSubmitMerchOrder) {
  btnSubmitMerchOrder.addEventListener('click', async () => {
    if (!merchCart.length) {
      setMerchStatus('购物车为空。', true);
      return;
    }
    const fulfillmentType = merchFulfillmentSelect?.value || 'stock';
    const isPresale = fulfillmentType === 'presale';
    const presaleCode = (inputPresaleCode?.value || '').trim();
    if (isPresale && !presaleCode) {
      setMerchStatus('预售订单需要扫描/输入预购券条码。', true);
      return;
    }
    const paymentMethod = merchPaymentSelect?.value || MERCH_PAYMENT_OPTIONS[0];
    const payload = {
      items: merchCart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      checkoutModeId: merchCheckoutModeSelect?.value || null,
      note: merchNoteInput?.value?.trim() || '',
      paymentMethod,
      orderType: isPresale ? 'presale' : 'stock',
      voucherCode: isPresale ? presaleCode : null,
    };
    await submitMerchOrder(payload, false);
  });
}

if (merchFulfillmentSelect) {
  merchFulfillmentSelect.addEventListener('change', updateMerchFulfillmentUi);
  updateMerchFulfillmentUi();
}

if (btnScanPresaleCode && inputPresaleCode) {
  btnScanPresaleCode.addEventListener('click', () => {
    openVoucherDialog({ title: '预购券扫码（用于预售签发）', targetInput: inputPresaleCode, mode: 'presale' });
  });
}

if (btnScanRedeemCode && inputRedeemCode) {
  btnScanRedeemCode.addEventListener('click', () => {
    openVoucherDialog({ title: '预购券扫码（用于核销）', targetInput: inputRedeemCode, mode: 'redeem' });
  });
}

if (btnScanTicketCoupon && inputTicketCoupon) {
  btnScanTicketCoupon.addEventListener('click', () => {
    openVoucherDialog({ title: '优惠券扫码（用于售票）', targetInput: inputTicketCoupon, mode: 'ticket-coupon' });
  });
}

if (btnLookupTicketCoupon) btnLookupTicketCoupon.addEventListener('click', lookupTicketCoupon);
if (btnRedeemTicketCoupon) btnRedeemTicketCoupon.addEventListener('click', redeemTicketCoupon);
if (btnClearTicketCoupon) btnClearTicketCoupon.addEventListener('click', clearTicketCoupon);
if (inputTicketCoupon) {
  inputTicketCoupon.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      lookupTicketCoupon();
    }
  });
}

if (btnLookupVoucher) btnLookupVoucher.addEventListener('click', lookupVoucher);
if (btnRedeemVoucher) btnRedeemVoucher.addEventListener('click', redeemVoucher);
if (inputRedeemCode) {
  inputRedeemCode.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      lookupVoucher();
    }
  });
}

if (btnVoucherScanStart) {
  btnVoucherScanStart.addEventListener('click', () => {
    voucherScanPreference = 'camera';
    renderScanMethodsPanels();
    startVoucherScan();
  });
}
if (btnVoucherScanStop) btnVoucherScanStop.addEventListener('click', stopVoucherScan);
if (btnVoucherClose) {
  btnVoucherClose.addEventListener('click', () => {
    stopVoucherScan();
    closeVoucherDialog();
  });
}
if (btnVoucherUse && voucherScanManual) {
  btnVoucherUse.addEventListener('click', () => applyVoucherCode(voucherScanManual.value));
}
if (voucherScanManual) {
  voucherScanManual.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyVoucherCode(voucherScanManual.value);
    }
  });
}
if (voucherScanManual) {
  voucherScanManual.addEventListener('focus', () => {
    voucherScanPreference = 'manual';
    renderScanMethodsPanels();
  });
}
if (btnVoucherUploadScan) {
  btnVoucherUploadScan.addEventListener('click', async () => {
    voucherScanPreference = 'upload';
    renderScanMethodsPanels();
    const file = voucherScanUploadFile?.files?.[0];
    if (!file) {
      setVoucherOverlay('请选择条码图片。');
      return;
    }
    setVoucherOverlay('正在识别图片中的条码...');
    const code = await decodeBarcodeFromImageFile(file);
    if (voucherScanUploadFile) voucherScanUploadFile.value = '';
    if (!code) {
      setVoucherOverlay('未识别到条码，请换一张更清晰的图片或手动输入。');
      return;
    }
    applyVoucherCode(code);
  });
}

if (voucherScanUploadFile) {
  voucherScanUploadFile.addEventListener('click', () => {
    voucherScanPreference = 'upload';
    renderScanMethodsPanels();
  });
  voucherScanUploadFile.addEventListener('change', () => {
    voucherScanPreference = 'upload';
    renderScanMethodsPanels();
  });
}

window.addEventListener('beforeunload', () => {
  clearPendingIssue();
  clearSeatLockQueue();
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }
  stopCheckinScanner();
  stopVoucherScan();
});

switchModule('sales');
renderMerchCart();
fetchProjects();
fetchMerchData();
