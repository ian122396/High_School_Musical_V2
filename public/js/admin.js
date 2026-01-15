/* global io */

const projectListEl = document.getElementById('project-list');
const seatCanvas = document.getElementById('seat-canvas');
const inputProjectName = document.getElementById('input-project-name');
const selectedCountEl = document.getElementById('selected-count');
const priceInput = document.getElementById('input-seat-price');
const btnApplyPrice = document.getElementById('btn-apply-price');
const btnDisableSeats = document.getElementById('btn-disable-seats');
const btnResetSelection = document.getElementById('btn-reset-selection');
const btnSaveProject = document.getElementById('btn-save-project');
const btnDeleteProject = document.getElementById('btn-delete-project');
const btnNewProject = document.getElementById('btn-new-project');
const btnLogout = document.getElementById('btn-logout');
const btnBackHome = document.getElementById('btn-back-home');
const statusEl = document.getElementById('admin-status');
const priceLegendList = document.getElementById('price-legend-list');
const workspaceHint = document.getElementById('workspace-hint');
const zoneSummaryList = document.getElementById('zone-summary-list');
const selectTicketingMode = document.getElementById('select-ticketing-mode');
const sequenceConfigSection = document.getElementById('ticketing-sequence-config');
const inputTicketTemplate = document.getElementById('input-ticket-template');
const inputTicketStart = document.getElementById('input-ticket-start');
const btnApplyTicketing = document.getElementById('btn-apply-ticketing');
const btnRegenerateTicketing = document.getElementById('btn-regenerate-ticketing');
const btnCancelTicketing = document.getElementById('btn-cancel-ticketing');
const ticketingStatusEl = document.getElementById('ticketing-status');
const seatTableBody = document.querySelector('#seat-ticket-table tbody');
const seatTableStatus = document.getElementById('seat-table-status');
const btnRefreshSeatTable = document.getElementById('btn-refresh-seat-table');
const btnExportSeatTable = document.getElementById('btn-export-seat-table');
const inlineCheckinTable = document.querySelector('#inline-checkin-table tbody');
const inlineCheckinStatus = document.getElementById('inline-checkin-status');
const btnRefreshInlineCheckins = document.getElementById('btn-refresh-inline-checkins');
const seatTableSearchInput = document.getElementById('input-seat-search');
const btnExportProject = document.getElementById('btn-export-project');
const btnDownloadProjectTemplate = document.getElementById('btn-download-project-template');
const btnImportProject = document.getElementById('btn-import-project');
const inputImportFile = document.getElementById('input-import-file');
const accountForm = document.getElementById('account-form');
const accountUsernameInput = document.getElementById('input-account-username');
const accountPasswordInput = document.getElementById('input-account-password');
const accountRoleSelect = document.getElementById('select-account-role');
const accountTableBody = document.querySelector('#account-table tbody');
const accountStatusEl = document.getElementById('account-status');
const adminTabs = document.querySelectorAll('.admin-tab');
const adminViews = document.querySelectorAll('.admin-view');
const btnSyncProject = document.getElementById('btn-sync-project');
const merchProductForm = document.getElementById('merch-product-form');
const merchFormStatus = document.getElementById('merch-form-status');
const merchProductListEl = document.getElementById('merch-product-list');
const inputMerchId = document.getElementById('input-merch-id');
const inputMerchName = document.getElementById('input-merch-name');
const inputMerchPrice = document.getElementById('input-merch-price');
const inputMerchStock = document.getElementById('input-merch-stock');
const inputMerchDescription = document.getElementById('input-merch-description');
const inputMerchImage = document.getElementById('input-merch-image');
const btnResetMerchForm = document.getElementById('btn-reset-merch-form');
const btnRefreshMerch = document.getElementById('btn-refresh-merch');
const btnRefreshPresaleSummary = document.getElementById('btn-refresh-presale-summary');
const presaleSummaryTableBody = document.querySelector('#presale-summary-table tbody');
const presaleSummaryStatus = document.getElementById('presale-summary-status');
const btnGoCheckoutModes = document.getElementById('btn-go-checkout-modes');
const checkoutModeForm = document.getElementById('checkout-mode-form');
const modeFormStatus = document.getElementById('mode-form-status');
const inputModeId = document.getElementById('input-mode-id');
const inputModeName = document.getElementById('input-mode-name');
const selectModeType = document.getElementById('select-mode-type');
const inputModeDiscount = document.getElementById('input-mode-discount');
const inputModeThreshold = document.getElementById('input-mode-threshold');
const inputModeCut = document.getElementById('input-mode-cut');
const inputModeStack = document.getElementById('input-mode-stack');
const inputModeDescription = document.getElementById('input-mode-description');
const btnResetModeForm = document.getElementById('btn-reset-mode-form');
const checkoutModeTableBody = document.querySelector('#checkout-mode-table tbody');
const merchOrdersTableBody = document.querySelector('#merch-orders-table tbody');
const btnRefreshOrders = document.getElementById('btn-refresh-orders');
const btnNewOrder = document.getElementById('btn-new-order');
const btnExportOrdersMenu = document.getElementById('btn-export-orders-menu');
const exportOrdersMenu = document.getElementById('export-orders-menu');
const btnExportOrders = document.getElementById('btn-export-orders');
const btnExportOrdersCsv = document.getElementById('btn-export-orders-csv');
const btnExportOrdersXls = document.getElementById('btn-export-orders-xls');
const btnExportOrdersPdf = document.getElementById('btn-export-orders-pdf');
const btnDownloadOrdersTemplate = document.getElementById('btn-download-orders-template');
const btnImportOrders = document.getElementById('btn-import-orders');
const inputImportOrders = document.getElementById('input-import-orders');
const btnClearOrders = document.getElementById('btn-clear-orders');
const ordersSelectAll = document.getElementById('orders-select-all');
const auditTableBody = document.querySelector('#audit-table tbody');
const btnRefreshAudit = document.getElementById('btn-refresh-audit');
const btnExportAudit = document.getElementById('btn-export-audit');
const backupTableBody = document.querySelector('#backup-table tbody');
const btnRefreshBackups = document.getElementById('btn-refresh-backups');
const inputOrdersSince = document.getElementById('input-orders-since');
const inputOrdersUntil = document.getElementById('input-orders-until');
const inputOrdersHandler = document.getElementById('input-orders-handler');
const selectOrdersMode = document.getElementById('select-orders-mode');
const inputOrdersKeyword = document.getElementById('input-orders-keyword');
const btnApplyOrdersFilter = document.getElementById('btn-apply-orders-filter');
const btnOrdersPrev = document.getElementById('btn-orders-prev');
const btnOrdersNext = document.getElementById('btn-orders-next');
const ordersPageInfo = document.getElementById('orders-page-info');
const btnCheckinPrev = document.getElementById('btn-checkin-prev');
const btnCheckinNext = document.getElementById('btn-checkin-next');
const checkinPageInfo = document.getElementById('checkin-page-info');
const btnAuditPrev = document.getElementById('btn-audit-prev');
const btnAuditNext = document.getElementById('btn-audit-next');
const auditPageInfo = document.getElementById('audit-page-info');
const btnSeatPrev = document.getElementById('btn-seat-prev');
const btnSeatNext = document.getElementById('btn-seat-next');
const seatPageInfo = document.getElementById('seat-page-info');
const btnExportSeatsCsv = document.getElementById('btn-export-seats-csv');
const btnExportSeatsPng = document.getElementById('btn-export-seats-png');
const btnExportSeatsJson = document.getElementById('btn-export-seats-json');
const btnExportProjectMenu = document.getElementById('btn-export-project-menu');
const exportProjectMenu = document.getElementById('export-project-menu');
const dialogSeatDetail = document.getElementById('dialog-seat-detail');
const seatDetailBody = document.getElementById('seat-detail-body');
const btnSaveAll = document.getElementById('btn-save-all');
const btnUndoMenu = document.getElementById('btn-seat-undo-menu');
const undoMenu = document.getElementById('seat-undo-menu');
const btnUndoLast = document.getElementById('btn-undo-last');
const btnUndoAll = document.getElementById('btn-undo-all');

const pendingSeatChanges = [];
const PROJECT_IMPORT_TEMPLATE = {
  project: {
    id: '项目ID可留空',
    name: '示例项目',
    rows: 2,
    cols: 3,
    seats: {
      'r0-c0': { row: 0, col: 0, status: 'available', price: 100, seatLabel: '1排1号' },
      'r0-c1': { row: 0, col: 1, status: 'locked', price: 120, seatLabel: '1排2号' },
      'r1-c0': {
        row: 1,
        col: 0,
        status: 'sold',
        price: 150,
        seatLabel: '2排1号',
        ticketNumber: 'T0001',
        issuedAt: Date.now(),
        checkedInAt: null,
      },
    },
  },
};

const ORDERS_IMPORT_TEMPLATE = {
  orders: [
    {
      items: [{ productId: '商品ID', name: '示例商品', quantity: 1, unitPrice: 19.9 }],
      checkoutModeId: 'b57171c5-85ad-4154-ad8e-f3ccc20b931d',
      paymentMethod: '现金（人民币）',
      handledBy: 'admin',
      note: '备注',
      createdAt: Date.now(),
    },
  ],
};
const inputBatchPrice = document.getElementById('input-batch-price');
const inputBatchRowStart = document.getElementById('input-batch-row-start');
const inputBatchRowEnd = document.getElementById('input-batch-row-end');
const selectBatchStatus = document.getElementById('select-batch-status');
const btnApplyBatchStatus = document.getElementById('btn-apply-batch-status');
const merchOrderForm = document.getElementById('merch-order-form');
const inputOrderId = document.getElementById('input-order-id');
const inputOrderItems = document.getElementById('input-order-items');
const selectOrderCheckoutMode = document.getElementById('select-order-checkout-mode');
const inputOrderHandler = document.getElementById('input-order-handler');
const inputOrderNote = document.getElementById('input-order-note');
const inputOrderTime = document.getElementById('input-order-time');
const btnResetOrderForm = document.getElementById('btn-reset-order-form');
const orderFormStatus = document.getElementById('order-form-status');
const btnOpenMerchForm = document.getElementById('btn-open-merch-form');
const btnOpenModeForm = document.getElementById('btn-open-mode-form');
const dialogMerchProduct = document.getElementById('dialog-merch-product');
const dialogModeForm = document.getElementById('dialog-mode-form');
const dialogOrderForm = document.getElementById('dialog-order-form');
const btnOpenTicketCoupons = document.getElementById('btn-open-ticket-coupons');
const dialogTicketCoupons = document.getElementById('dialog-ticket-coupons');
const btnNewTicketRule = document.getElementById('btn-new-ticket-rule');
const ticketRuleTableBody = document.querySelector('#ticket-rule-table tbody');
const ticketRuleStatus = document.getElementById('ticket-rule-status');
const selectTicketRule = document.getElementById('select-ticket-rule');
const inputTicketCouponQuantity = document.getElementById('input-ticket-coupon-quantity');
const inputTicketCouponCodes = document.getElementById('input-ticket-coupon-codes');
const btnIssueTicketCoupons = document.getElementById('btn-issue-ticket-coupons');
const inputTicketCouponSearch = document.getElementById('input-ticket-coupon-search');
const selectTicketCouponStatus = document.getElementById('select-ticket-coupon-status');
const btnRefreshTicketCoupons = document.getElementById('btn-refresh-ticket-coupons');
const ticketCouponTableBody = document.querySelector('#ticket-coupon-table tbody');
const ticketCouponStatus = document.getElementById('ticket-coupon-status');
const dialogTicketRuleForm = document.getElementById('dialog-ticket-rule-form');
const ticketRuleForm = document.getElementById('ticket-rule-form');
const inputTicketRuleId = document.getElementById('input-ticket-rule-id');
const inputTicketRuleName = document.getElementById('input-ticket-rule-name');
const inputTicketRuleCount = document.getElementById('input-ticket-rule-count');
const inputTicketRuleDiscount = document.getElementById('input-ticket-rule-discount');
const inputTicketRulePrices = document.getElementById('input-ticket-rule-prices');
const selectTicketRuleEnabled = document.getElementById('select-ticket-rule-enabled');
const ticketRuleFormStatus = document.getElementById('ticket-rule-form-status');
const dialogVoucherAdmin = document.getElementById('dialog-voucher-admin');
const voucherAdminInfo = document.getElementById('voucher-admin-info');
const inputVoucherNewCode = document.getElementById('input-voucher-new-code');
const inputVoucherReason = document.getElementById('input-voucher-reason');
const inputVoucherConfirm = document.getElementById('input-voucher-confirm');
const btnVoucherReplace = document.getElementById('btn-voucher-replace');
const btnVoucherUndoRedeem = document.getElementById('btn-voucher-undo-redeem');
const btnVoucherVoid = document.getElementById('btn-voucher-void');
const btnVoucherRefund = document.getElementById('btn-voucher-refund');
const voucherAdminStatus = document.getElementById('voucher-admin-status');
const selectCheckinProject = document.getElementById('select-checkin-project');
const btnRefreshCheckins = document.getElementById('btn-refresh-checkins');
const btnExportCheckins = document.getElementById('btn-export-checkins');
const checkinLogTable = document.getElementById('checkin-log-table');
const checkinLogStatus = document.getElementById('checkin-log-status');
const checkinSeatForm = document.getElementById('checkin-seat-form');
const inputCheckinTicket = document.getElementById('input-checkin-ticket');
const selectCheckinStatus = document.getElementById('select-checkin-status');
const checkinSeatStatus = document.getElementById('checkin-seat-status');

const dialogNewProject = document.getElementById('dialog-new-project');
const btnCreateProject = document.getElementById('btn-create-project');
const newProjectNameInput = document.getElementById('new-project-name');
const newProjectRowsInput = document.getElementById('new-project-rows');
const newProjectColsInput = document.getElementById('new-project-cols');
const newProjectStatus = document.getElementById('new-project-status');
const btnCancelNewProject = dialogNewProject.querySelector('button[value="cancel"]');
const newProjectTicketingMode = document.getElementById('new-project-ticketing-mode');
const newProjectSequenceSection = document.getElementById('new-project-sequence');
const newProjectTicketTemplate = document.getElementById('new-project-ticket-template');
const newProjectTicketStart = document.getElementById('new-project-ticket-start');

const projectItemTemplate = document.getElementById('project-item-template');

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

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f2f4f8" rx="16"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2399a5c2" font-size="24">No Image</text></svg>';
const MAX_MERCH_IMAGE_BYTES = 10 * 1024 * 1024;
const MERCH_REFRESH_INTERVAL_MS = 15000;

const socket = io({ withCredentials: true, transports: ['websocket', 'polling'] });

let projects = [];
let activeProject = null;
let seatElements = new Map();
let seatGridElement = null;
let seatGridSignature = null;
let selectedSeats = new Set();
let modifiedSeats = new Map();
let priceColorMap = new Map();
let priceChipStyleEl = null;
const priceChipClassCache = new Map();
const ensurePriceChipClass = (color) => {
  const normalized = String(color || '').trim();
  if (!normalized) return '';
  if (priceChipClassCache.has(normalized)) return priceChipClassCache.get(normalized);

  const key = normalized.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24) || 'default';
  const cls = `price-chip--${key}`;
  priceChipClassCache.set(normalized, cls);

  if (!priceChipStyleEl) {
    priceChipStyleEl = document.getElementById('price-chip-style');
    if (!priceChipStyleEl) {
      priceChipStyleEl = document.createElement('style');
      priceChipStyleEl.id = 'price-chip-style';
      document.head.appendChild(priceChipStyleEl);
    }
  }
  if (!priceChipStyleEl.dataset.keys) priceChipStyleEl.dataset.keys = '';
  const keys = priceChipStyleEl.dataset.keys.split(',').filter(Boolean);
  if (!keys.includes(key)) {
    priceChipStyleEl.textContent += `\n.${cls}{--chip-color:${normalized};}`;
    keys.push(key);
    priceChipStyleEl.dataset.keys = keys.join(',');
  }

  return cls;
};
let isDragging = false;
let dragOrigin = null;
let dragSelectionBase = new Set();
let dragMoved = false;
let pointerDownSeatId = null;
let pointerDownWasSelected = false;
let accounts = [];
let seatTableSearchQuery = '';
let activeView = 'seats';
let projectAutoSyncTimer = null;
let projectSyncInFlight = false;
let ticketingDirty = false;
let ticketingSnapshot = null;
let autoSaveTimer = null;
let isSavingProject = false;
let merchProducts = [];
let checkoutModes = [];
let merchOrders = [];
let merchPresaleSummary = [];
let activeVoucherAdminCode = '';
let activeVoucherAdminVoucher = null;
let ticketDiscountRules = [];
let ticketCoupons = [];
let selectedOrderIds = new Set();
let ordersTotal = 0;
let ordersPage = 1;
const ORDERS_PAGE_SIZE = 50;
let editingOrderId = null;
let checkinLogs = [];
let checkinPage = 1;
let checkinTotal = 0;
const CHECKIN_PAGE_SIZE = 50;
let auditLogs = [];
let auditPage = 1;
let auditTotal = 0;
const AUDIT_PAGE_SIZE = 50;
let seatPage = 1;
let seatTotal = 0;
const SEAT_PAGE_SIZE = 100;
let merchAutoRefreshTimer = null;
let merchRefreshInFlight = false;
let batchRowStart = null;
let batchRowEnd = null;
let batchPrices = [];

const AUTO_SAVE_DELAY = 2200;

const PROJECT_AUTO_SYNC_MS = 12 * 1000;

const ACCOUNT_ROLE_LABELS = {
  admin: '管理员',
  sales: '售票员',
};

const SEAT_STATUS_LABELS = {
  available: '空闲',
  locked: '锁定',
  sold: '已签发',
  disabled: '禁用',
};
const SEAT_VIEW_STATUS_LABELS = {
  available: '空闲',
  locked: '锁定',
  sold: '已售(未检票)',
  checked: '已售(已检票)',
  disabled: '禁用',
};

const redirectToLogin = () => {
  window.location.href = '/login.html?role=admin';
};

const resetSeatCheckinState = (seat) => {
  if (!seat) return;
  seat.checkedInAt = null;
  seat.checkedInBy = null;
};

const authFetch = async (input, init = {}) => {
  const finalInit = { ...init, credentials: 'same-origin' };
  if (init && init.headers) {
    finalInit.headers = init.headers;
  }
  const response = await fetch(input, finalInit);
  if (response.status === 401 || response.status === 403) {
    redirectToLogin();
    throw new Error('会话已过期，请重新登录。');
  }
  return response;
};

const requestJson = async (input, init = {}) => {
  const response = await authFetch(input, init);
  const data = await response.json().catch(() => ({}));
  return { response, data };
};

const dangerousJsonRequest = async (input, init = {}, { actionLabel = '' } = {}) => {
  const normalizeBody = (body) => {
    if (!body) return {};
    if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch {
        return {};
      }
    }
    if (typeof body === 'object') return { ...body };
    return {};
  };

  const run = async (confirmToken) => {
    const headers = { ...(init.headers || {}) };
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    const bodyObj = normalizeBody(init.body);
    if (confirmToken) bodyObj.confirmToken = confirmToken;
    return requestJson(input, { ...init, headers, body: JSON.stringify(bodyObj) });
  };

  let { response, data } = await run(null);
  if (response.status === 409 && data && data.code === 'CONFIRM_REQUIRED') {
    const detail = data.detail || actionLabel || data.action || '危险操作';
    const expiresAt = data.expiresAt ? new Date(data.expiresAt).toLocaleTimeString() : '';
    const first = window.confirm(
      `需要二次确认：\n${detail}\n\n系统将自动创建备份，操作完成后可点击“撤销”恢复。\n${
        expiresAt ? `确认有效期至：${expiresAt}\n` : ''
      }\n是否继续？`
    );
    if (!first) {
      throw new Error('已取消操作');
    }
    const second = window.confirm('请再次确认：该操作会覆盖/删除重要数据。');
    if (!second) {
      throw new Error('已取消操作');
    }
    ({ response, data } = await run(data.confirmToken));
  }
  if (!response.ok) {
    throw new Error(data?.error || '操作失败');
  }
  return data;
};

const ensureActiveProjectMetadata = () => {
  if (!activeProject) return;
  if (!activeProject.priceColorAssignments || typeof activeProject.priceColorAssignments !== 'object') {
    activeProject.priceColorAssignments = {};
  }
  if (!activeProject.seatLabelProgress || typeof activeProject.seatLabelProgress !== 'object') {
    activeProject.seatLabelProgress = {};
  }
};

const ensureLocalPriceColor = (price) => {
  if (price == null || !activeProject) return null;
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

const captureTicketingSnapshot = () => {
  if (!activeProject || !activeProject.ticketing) {
    ticketingSnapshot = {
      mode: 'random',
      template: '',
      start: '',
    };
    return;
  }
  const mode = activeProject.ticketing.mode || 'random';
  let template = '';
  let start = '';
  if (mode === 'sequence' && activeProject.ticketing.sequence) {
    template = (activeProject.ticketing.sequence.template || '').toUpperCase();
    start =
      activeProject.ticketing.sequence.startString ||
      String(activeProject.ticketing.sequence.startValue || '').padStart(
        activeProject.ticketing.sequence.width || 0,
        '0'
      );
  }
  ticketingSnapshot = { mode, template, start };
};

const applySnapshotToTicketingInputs = () => {
  if (!ticketingSnapshot) {
    selectTicketingMode.value = 'random';
    inputTicketTemplate.value = '';
    inputTicketStart.value = '';
    return;
  }
  selectTicketingMode.value = ticketingSnapshot.mode;
  inputTicketTemplate.value = ticketingSnapshot.template;
  inputTicketStart.value = ticketingSnapshot.start;
  if (ticketingSnapshot.mode === 'sequence') {
    sequenceConfigSection.classList.remove('hidden');
  } else {
    sequenceConfigSection.classList.add('hidden');
  }
};

const setTicketingDirty = (dirty) => {
  ticketingDirty = dirty;
  if (btnApplyTicketing) {
    btnApplyTicketing.disabled = !dirty;
  }
  if (btnCancelTicketing) {
    btnCancelTicketing.disabled = !dirty;
  }
};

const getCurrentTicketingForm = () => ({
  mode: selectTicketingMode.value,
  template: inputTicketTemplate.value.trim(),
  start: inputTicketStart.value.trim(),
});

const evaluateTicketingDirty = () => {
  if (!ticketingSnapshot) {
    setTicketingDirty(Boolean(activeProject));
    return;
  }
  const current = getCurrentTicketingForm();
  const normalizedCurrent = {
    mode: current.mode,
    template: current.mode === 'sequence' ? current.template.toUpperCase() : '',
    start: current.mode === 'sequence' ? current.start : '',
  };
  const normalizedSnapshot = {
    mode: ticketingSnapshot.mode,
    template: ticketingSnapshot.mode === 'sequence' ? ticketingSnapshot.template : '',
    start: ticketingSnapshot.mode === 'sequence' ? ticketingSnapshot.start : '',
  };
  const dirty =
    normalizedCurrent.mode !== normalizedSnapshot.mode ||
    normalizedCurrent.template !== normalizedSnapshot.template ||
    normalizedCurrent.start !== normalizedSnapshot.start;
  setTicketingDirty(dirty);
};

const updateActiveView = (view) => {
  if (!view) return;
  if (view === activeView) {
    if (view === 'merch' && !merchAutoRefreshTimer) {
      startMerchAutoRefresh();
    }
    return;
  }
  if (activeView === 'merch' && view !== 'merch') {
    stopMerchAutoRefresh();
  }
  activeView = view;
  adminTabs.forEach((tab) => {
    const isActive = tab.dataset.view === view;
    tab.classList.toggle('admin-tab--active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });
  adminViews.forEach((section) => {
    const matches = section.dataset.view === view;
    section.toggleAttribute('hidden', !matches);
    section.classList.toggle('admin-view--active', matches);
  });
  if (view === 'accounts') {
    setAccountStatus('');
    fetchAccounts();
  } else if (view === 'merch') {
    setMerchFormStatus('');
    setModeFormStatus('');
    refreshMerchData();
    startMerchAutoRefresh();
  }
};

const stopProjectAutoSync = () => {
  if (projectAutoSyncTimer) {
    clearInterval(projectAutoSyncTimer);
    projectAutoSyncTimer = null;
  }
};

const scheduleProjectAutoSync = () => {
  stopProjectAutoSync();
  if (!activeProject) return;
  projectAutoSyncTimer = setInterval(() => {
    if (!activeProject) return;
    syncActiveProject({ silent: true, refreshSeatTable: false, refreshTicketing: false });
  }, PROJECT_AUTO_SYNC_MS);
};

const syncActiveProject = async ({ silent = false, refreshSeatTable = false, refreshTicketing = false } = {}) => {
  if (!activeProject) return;
  if (projectSyncInFlight) {
    if (!silent) {
      setSeatTableStatus('正在同步中，请稍候...');
    }
    return;
  }
  projectSyncInFlight = true;
  try {
    const response = await authFetch(`/api/projects/${activeProject.id}`);
    if (!response.ok) {
      throw new Error('无法同步项目数据');
    }
    const data = await response.json();
    if (data?.project) {
      mergeIncomingProject(data.project, { refreshSeatTable, refreshTicketing });
      const availableSeats = Object.values(data.project.seats || {}).filter(
        (seat) => seat.status === 'available'
      ).length;
      const projectSummary = {
        id: data.project.id,
        name: data.project.name,
        rows: data.project.rows,
        cols: data.project.cols,
        availableSeats,
        createdAt: data.project.createdAt,
        updatedAt: data.project.updatedAt,
      };
      const existingIndex = projects.findIndex((item) => item.id === data.project.id);
      if (existingIndex >= 0) {
        projects[existingIndex] = { ...projects[existingIndex], ...projectSummary };
      } else {
        projects.push(projectSummary);
      }
      renderProjectList();
      if (!silent) {
        setStatus('已同步最新座位状态。');
        if (refreshSeatTable) {
          setSeatTableStatus('票号列表已更新。');
        }
      }
      scheduleProjectAutoSync();
    }
  } catch (error) {
    if (!silent) {
      setStatus(error.message, true);
      setSeatTableStatus(error.message, true);
    }
  } finally {
    projectSyncInFlight = false;
  }
};

if (selectTicketingMode) {
  selectTicketingMode.addEventListener('change', () => {
    if (selectTicketingMode.value === 'sequence') {
      sequenceConfigSection.classList.remove('hidden');
    } else {
      sequenceConfigSection.classList.add('hidden');
      inputTicketTemplate.value = '';
      inputTicketStart.value = '';
    }
    evaluateTicketingDirty();
  });
}

if (newProjectTicketingMode) {
  newProjectTicketingMode.addEventListener('change', () => {
    if (newProjectTicketingMode.value === 'sequence') {
      newProjectSequenceSection.classList.remove('hidden');
    } else {
      newProjectSequenceSection.classList.add('hidden');
    }
  });
}

if (inputTicketTemplate) {
  inputTicketTemplate.addEventListener('input', () => {
    evaluateTicketingDirty();
  });
}

if (inputTicketStart) {
  inputTicketStart.addEventListener('input', () => {
    evaluateTicketingDirty();
  });
}

const seatKey = (row, col) => `r${row}-c${col}`;

const extractSeatNumber = (seat, fallback) => {
  if (!seat || !seat.seatLabel) return fallback;
  const match = seat.seatLabel.match(/(\d+)(?:号|座)?$/u);
  return match ? match[1] : fallback;
};

const setStatus = (message, isError = false) => {
  statusEl.textContent = message || '';
  statusEl.style.color = isError ? '#ed553b' : '#20639b';
};

const setTicketingStatus = (message, isError = false) => {
  ticketingStatusEl.textContent = message || '';
  ticketingStatusEl.style.color = isError ? '#ed553b' : '#20639b';
};

const setSeatTableStatus = (message, isError = false) => {
  seatTableStatus.textContent = message || '';
  seatTableStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const setAccountStatus = (message, isError = false) => {
  accountStatusEl.textContent = message || '';
  accountStatusEl.style.color = isError ? '#ed553b' : '#20639b';
};

const setMerchFormStatus = (message, isError = false) => {
  if (!merchFormStatus) return;
  merchFormStatus.textContent = message || '';
  merchFormStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const setPresaleSummaryStatus = (message, isError = false) => {
  if (!presaleSummaryStatus) return;
  presaleSummaryStatus.textContent = message || '';
  presaleSummaryStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const setModeFormStatus = (message, isError = false) => {
  if (!modeFormStatus) return;
  modeFormStatus.textContent = message || '';
  modeFormStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const confirmDanger = (message) => {
  if (!window.confirm(message)) return false;
  return window.confirm('请再次确认，该操作将无法恢复。');
};

const openDialog = (dialog) => {
  if (!dialog || typeof dialog.showModal !== 'function') return;
  if (!dialog.open) {
    dialog.showModal();
  }
};

const closeDialog = (dialog) => {
  if (dialog && dialog.open) {
    dialog.close();
  }
};

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-close-dialog]');
  if (!target) return;
  const dialogId = target.getAttribute('data-close-dialog');
  const dialog = document.getElementById(dialogId);
  closeDialog(dialog);
});

const downloadTextFile = (filename, content, mime = 'text/plain') => {
  const isCsv = (mime && mime.includes('text/csv')) || /\.csv$/i.test(filename);
  const normalizedMime = isCsv ? 'text/csv;charset=utf-8' : mime;
  let payload = content;
  if (isCsv && typeof payload === 'string' && !payload.startsWith('\ufeff')) {
    payload = `\ufeff${payload}`;
  }
  const blob = new Blob([payload], { type: normalizedMime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const downloadBlob = (filename, blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const showToast = (text, type = 'info') => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '16px';
    container.style.right = '16px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.textContent = text;
  toast.style.padding = '10px 14px';
  toast.style.borderRadius = '8px';
  toast.style.color = '#fff';
  toast.style.boxShadow = '0 8px 18px rgba(0,0,0,0.2)';
  toast.style.background =
    type === 'error'
      ? '#e14949'
      : type === 'success'
      ? '#1f7a40'
      : '#1f76d0';
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
    if (!container.children.length) container.remove();
  }, 2600);
};

const showUndoToast = (text, backupFilename, { onUndo } = {}) => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '16px';
    container.style.right = '16px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.style.padding = '10px 14px';
  toast.style.borderRadius = '8px';
  toast.style.color = '#fff';
  toast.style.boxShadow = '0 8px 18px rgba(0,0,0,0.2)';
  toast.style.background = '#1f7a40';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.justifyContent = 'space-between';
  toast.style.gap = '10px';

  const left = document.createElement('div');
  left.textContent = text;
  toast.appendChild(left);

  if (backupFilename) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '撤销';
    btn.style.border = '1px solid rgba(255,255,255,0.7)';
    btn.style.background = 'transparent';
    btn.style.color = '#fff';
    btn.style.borderRadius = '8px';
    btn.style.padding = '6px 10px';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      try {
        if (onUndo) {
          await onUndo(backupFilename);
        }
      } finally {
        toast.remove();
        if (!container.children.length) container.remove();
      }
    });
    toast.appendChild(btn);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
    if (!container.children.length) container.remove();
  }, 7000);
};

const restoreFromBackup = async (backupFilename) => {
  if (!backupFilename) return;
  await dangerousJsonRequest(
    '/api/backups/restore',
    {
      method: 'POST',
      body: JSON.stringify({ filename: backupFilename }),
    },
    { actionLabel: `恢复备份 ${backupFilename}` }
  );
  showToast('已恢复备份，正在刷新数据...', 'success');
  await fetchProjects();
  await refreshMerchData();
  await loadMerchOrders();
  renderBackups();
  renderAuditLogs();
};

const parseOrderItemsInput = (text) => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) {
    throw new Error('请至少填写一条商品明细。');
  }
  return lines.map((line, index) => {
    const [name, price, qty] = line.split(/[,，]/).map((token) => token.trim());
    if (!name) {
      throw new Error(`第 ${index + 1} 行缺少商品名称`);
    }
    const unitPrice = Number(price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error(`第 ${index + 1} 行单价无效`);
    }
    const quantity = Math.max(1, Math.floor(Number(qty) || 0));
    return { name, unitPrice: Math.round(unitPrice * 100) / 100, quantity };
  });
};

const formatOrderItemsText = (items = []) =>
  items.map((item) => `${item.name},${item.unitPrice},${item.quantity}`).join('\n');

const formatCurrency = (value) => `¥${Number(value || 0).toFixed(2)}`;

const renderCheckinProjects = () => {
  if (!selectCheckinProject) return;
  const options = ['<option value="">全部项目</option>'];
  projects
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((project) => {
      options.push(`<option value="${project.id}">${project.name}</option>`);
    });
  selectCheckinProject.innerHTML = options.join('');
};

const setCheckinLogStatus = (message, isError = false) => {
  if (!checkinLogStatus) return;
  checkinLogStatus.textContent = message || '';
  checkinLogStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const setTicketRuleStatus = (message, isError = false) => {
  if (!ticketRuleStatus) return;
  ticketRuleStatus.textContent = message || '';
  ticketRuleStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const setTicketCouponStatus = (message, isError = false) => {
  if (!ticketCouponStatus) return;
  ticketCouponStatus.textContent = message || '';
  ticketCouponStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const renderTicketRuleSelect = () => {
  if (!selectTicketRule) return;
  const options = ['<option value="">请选择</option>'];
  ticketDiscountRules
    .slice()
    .filter((r) => r && r.enabled !== false)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .forEach((rule) => {
      options.push(`<option value="${rule.id}">${rule.name}（${rule.ticketCount}张 ${rule.discountRate}折）</option>`);
    });
  selectTicketRule.innerHTML = options.join('');
};

const renderTicketRules = () => {
  if (!ticketRuleTableBody) return;
  ticketRuleTableBody.innerHTML = '';
  if (!ticketDiscountRules.length) {
    ticketRuleTableBody.innerHTML = '<tr><td colspan="6">暂无规则</td></tr>';
    renderTicketRuleSelect();
    return;
  }
  ticketDiscountRules.forEach((rule) => {
    const tr = document.createElement('tr');
    const prices =
      rule.allowedPrices && Array.isArray(rule.allowedPrices) && rule.allowedPrices.length
        ? rule.allowedPrices.join(' / ')
        : '不限';
    tr.innerHTML = `
      <td>${rule.name}</td>
      <td>${rule.ticketCount}</td>
      <td>${rule.discountRate} 折</td>
      <td>${prices}</td>
      <td>${rule.enabled === false ? '停用' : '启用'}</td>
      <td>
        <div class="table-actions">
          <button class="button button--secondary" data-action="edit" data-id="${rule.id}">编辑</button>
          <button class="button button--danger" data-action="delete" data-id="${rule.id}">删除</button>
        </div>
      </td>
    `;
    ticketRuleTableBody.appendChild(tr);
  });
  renderTicketRuleSelect();
};

const loadTicketRules = async () => {
  if (!activeProject) {
    ticketDiscountRules = [];
    renderTicketRules();
    return;
  }
  try {
    const resp = await authFetch(`/api/projects/${activeProject.id}/ticket-discounts`);
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || '无法获取折扣规则');
    ticketDiscountRules = data.rules || [];
    renderTicketRules();
    setTicketRuleStatus('');
  } catch (error) {
    ticketDiscountRules = [];
    renderTicketRules();
    setTicketRuleStatus(error.message, true);
  }
};

const loadTicketCoupons = async () => {
  if (!activeProject) {
    ticketCoupons = [];
    if (ticketCouponTableBody) ticketCouponTableBody.innerHTML = '<tr><td colspan="6">请选择项目</td></tr>';
    return;
  }
  try {
    const params = new URLSearchParams();
    const q = (inputTicketCouponSearch?.value || '').trim();
    if (q) params.set('q', q);
    const st = selectTicketCouponStatus?.value || '';
    if (st) params.set('status', st);
    const resp = await authFetch(`/api/projects/${activeProject.id}/ticket-coupons?${params.toString()}`);
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || '无法获取优惠券列表');
    ticketCoupons = data.coupons || [];
    if (!ticketCouponTableBody) return;
    ticketCouponTableBody.innerHTML = '';
    if (!ticketCoupons.length) {
      ticketCouponTableBody.innerHTML = '<tr><td colspan="6">暂无记录</td></tr>';
      return;
    }
    ticketCoupons.slice(0, 500).forEach((c) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code>${c.code}</code></td>
        <td>${c.ruleName || '-'}</td>
        <td>${c.remaining ?? '-'}</td>
        <td>${c.status}</td>
        <td>${c.issuedBy || '-'}<br/><span class="hint">${c.issuedAt ? new Date(c.issuedAt).toLocaleString() : '-'}</span></td>
        <td>
          <div class="table-actions">
            <button class="button button--danger" data-action="void" data-code="${c.code}" ${c.status !== 'issued' ? 'disabled' : ''}>作废</button>
          </div>
        </td>
      `;
      ticketCouponTableBody.appendChild(tr);
    });
    setTicketCouponStatus('');
  } catch (error) {
    if (ticketCouponTableBody) ticketCouponTableBody.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
    setTicketCouponStatus(error.message, true);
  }
};

const resetTicketRuleForm = () => {
  if (!ticketRuleForm) return;
  ticketRuleForm.reset();
  if (inputTicketRuleId) inputTicketRuleId.value = '';
  if (inputTicketRuleCount) inputTicketRuleCount.value = '1';
  if (inputTicketRuleDiscount) inputTicketRuleDiscount.value = '9.0';
  if (selectTicketRuleEnabled) selectTicketRuleEnabled.value = 'true';
  if (ticketRuleFormStatus) ticketRuleFormStatus.textContent = '';
};

const renderCheckinLogs = (logs = []) => {
  if (!checkinLogTable) return;
  const tbody = checkinLogTable.querySelector('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!logs.length) {
    tbody.innerHTML = '<tr><td colspan="8">暂无检票记录。</td></tr>';
    return;
  }
  logs.forEach((log) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(log.createdAt).toLocaleString()}</td>
      <td>${log.projectName || log.projectId || '-'}</td>
      <td>${log.seatLabel || '-'}</td>
      <td>${log.ticketNumber || '-'}</td>
      <td>${log.status || '-'}</td>
      <td>${log.checkedInBy || log.handledBy || '-'}</td>
      <td>${log.message || '-'}</td>
      <td>
        <button class="button button--secondary" data-action="checkin-edit" data-id="${log.id}">编辑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

const updateCheckinPaginationControls = (totalPages) => {
  if (checkinPageInfo) {
    checkinPageInfo.textContent = `第 ${checkinPage} / ${totalPages} 页（共 ${checkinTotal} 条）`;
  }
  if (btnCheckinPrev) {
    btnCheckinPrev.disabled = checkinPage <= 1 || checkinTotal === 0;
  }
  if (btnCheckinNext) {
    btnCheckinNext.disabled = checkinPage >= totalPages || checkinTotal === 0;
  }
};

const renderCheckinPage = () => {
  const totalPages = checkinTotal ? Math.ceil(checkinTotal / CHECKIN_PAGE_SIZE) : 1;
  if (checkinPage > totalPages) checkinPage = totalPages;
  if (checkinPage < 1) checkinPage = 1;
  const start = (checkinPage - 1) * CHECKIN_PAGE_SIZE;
  const slice = checkinLogs.slice(start, start + CHECKIN_PAGE_SIZE);
  renderCheckinLogs(slice);
  updateCheckinPaginationControls(totalPages);
};

const loadCheckinLogs = async () => {
  if (!checkinLogTable) return;
  setCheckinLogStatus('正在拉取检票记录...');
  try {
    const params = new URLSearchParams();
    if (selectCheckinProject?.value) {
      params.set('projectId', selectCheckinProject.value);
    }
    const response = await authFetch(`/api/checkins?${params.toString()}`);
    if (!response.ok) throw new Error('获取检票记录失败');
    const data = await response.json();
    checkinLogs = data.logs || [];
    checkinTotal = checkinLogs.length;
    checkinPage = 1;
    renderCheckinPage();
    setCheckinLogStatus('');
  } catch (error) {
    checkinLogs = [];
    checkinTotal = 0;
    checkinPage = 1;
    renderCheckinPage();
    setCheckinLogStatus(error.message, true);
  }
};

const setOrderFormStatus = (message, isError = false) => {
  if (!orderFormStatus) return;
  orderFormStatus.textContent = message || '';
  orderFormStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const resetOrderForm = () => {
  editingOrderId = null;
  if (!merchOrderForm) return;
  merchOrderForm.reset();
  inputOrderId.value = '';
  if (inputOrderItems) inputOrderItems.value = '';
  if (selectOrderCheckoutMode) {
    selectOrderCheckoutMode.value = '';
  }
  if (inputOrderTime) {
    const now = new Date();
    const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    inputOrderTime.value = iso;
  }
  setOrderFormStatus('');
};

const populateOrderForm = (order) => {
  if (!order) {
    resetOrderForm();
    return;
  }
  editingOrderId = order.id;
  inputOrderId.value = order.id;
  if (inputOrderItems) {
    inputOrderItems.value = formatOrderItemsText(order.items || []);
  }
  if (selectOrderCheckoutMode) {
    selectOrderCheckoutMode.value = order.checkoutModeId || '';
  }
  if (inputOrderHandler) inputOrderHandler.value = order.handledBy || '';
  if (inputOrderNote) inputOrderNote.value = order.note || '';
  if (inputOrderTime) {
    const dt = new Date(order.createdAt);
    const iso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    inputOrderTime.value = iso;
  }
  setOrderFormStatus(`正在编辑记录（ID: ${order.id}）`);
};

const updateModeFieldVisibility = () => {
  const type = selectModeType.value;
  const discountField = document.querySelector('.mode-field--discount');
  const fullcutField = document.querySelector('.mode-field--fullcut');
  if (discountField) {
    discountField.classList.toggle('hidden', type !== 'discount');
  }
  if (fullcutField) {
    fullcutField.classList.toggle('hidden', type !== 'fullcut');
  }
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });

const loadImageFromDataUrl = (dataUrl) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('图片解析失败'));
    image.src = dataUrl;
  });

const canvasToBlob = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('图片压缩失败'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      quality
    );
  });

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(blob);
  });

const compressImageFile = async (file) => {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImageFromDataUrl(dataUrl);
  const originalMaxEdge = Math.max(image.width, image.height);
  let targetMaxEdge = Math.min(1400, originalMaxEdge);
  while (targetMaxEdge >= 96) {
    const scale = targetMaxEdge / Math.max(image.width, image.height);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('浏览器不支持图片压缩，请更换浏览器后重试。');
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    for (let quality = 0.9; quality >= 0.1; quality -= 0.05) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await canvasToBlob(canvas, quality);
      if (blob.size <= MAX_MERCH_IMAGE_BYTES) {
        return blobToDataUrl(blob);
      }
    }
    targetMaxEdge = Math.floor(targetMaxEdge * 0.6);
  }
  throw new Error('图片压缩后仍超过 10MB，请尝试更小尺寸或更低分辨率的图片。');
};

const prepareImageData = async (file) => {
  if (!file) return null;
  if (file.size <= MAX_MERCH_IMAGE_BYTES) {
    return readFileAsDataUrl(file);
  }
  return compressImageFile(file);
};

socket.on('connect', () => {
  if (activeProject) {
    scheduleProjectAutoSync();
  }
  if (!statusEl.textContent) return;
  setTimeout(() => setStatus(''), 300);
});

socket.on('disconnect', (reason) => {
  if (reason === 'io client disconnect' || reason === 'io server disconnect') return;
  setStatus('实时连接已断开，系统将自动重试...', true);
});

socket.on('connect_error', (error) => {
  const message = error?.message || '';
  if (message.includes('未登录') || message.includes('会话')) {
    redirectToLogin();
    return;
  }
  setStatus(message || '实时连接失败，请稍后重试。', true);
});

const recomputeSeatLabels = () => {
  if (!activeProject) return;
  ensureActiveProjectMetadata();
  const { rows, cols, seats } = activeProject;
  const centerLeftIndex = Math.floor((cols - 1) / 2);
  const centerRightIndex = centerLeftIndex + 1;

  for (let row = 0; row < rows; row += 1) {
    const leftSeats = [];
    const rightSeats = [];

    for (let col = 0; col < cols; col += 1) {
      const id = seatKey(row, col);
      const seat = seats[id];
      if (!seat) continue;
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

    const progress = {
      leftNext: leftSeats.length > 0 ? leftSeats.length * 2 + 1 : 1,
      rightNext: rightSeats.length > 0 ? rightSeats.length * 2 + 2 : 2,
    };
    if (progress.leftNext % 2 === 0) progress.leftNext += 1;
    if (progress.rightNext % 2 !== 0) progress.rightNext += 1;
    activeProject.seatLabelProgress[String(row)] = progress;
  }
};

const setNewProjectStatus = (message, isError = false) => {
  newProjectStatus.textContent = message || '';
  newProjectStatus.style.color = isError ? '#ed553b' : '#20639b';
};

const updateSelectedCount = () => {
  selectedCountEl.textContent = String(selectedSeats.size);
  updateWorkspaceAvailability();
};

const isProjectNameDirty = () => {
  if (!activeProject) return false;
  const trimmed = inputProjectName.value.trim();
  return trimmed && trimmed !== (activeProject.name || '').trim();
};

const hasPendingChanges = () => {
  if (!activeProject) return false;
  if (modifiedSeats.size > 0) return true;
  return isProjectNameDirty();
};

const resetAutoSaveTimer = () => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
};

const scheduleAutoSave = () => {
  if (!activeProject) return;
  if (isSavingProject) return;
  if (!hasPendingChanges()) return;
  resetAutoSaveTimer();
  autoSaveTimer = setTimeout(() => {
    saveActiveProject({ manual: false, reason: 'auto' }).catch(() => {});
  }, AUTO_SAVE_DELAY);
};

const updateSaveButtonState = () => {
  if (!activeProject) {
    btnSaveProject.disabled = true;
    setStatus('');
    return;
  }
  const dirty = hasPendingChanges();
  btnSaveProject.disabled = !dirty;
  if (dirty) {
    setStatus('有未保存的修改，请点击“保存修改”。');
  } else {
    setStatus('');
  }
};

const saveActiveProject = async ({ manual = false, reason = 'manual' } = {}) => {
  if (!activeProject) {
    if (manual) {
      setStatus('请先选择项目。', true);
    }
    return;
  }
  if (isSavingProject) {
    if (manual) {
      setStatus('正在保存，请稍候...', true);
    }
    return;
  }
  const nameTrimmed = inputProjectName.value.trim();
  const nameChanged = isProjectNameDirty();
  const seatPayload = Array.from(modifiedSeats.values());
  if (!nameChanged && seatPayload.length === 0) {
    if (manual) {
      setStatus('没有需要保存的修改。');
    }
    resetAutoSaveTimer();
    updateSaveButtonState();
    return;
  }

  isSavingProject = true;
  resetAutoSaveTimer();
  const payload = {};
  if (nameChanged) {
    payload.name = nameTrimmed;
  }
  if (seatPayload.length > 0) {
    payload.seats = seatPayload;
  }

  if (manual) {
    setStatus('正在保存修改...');
    btnSaveProject.disabled = true;
  } else {
    setStatus('检测到更改，正在自动保存...');
  }

  try {
    let data;
    if (manual) {
      data = await dangerousJsonRequest(
        `/api/projects/${activeProject.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ ...payload, bulk: seatPayload.length >= 20 }),
        },
        { actionLabel: '保存项目修改（可能包含批量座位变更）' }
      );
    } else {
      // 自动保存不弹出二次确认，遇到危险操作则提示用户手动保存
      const result = await requestJson(`/api/projects/${activeProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, bulk: seatPayload.length >= 20 }),
      });
      if (result.response.status === 409 && result.data?.code === 'CONFIRM_REQUIRED') {
        setStatus('检测到批量/危险修改，需点击“保存修改”进行二次确认后才能同步。', true);
        return;
      }
      if (!result.response.ok) {
        throw new Error(result.data?.error || '保存失败');
      }
      data = result.data;
    }
    modifiedSeats.clear();
    mergeIncomingProject(data.project, {
      refreshSeatTable: reason !== 'auto',
      refreshTicketing: true,
    });
    const availableSeats = Object.values(data.project.seats || {}).filter(
      (seat) => seat.status === 'available'
    ).length;
    const projectSummary = {
      id: data.project.id,
      name: data.project.name,
      rows: data.project.rows,
      cols: data.project.cols,
      availableSeats,
      createdAt: data.project.createdAt,
      updatedAt: data.project.updatedAt,
    };
    const existingIndex = projects.findIndex((item) => item.id === data.project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...projects[existingIndex], ...projectSummary };
    } else {
      projects.push(projectSummary);
    }
    renderProjectList();
    updateSelectedCount();
    updateSaveButtonState();
    scheduleProjectAutoSync();
    if (reason === 'auto') {
      setStatus('已自动保存最新修改。');
    } else {
      setStatus('已保存并同步到所有终端。');
    }
    if (manual && data?.undo?.backupFilename) {
      showUndoToast('已保存修改', data.undo.backupFilename, { onUndo: restoreFromBackup });
    }
  } catch (error) {
    setStatus(error.message, true);
    if (hasPendingChanges()) {
      scheduleAutoSave();
    }
  } finally {
    isSavingProject = false;
    if (manual) {
      btnSaveProject.disabled = !hasPendingChanges();
    }
  }
};

const buildPriceColorMap = () => {
  if (!activeProject) return;
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

const renderPriceLegend = () => {
  priceLegendList.innerHTML = '';
  if (!priceColorMap.size) {
    const empty = document.createElement('li');
    empty.textContent = '暂无已启用座位';
    priceLegendList.appendChild(empty);
    return;
  }
  priceColorMap.forEach((color, price) => {
    const item = document.createElement('li');
    const chipClass = ensurePriceChipClass(color);
    item.innerHTML = `<span class="price-chip ${chipClass}"></span>¥${price}`;
    priceLegendList.appendChild(item);
  });
};

const colorSeatElement = (seat, el) => {
  if (!el) return;
  el.classList.remove(
    'seat--disabled',
    'seat--available',
    'seat--locked',
    'seat--sold',
    'seat--pending',
    'seat--priced'
  );
  el.style.removeProperty('--seat-price-color');
  if (!seat || seat.status === 'disabled') {
    el.classList.add('seat--disabled');
    return;
  }
  if (seat.status === 'sold') {
    el.classList.add('seat--sold');
  } else if (seat.status === 'locked') {
    el.classList.add('seat--locked');
  } else {
    el.classList.add('seat--available');
  }
  if (seat.price != null && priceColorMap.has(seat.price)) {
    el.classList.add('seat--priced');
    el.style.setProperty('--seat-price-color', priceColorMap.get(seat.price));
  }
  if (seat.seatLabel) {
    el.dataset.label = seat.seatLabel;
  } else {
    delete el.dataset.label;
  }
};

const refreshSeatElements = (seatIds = null) => {
  if (!activeProject) return;
  let ids;
  if (!seatIds) {
    ids = Object.keys(activeProject.seats || {});
  } else if (Array.isArray(seatIds)) {
    ids = seatIds;
  } else if (seatIds instanceof Set) {
    ids = Array.from(seatIds);
  } else if (typeof seatIds[Symbol.iterator] === 'function') {
    ids = Array.from(seatIds);
  } else {
    ids = [seatIds];
  }
  ids.forEach((id) => {
    const seat = activeProject.seats[id];
    const el = seatElements.get(id);
    if (!el || !seat) return;
    el.textContent = extractSeatNumber(seat, el.dataset.col);
    colorSeatElement(seat, el);
    updateSeatElementSelection(id);
  });
};

const resetMerchForm = () => {
  if (!merchProductForm) return;
  inputMerchId.value = '';
  inputMerchName.value = '';
  inputMerchPrice.value = '';
  inputMerchStock.value = '';
  inputMerchDescription.value = '';
  if (inputMerchImage) {
    inputMerchImage.value = '';
  }
  setMerchFormStatus('');
};

const resetModeForm = () => {
  if (!checkoutModeForm) return;
  inputModeId.value = '';
  inputModeName.value = '';
  selectModeType.value = 'standard';
  if (inputModeDiscount) inputModeDiscount.value = '9.5';
  if (inputModeThreshold) inputModeThreshold.value = '';
  if (inputModeCut) inputModeCut.value = '';
  if (inputModeStack) inputModeStack.value = '0';
  inputModeDescription.value = '';
  setModeFormStatus('');
  updateModeFieldVisibility();
};

const collectSeatIdsForRows = (rows) => {
  if (!activeProject || rows == null) return [];
  const list = [];
  const iterator =
    rows instanceof Set || Array.isArray(rows) ? rows : typeof rows[Symbol.iterator] === 'function' ? rows : [rows];
  for (const value of iterator) {
    const row = Number(value);
    if (!Number.isInteger(row) || row < 0 || row >= activeProject.rows) continue;
    for (let col = 0; col < activeProject.cols; col += 1) {
      const id = seatKey(row, col);
      if (activeProject.seats[id]) {
        list.push(id);
      }
    }
  }
  return list;
};

const refreshPriceLegend = () => {
  buildPriceColorMap();
  renderPriceLegend();
};

const updateSeatElementSelection = (seatId) => {
  const el = seatElements.get(seatId);
  if (!el) return;
  if (selectedSeats.has(seatId)) {
    el.classList.add('seat--selected');
  } else {
    el.classList.remove('seat--selected');
  }
};

const refreshSelectionStyles = () => {
  seatElements.forEach((_, seatId) => updateSeatElementSelection(seatId));
};

const updateAllSeatElements = () => {
  if (!activeProject) return;
  refreshPriceLegend();
  refreshSeatElements();
  updateSaveButtonState();
  updateZoneSummary();
};

const updateZoneSummary = () => {
  if (!activeProject) {
    zoneSummaryList.innerHTML = '<li>暂无数据</li>';
    return;
  }
  const summaryMap = new Map();
  Object.values(activeProject.seats || {}).forEach((seat) => {
    if (!seat || seat.status === 'disabled') return;
    const key = seat.price != null ? seat.price : null;
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
  const items = [...summaryMap.values()];
  items.sort((a, b) => {
    if (a.price == null && b.price == null) return 0;
    if (a.price == null) return 1;
    if (b.price == null) return -1;
    return b.price - a.price;
  });
  if (!items.length) {
    zoneSummaryList.innerHTML = '<li>暂无启用座位</li>';
    return;
  }
  zoneSummaryList.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    const priceLabel = item.price != null ? `¥${item.price}` : '未设置票价';
    li.textContent = `${priceLabel}：可售 ${item.available} / 锁定 ${item.locked} / 已售 ${item.sold}`;
    zoneSummaryList.appendChild(li);
  });
};

const updateTicketingControls = () => {
  setTicketingStatus('');
  if (!activeProject) {
    ticketingSnapshot = {
      mode: 'random',
      template: '',
      start: '',
    };
    applySnapshotToTicketingInputs();
    setTicketingDirty(false);
    return;
  }
  captureTicketingSnapshot();
  applySnapshotToTicketingInputs();
  setTicketingDirty(false);
  evaluateTicketingDirty();
};

const updateSeatPaginationControls = (totalPages) => {
  if (seatPageInfo) {
    seatPageInfo.textContent = `第 ${seatPage} / ${totalPages} 页（共 ${seatTotal} 条）`;
  }
  if (btnSeatPrev) {
    btnSeatPrev.disabled = seatPage <= 1 || seatTotal === 0;
  }
  if (btnSeatNext) {
    btnSeatNext.disabled = seatPage >= totalPages || seatTotal === 0;
  }
};

const refreshSeatTable = ({ fromSearch = false, resetPage = false } = {}) => {
  if (!activeProject) {
    seatTableBody.innerHTML = '';
    seatTableBody.insertAdjacentHTML('beforeend', '<tr><td colspan="6">请选择项目</td></tr>');
    if (seatTableSearchInput) {
      seatTableSearchInput.value = '';
      seatTableSearchInput.disabled = true;
      seatTableSearchQuery = '';
    }
    seatTotal = 0;
    seatPage = 1;
    updateSeatPaginationControls(1);
    return;
  }
  if (seatTableSearchInput) {
    seatTableSearchInput.disabled = false;
  }
  const getSeatSortNumber = (seat) => {
    const extracted = extractSeatNumber(seat, String(seat.col + 1));
    const numeric = Number(extracted);
    return Number.isFinite(numeric) ? numeric : seat.col + 1;
  };

  const seats = Object.entries(activeProject.seats || {})
    .filter(([, seat]) => seat.status !== 'disabled')
    .map(([id, seat]) => ({ id, seat, sortNumber: getSeatSortNumber(seat) }))
    .sort((a, b) => {
      if (a.seat.row !== b.seat.row) {
        return a.seat.row - b.seat.row;
      }
      return a.sortNumber - b.sortNumber;
    });
  if (!seats.length) {
    seatTableBody.innerHTML = '';
    seatTableBody.insertAdjacentHTML('beforeend', '<tr><td colspan="6">暂无启用座位</td></tr>');
    if (fromSearch) {
      setSeatTableStatus('');
    }
    seatTotal = 0;
    seatPage = 1;
    updateSeatPaginationControls(1);
    return;
  }
  const query = seatTableSearchQuery.trim().toLowerCase();
  const filteredSeats = query
    ? seats.filter(({ id, seat }) => {
        const seatLabel = seat.seatLabel || `${seat.row + 1}排${seat.col + 1}号`;
        const statusLabel = SEAT_STATUS_LABELS[seat.status] || seat.status || '';
        const tokens = [
          seatLabel,
          statusLabel,
          seat.ticketNumber || '',
          seat.price != null ? String(seat.price) : '',
          seat.price != null ? `¥${seat.price}` : '',
          String(seat.row + 1),
          String(seat.col + 1),
          id,
        ];
        return tokens.some((token) => token && token.toLowerCase().includes(query));
      })
    : seats;
  if (!filteredSeats.length) {
    seatTableBody.innerHTML = '';
    seatTableBody.insertAdjacentHTML(
      'beforeend',
      `<tr><td colspan="6">未找到与当前搜索匹配的座位。</td></tr>`
    );
    if (fromSearch) {
      setSeatTableStatus(`未找到与“${seatTableSearchQuery.trim()}”匹配的座位。`, true);
    }
    seatTotal = 0;
    seatPage = 1;
    updateSeatPaginationControls(1);
    return;
  }
  seatTotal = filteredSeats.length;
  if (resetPage) {
    seatPage = 1;
  }
  const totalPages = seatTotal ? Math.ceil(seatTotal / SEAT_PAGE_SIZE) : 1;
  if (seatPage > totalPages) seatPage = totalPages;
  if (seatPage < 1) seatPage = 1;
  const start = (seatPage - 1) * SEAT_PAGE_SIZE;
  const pageSlice = filteredSeats.slice(start, start + SEAT_PAGE_SIZE);
  updateSeatPaginationControls(totalPages);
  const fragment = document.createDocumentFragment();
  pageSlice.forEach(({ id, seat }) => {
    const tr = document.createElement('tr');
    tr.dataset.seatId = id;
    const seatLabel = seat.seatLabel || `${seat.row + 1}排${seat.col + 1}号`;
    const viewStatus =
      seat.status === 'sold'
        ? seat.checkedInAt
          ? 'checked'
          : 'sold'
        : seat.status === 'locked'
        ? 'locked'
        : seat.status === 'disabled'
        ? 'disabled'
        : 'available';
    const statusValue = seat.status === 'sold' ? 'sold' : seat.status === 'locked' ? 'locked' : 'available';

    tr.innerHTML = `
      <td>${seat.row + 1}</td>
      <td>${seatLabel}</td>
      <td>
        <select data-role="status" name="seat-status" aria-label="座位状态">
          <option value="available" ${statusValue === 'available' ? 'selected' : ''}>空闲</option>
          <option value="locked" ${statusValue === 'locked' ? 'selected' : ''}>锁定</option>
          <option value="sold" ${statusValue === 'sold' ? 'selected' : ''}>已签发</option>
        </select>
      </td>
      <td>
        <select data-role="checkin" aria-label="检票状态">
          <option value="unchecked" ${seat.checkedInAt ? '' : 'selected'}>未检票</option>
          <option value="checked" ${seat.checkedInAt ? 'selected' : ''}>已检票</option>
        </select>
      </td>
      <td>
        <input
          data-role="ticket"
          type="text"
          name="seat-ticket-number"
          aria-label="票号"
          value="${seat.ticketNumber ? seat.ticketNumber : ''}"
        />
      </td>
      <td>
        <input
          data-role="price"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.01"
          placeholder="未设置"
          name="seat-price"
          aria-label="票价"
          value="${seat.price != null ? seat.price : ''}"
        />
      </td>
      <td>
        <button class="button button--primary" data-action="save" type="button">保存</button>
        <button class="button" data-action="detail" type="button">详情</button>
      </td>
    `;
    fragment.appendChild(tr);
  });
  seatTableBody.innerHTML = '';
  seatTableBody.appendChild(fragment);
  if (fromSearch) {
    if (query) {
      setSeatTableStatus(`已筛选 ${filteredSeats.length} / ${seats.length} 条记录。`);
    } else {
      setSeatTableStatus('');
    }
  }
  refreshInlineCheckins(true);
};

const renderAccounts = () => {
  if (!accounts.length) {
    accountTableBody.innerHTML = '<tr><td colspan="3">暂无账号</td></tr>';
    return;
  }
  const fragment = document.createDocumentFragment();
  accounts
    .slice()
    .sort((a, b) => {
      if (a.role === b.role) return a.username.localeCompare(b.username);
      return a.role.localeCompare(b.role);
    })
    .forEach((account) => {
      const tr = document.createElement('tr');
      tr.dataset.username = account.username;
      tr.innerHTML = `
        <td>${account.username}</td>
        <td>${ACCOUNT_ROLE_LABELS[account.role] || account.role}</td>
        <td><button class="button button--danger" data-action="delete" type="button">删除</button></td>
      `;
      fragment.appendChild(tr);
    });
  accountTableBody.innerHTML = '';
  accountTableBody.appendChild(fragment);
};

const renderMerchProducts = () => {
  if (!merchProductListEl) return;
  merchProductListEl.innerHTML = '';
  if (!merchProducts.length) {
    const empty = document.createElement('div');
    empty.className = 'placeholder';
    empty.textContent = '还没有商品，先在左侧表单里添加吧。';
    merchProductListEl.appendChild(empty);
    return;
  }
  const presaleMap = new Map((merchPresaleSummary || []).map((row) => [String(row.productId), row]));
  merchProducts
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((product) => {
      const presale = presaleMap.get(String(product.id));
      const card = document.createElement('div');
      card.className = 'merch-card';
      const img = document.createElement('img');
      img.className = 'merch-card__img';
      img.alt = product.name;
      img.src = product.imageData || PLACEHOLDER_IMAGE;
      card.appendChild(img);
      const title = document.createElement('strong');
      title.textContent = product.name;
      card.appendChild(title);
      const meta = document.createElement('div');
      meta.className = 'merch-card__meta';
      meta.innerHTML = `<span>${formatCurrency(product.price)}</span><span>库存 ${product.stock}</span>${
        presale && presale.outstandingQty
          ? `<span class="hint">预售未核销 ${presale.outstandingQty}</span>`
          : ''
      }`;
      card.appendChild(meta);
      if (product.description) {
        const desc = document.createElement('p');
        desc.className = 'hint';
        desc.textContent = product.description;
        card.appendChild(desc);
      }
      const actions = document.createElement('div');
      actions.className = 'form__actions';
      const editBtn = document.createElement('button');
      editBtn.className = 'button button--secondary';
      editBtn.type = 'button';
      editBtn.dataset.action = 'edit-product';
      editBtn.dataset.id = product.id;
      editBtn.textContent = '编辑';
      const toggleBtn = document.createElement('button');
      toggleBtn.className = product.enabled === false ? 'button' : 'button button--danger';
      toggleBtn.type = 'button';
      toggleBtn.dataset.action = 'toggle-product';
      toggleBtn.dataset.id = product.id;
      toggleBtn.textContent = product.enabled === false ? '启用' : '停用';
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'button button--danger';
      deleteBtn.type = 'button';
      deleteBtn.dataset.action = 'delete-product';
      deleteBtn.dataset.id = product.id;
      deleteBtn.textContent = '删除';
      actions.appendChild(editBtn);
      actions.appendChild(toggleBtn);
      actions.appendChild(deleteBtn);
      card.appendChild(actions);
      merchProductListEl.appendChild(card);
    });
};

const renderCheckoutModes = () => {
  if (!checkoutModeTableBody) return;
  checkoutModeTableBody.innerHTML = '';
  if (!checkoutModes.length) {
    checkoutModeTableBody.innerHTML = '<tr><td colspan="6">暂无结账模式。</td></tr>';
    return;
  }
  checkoutModes
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((mode) => {
      const tr = document.createElement('tr');
      let paramText = '-';
      if (mode.type === 'discount' || mode.type === 'percentage') {
        const display = (Number(mode.value) || 1) * 10;
        paramText = `${display.toFixed(1)} 折`;
      } else if (mode.type === 'fullcut') {
        const stackLabel = mode.stackLimit ? `×${mode.stackLimit}` : '（无限叠加）';
        paramText = `满 ${mode.threshold} 减 ${mode.cutAmount} ${stackLabel}`;
      }
      tr.innerHTML = `
        <td>${mode.name}</td>
        <td>${mode.type === 'fullcut' ? '满减' : mode.type === 'discount' ? '折扣' : '原价'}</td>
        <td>${paramText}</td>
        <td>${mode.description || '-'}</td>
        <td>${mode.enabled === false ? '已停用' : '启用中'}</td>
        <td>
          <div class="table-actions">
            <button class="button button--secondary" data-action="edit-mode" data-id="${mode.id}">编辑</button>
            <button class="button button--danger" data-action="delete-mode" data-id="${mode.id}">删除</button>
          </div>
        </td>
      `;
      checkoutModeTableBody.appendChild(tr);
    });
  syncOrderCheckoutSelect();
};

const renderPresaleSummary = () => {
  if (!presaleSummaryTableBody) return;
  presaleSummaryTableBody.innerHTML = '';
  if (!merchPresaleSummary || !merchPresaleSummary.length) {
    presaleSummaryTableBody.innerHTML = '<tr><td colspan="5">暂无预售记录。</td></tr>';
    return;
  }
  merchPresaleSummary.slice(0, 500).forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.name || row.productId}</td>
      <td>${formatCurrency(row.unitPrice || 0)}</td>
      <td>${row.issuedQty || 0}</td>
      <td>${row.redeemedQty || 0}</td>
      <td><strong>${row.outstandingQty || 0}</strong></td>
    `;
    presaleSummaryTableBody.appendChild(tr);
  });
};

const syncOrderCheckoutSelect = () => {
  if (!selectOrderCheckoutMode) return;
  const options = ['<option value="">原价</option>'];
  checkoutModes.forEach((mode) => {
    const suffix = mode.enabled === false ? '（已停用）' : '';
    options.push(`<option value="${mode.id}">${mode.name}${suffix}</option>`);
  });
  selectOrderCheckoutMode.innerHTML = options.join('');
  if (editingOrderId) {
    const current = merchOrders.find((order) => order.id === editingOrderId);
    if (current) {
      selectOrderCheckoutMode.value = current.checkoutModeId || '';
    }
  }
};

const renderMerchOrders = () => {
  if (!merchOrdersTableBody) return;
  merchOrdersTableBody.innerHTML = '';
  if (!merchOrders.length) {
    merchOrdersTableBody.innerHTML = '<tr><td colspan="8">暂无记录。</td></tr>';
    return;
  }
  merchOrders.slice(0, 200).forEach((order) => {
    const tr = document.createElement('tr');
    const detail = order.items
      .map((item) => `${item.name} ×${item.quantity}（${formatCurrency(item.subtotal)}）`)
      .join('、');
    const checked = selectedOrderIds.has(order.id);
    const manualTag = order.manual ? '<span class="badge badge--warning">录入</span>' : '';
    const presaleTag =
      order.orderType === 'presale'
        ? `<span class="badge badge--info" title="预售预购券">预售券</span>${
            order.voucherCode
              ? `<br/><button class="button button--link button--inline" data-action="open-voucher" data-id="${order.id}" type="button">券码：${order.voucherCode}</button>`
              : ''
          }${
            order.redeemedAt
              ? `<br/><span class="badge badge--success">已核销</span><span class="hint"> ${new Date(
                  order.redeemedAt
                ).toLocaleString()}</span>`
              : `<br/><span class="badge badge--warning">未核销</span>`
          }`
        : '';
    tr.innerHTML = `
      <td><input type="checkbox" class="order-select" data-id="${order.id}" ${checked ? 'checked' : ''}/></td>
      <td>${new Date(order.createdAt).toLocaleString()} ${manualTag}${presaleTag ? `<br/>${presaleTag}` : ''}</td>
      <td>${detail}${
        order.orderType === 'presale' && order.voucherCode
          ? `<br/><span class="hint">预购券：${order.voucherCode}</span>`
          : ''
      }</td>
      <td>${order.checkoutModeName || '原价'}</td>
      <td>${formatCurrency(order.totalAfter)}${
        order.discount ? `<br/><span class="hint">立减 ${formatCurrency(order.discount)}</span>` : ''
      }</td>
      <td>${order.handledBy || '-'}</td>
      <td>${order.note || '-'}</td>
      <td>
        <div class="table-actions">
          <button class="button button--secondary" data-action="edit-order" data-id="${order.id}">编辑</button>
          <button class="button" data-action="statement-order" data-id="${order.id}">单据</button>
          <button class="button button--danger" data-action="delete-order" data-id="${order.id}">删除</button>
        </div>
      </td>
    `;
    merchOrdersTableBody.appendChild(tr);
  });
  if (ordersSelectAll) {
    const totalRows = merchOrders.slice(0, 200).length;
    const selectedRows = merchOrders.slice(0, 200).filter((o) => selectedOrderIds.has(o.id)).length;
    ordersSelectAll.checked = totalRows > 0 && selectedRows === totalRows;
    ordersSelectAll.indeterminate = selectedRows > 0 && selectedRows < totalRows;
  }
};

const updateOrdersPagination = () => {
  if (!ordersPageInfo) return;
  const totalPages = Math.max(1, Math.ceil(ordersTotal / ORDERS_PAGE_SIZE));
  ordersPage = Math.min(Math.max(1, ordersPage), totalPages);
  ordersPageInfo.textContent = `第 ${ordersPage} / ${totalPages} 页（共 ${ordersTotal} 条）`;
  if (btnOrdersPrev) btnOrdersPrev.disabled = ordersPage <= 1;
  if (btnOrdersNext) btnOrdersNext.disabled = ordersPage >= totalPages;
};

const fetchAccounts = async () => {
  try {
    const response = await authFetch('/api/accounts');
    if (!response.ok) throw new Error('无法获取账号列表');
    const data = await response.json();
    accounts = data.accounts || [];
    renderAccounts();
    setAccountStatus('');
    renderCheckinProjects();
  } catch (error) {
    setAccountStatus(error.message, true);
  }
};

const clearCanvas = (message = '请选择或新建售票项目。') => {
  stopProjectAutoSync();
  resetAutoSaveTimer();
  seatCanvas.innerHTML = '';
  seatGridElement = null;
  seatGridSignature = null;
  delete seatCanvas.dataset.gridSignature;
  const placeholder = document.createElement('p');
  placeholder.className = 'placeholder';
  placeholder.textContent = message;
  seatCanvas.appendChild(placeholder);
  seatElements.clear();
  selectedSeats.clear();
  dragSelectionBase = new Set();
  dragMoved = false;
  pointerDownSeatId = null;
  pointerDownWasSelected = false;
  updateSelectedCount();
  updateWorkspaceAvailability();
  zoneSummaryList.innerHTML = '<li>暂无数据</li>';
  priceLegendList.innerHTML = '<li>暂无数据</li>';
  if (seatTableSearchInput) {
    seatTableSearchInput.value = '';
    seatTableSearchQuery = '';
  }
  setSeatTableStatus('');
  updateTicketingControls();
};

const handleGridPointerDown = (event) => {
  const grid = event.currentTarget;
  const button = event.target.closest('button[data-seat-id]');
  if (!grid || !button || !grid.contains(button)) return;
  event.preventDefault();
  if (!activeProject) return;
  const row = Number(button.dataset.row);
  const col = Number(button.dataset.col) - 1;
  if (Number.isNaN(row) || Number.isNaN(col)) return;
  isDragging = true;
  dragMoved = false;
  dragOrigin = { row, col };
  dragSelectionBase = new Set(selectedSeats);
  pointerDownSeatId = button.dataset.seatId;
  pointerDownWasSelected = selectedSeats.has(pointerDownSeatId);
  if (!pointerDownWasSelected) {
    selectedSeats.add(pointerDownSeatId);
  }
  updateSelectedCount();
  refreshSelectionStyles();
};

const handleGridPointerOver = (event) => {
  if (!isDragging || !dragOrigin || !activeProject) return;
  const grid = event.currentTarget;
  const button = event.target.closest('button[data-seat-id]');
  if (!grid || !button || !grid.contains(button)) return;
  const row = Number(button.dataset.row);
  const col = Number(button.dataset.col) - 1;
  if (Number.isNaN(row) || Number.isNaN(col)) return;
  dragMoved = true;
  selectedSeats.clear();
  dragSelectionBase.forEach((key) => selectedSeats.add(key));
  const minRow = Math.min(dragOrigin.row, row);
  const maxRow = Math.max(dragOrigin.row, row);
  const minCol = Math.min(dragOrigin.col, col);
  const maxCol = Math.max(dragOrigin.col, col);
  for (let r = minRow; r <= maxRow; r += 1) {
    for (let c = minCol; c <= maxCol; c += 1) {
      selectedSeats.add(seatKey(r, c));
    }
  }
  updateSelectedCount();
  refreshSelectionStyles();
};

const bindSeatGridEvents = (grid) => {
  if (!grid || grid.dataset.bound === 'true') return;
  grid.dataset.bound = 'true';
  grid.addEventListener('pointerdown', handleGridPointerDown);
  grid.addEventListener('pointerover', handleGridPointerOver);
};

const buildSeatGrid = (force = false) => {
  if (!activeProject) {
    clearCanvas();
    return;
  }
  const { rows, cols } = activeProject;
  const signature = `${rows}x${cols}`;
  if (!force && seatGridElement && seatGridSignature === signature) {
    updateAllSeatElements();
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
      const seatEl = document.createElement('button');
      seatEl.type = 'button';
      seatEl.className = 'seat-button';
      seatEl.dataset.row = String(row);
      seatEl.dataset.col = String(col + 1);
      seatEl.dataset.seatId = id;
      seatEl.textContent = extractSeatNumber(seat, String(col + 1));
      seatEl.title = `行 ${row + 1} / 列 ${col + 1}`;

      fragment.appendChild(seatEl);
      seatElements.set(id, seatEl);
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
  updateAllSeatElements();
};

const resetSelection = () => {
  selectedSeats.clear();
  updateSelectedCount();
  dragSelectionBase = new Set();
  dragMoved = false;
  pointerDownSeatId = null;
  pointerDownWasSelected = false;
  refreshSelectionStyles();
};

const updateWorkspaceAvailability = () => {
  const hasProject = Boolean(activeProject);
  inputProjectName.disabled = !hasProject;
  priceInput.disabled = !hasProject;
  btnDeleteProject.disabled = !hasProject;
  const hasSelection = hasProject && selectedSeats.size > 0;
  btnApplyPrice.disabled = !hasSelection;
  btnDisableSeats.disabled = !hasSelection;
  btnResetSelection.disabled = !hasSelection;
  selectTicketingMode.disabled = !hasProject;
  btnApplyTicketing.disabled = !hasProject;
  btnRegenerateTicketing.disabled = !hasProject;
  if (btnCancelTicketing) {
    btnCancelTicketing.disabled = !hasProject;
  }
  btnRefreshSeatTable.disabled = !hasProject;
  if (btnExportProject) {
    btnExportProject.disabled = !hasProject;
  }
  if (btnImportProject) {
    btnImportProject.disabled = !hasProject;
  }
  if (btnSyncProject) {
    btnSyncProject.disabled = !hasProject;
  }
  if (seatTableSearchInput) {
    seatTableSearchInput.disabled = !hasProject;
  }
  if (!hasProject) {
    sequenceConfigSection.classList.add('hidden');
    setTicketingStatus('');
    setSeatTableStatus('');
  }
};

const fetchProjects = async () => {
  try {
    const response = await authFetch('/api/projects');
    if (!response.ok) throw new Error('无法获取项目列表');
    const data = await response.json();
    projects = data.projects || [];
    renderProjectList();
    renderCheckinProjects();
  } catch (error) {
    setStatus(error.message, true);
    if (activeProject) {
      scheduleProjectAutoSync();
    }
  }
};

const loadMerchProducts = async ({ silent = false } = {}) => {
  if (!merchProductListEl) return;
  try {
    const response = await authFetch('/api/merch/products');
    if (!response.ok) throw new Error('无法获取商品列表');
    const data = await response.json();
    merchProducts = data.products || [];
    renderMerchProducts();
  } catch (error) {
    if (!silent) {
      setMerchFormStatus(error.message, true);
    } else {
      console.warn('[merch] refresh products failed:', error);
    }
  }
};

const loadPresaleSummary = async ({ silent = false } = {}) => {
  if (!presaleSummaryTableBody) return;
  try {
    const response = await authFetch('/api/merch/presale/summary');
    if (!response.ok) throw new Error('无法获取预售统计');
    const data = await response.json().catch(() => ({}));
    merchPresaleSummary = data.summary || [];
    renderPresaleSummary();
    renderMerchProducts();
    if (!silent) setPresaleSummaryStatus('已刷新预售统计。');
  } catch (error) {
    if (!silent) {
      setPresaleSummaryStatus(error.message, true);
    } else {
      console.warn('[merch] refresh presale summary failed:', error);
    }
  }
};

const setVoucherAdminStatus = (message, isError = false) => {
  if (!voucherAdminStatus) return;
  voucherAdminStatus.textContent = message || '';
  voucherAdminStatus.style.color = isError ? '#d94848' : '#1f76d0';
};

const normalizeVoucherCode = (raw) => {
  if (typeof raw !== 'string') return '';
  return raw.trim().toUpperCase();
};

const updateVoucherAdminButtons = (voucher) => {
  const confirmValue = normalizeVoucherCode(inputVoucherConfirm?.value || '');
  const expected = normalizeVoucherCode(activeVoucherAdminCode || '');
  const confirmed = Boolean(expected && confirmValue === expected);

  const status = voucher?.status || '';
  const canReplace = confirmed && status === 'issued';
  const canUndoRedeem = confirmed && status === 'redeemed';
  const canVoid = confirmed && status === 'issued';
  const canRefund = confirmed && status === 'issued';

  if (btnVoucherReplace) btnVoucherReplace.disabled = !canReplace;
  if (btnVoucherUndoRedeem) btnVoucherUndoRedeem.disabled = !canUndoRedeem;
  if (btnVoucherVoid) btnVoucherVoid.disabled = !canVoid;
  if (btnVoucherRefund) btnVoucherRefund.disabled = !canRefund;
};

const renderVoucherAdminInfo = (voucher) => {
  if (!voucherAdminInfo) return;
  if (!voucher) {
    voucherAdminInfo.textContent = '未加载到预购券信息。';
    return;
  }
  const status = voucher.status || '-';
  const lines = [];
  lines.push(`<strong>券码：</strong> ${voucher.code || '-'}`);
  lines.push(`<strong>状态：</strong> ${status}`);
  lines.push(`<strong>订单号：</strong> ${voucher.orderNumber || '-'} <span class="hint">(${voucher.orderId || '-'})</span>`);
  lines.push(`<strong>签发：</strong> ${voucher.createdBy || '-'} @ ${voucher.createdAt ? new Date(voucher.createdAt).toLocaleString() : '-'}`);
  if (voucher.redeemedAt) {
    lines.push(
      `<strong>核销：</strong> ${voucher.redeemedBy || '-'} @ ${new Date(voucher.redeemedAt).toLocaleString()}`
    );
  }
  if (voucher.replacedBy) {
    lines.push(`<strong>换码：</strong> 已换为 ${voucher.replacedBy}`);
  }
  if (voucher.voidedAt) {
    lines.push(`<strong>作废：</strong> ${voucher.voidedBy || '-'} @ ${new Date(voucher.voidedAt).toLocaleString()}`);
  }
  if (voucher.refundedAt) {
    lines.push(
      `<strong>退款：</strong> ${voucher.refundedBy || '-'} @ ${new Date(voucher.refundedAt).toLocaleString()}`
    );
  }
  const items = Array.isArray(voucher.items) ? voucher.items : [];
  if (items.length) {
    const list = items
      .map(
        (item, idx) =>
          `<div><span class="hint">${idx + 1}.</span> ${item.name || '-'} ×${item.quantity || 0}（${formatCurrency(
            item.unitPrice || 0
          )}）</div>`
      )
      .join('');
    lines.push('<hr/>');
    lines.push('<strong>商品：</strong>');
    lines.push(list);
    lines.push(
      `<div class="mt-6"><span class="hint">总金额：</span>${formatCurrency(
        voucher.totalBefore || 0
      )}，<span class="hint">应付：</span>${formatCurrency(voucher.totalAfter || 0)}</div>`
    );
  }
  voucherAdminInfo.innerHTML = lines.join('<br/>');
};

const fetchVoucher = async (code) => {
  const normalized = normalizeVoucherCode(code);
  if (!normalized) throw new Error('券码无效');
  const response = await authFetch(`/api/merch/vouchers/${encodeURIComponent(normalized)}?ts=${Date.now()}`);
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || '无法获取预购券信息');
  }
  const data = await response.json();
  return data.voucher;
};

const openVoucherAdminDialog = async (code) => {
  activeVoucherAdminCode = normalizeVoucherCode(code);
  activeVoucherAdminVoucher = null;
  if (inputVoucherNewCode) inputVoucherNewCode.value = '';
  if (inputVoucherReason) inputVoucherReason.value = '';
  if (inputVoucherConfirm) inputVoucherConfirm.value = '';
  setVoucherAdminStatus('');
  renderVoucherAdminInfo(null);
  updateVoucherAdminButtons(null);
  openDialog(dialogVoucherAdmin);
  try {
    const voucher = await fetchVoucher(activeVoucherAdminCode);
    activeVoucherAdminVoucher = voucher;
    renderVoucherAdminInfo(voucher);
    updateVoucherAdminButtons(voucher);
    if (inputVoucherConfirm) inputVoucherConfirm.focus();
  } catch (error) {
    setVoucherAdminStatus(error.message, true);
    voucherAdminInfo.textContent = error.message;
  }
};

const runVoucherAdminAction = async ({ code, endpoint, payload, successMessage }) => {
  const normalized = normalizeVoucherCode(code);
  const response = await authFetch(`/api/merch/vouchers/${encodeURIComponent(normalized)}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || '操作失败');
  }
  return response.json().catch(() => ({}));
};

const refreshVoucherAdminDialog = async () => {
  if (!activeVoucherAdminCode) return;
  try {
    const voucher = await fetchVoucher(activeVoucherAdminCode);
    activeVoucherAdminVoucher = voucher;
    renderVoucherAdminInfo(voucher);
    updateVoucherAdminButtons(voucher);
    setVoucherAdminStatus('已刷新。');
  } catch (error) {
    setVoucherAdminStatus(error.message, true);
  }
};

const loadCheckoutModes = async ({ silent = false } = {}) => {
  if (!checkoutModeTableBody) return;
  try {
    const response = await authFetch('/api/merch/modes');
    if (!response.ok) throw new Error('无法获取结账模式');
    const data = await response.json();
    checkoutModes = data.modes || [];
    renderCheckoutModes();
    if (selectOrdersMode) {
      const current = selectOrdersMode.value;
      selectOrdersMode.innerHTML = '<option value=\"\">全部</option>' + checkoutModes.map((m) => `<option value=\"${m.id}\">${m.name}</option>`).join('');
      if (current) selectOrdersMode.value = current;
    }
  } catch (error) {
    if (!silent) {
      setModeFormStatus(error.message, true);
    } else {
      console.warn('[merch] refresh checkout modes failed:', error);
    }
    syncOrderCheckoutSelect();
  }
};

const loadMerchOrders = async ({ silent = false } = {}) => {
  if (!merchOrdersTableBody) return;
  try {
    const params = new URLSearchParams();
    if (inputOrdersSince?.value) params.set('since', Date.parse(inputOrdersSince.value));
    if (inputOrdersUntil?.value) params.set('until', Date.parse(inputOrdersUntil.value) + 24 * 3600 * 1000);
    if (inputOrdersHandler?.value) params.set('handler', inputOrdersHandler.value.trim());
    if (selectOrdersMode?.value) params.set('mode', selectOrdersMode.value);
    if (inputOrdersKeyword?.value) params.set('keyword', inputOrdersKeyword.value.trim());
    params.set('limit', ORDERS_PAGE_SIZE);
    params.set('offset', (ordersPage - 1) * ORDERS_PAGE_SIZE);
    const response = await authFetch(`/api/merch/orders?${params.toString()}`);
    if (!response.ok) throw new Error('无法获取销售记录');
    const data = await response.json();
    merchOrders = data.orders || [];
    ordersTotal = Number(data.total) || merchOrders.length;
    selectedOrderIds = new Set(
      merchOrders.filter((order) => selectedOrderIds.has(order.id)).map((order) => order.id)
    );
    renderMerchOrders();
    updateOrdersPagination();
    if (!silent) showToast('销售记录已更新', 'success');
  } catch (error) {
    if (silent) {
      console.warn('[merch] refresh orders failed:', error);
      return;
    }
    merchOrdersTableBody.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
  }
};

const refreshMerchData = async ({ silent = false } = {}) => {
  if (merchRefreshInFlight) return;
  merchRefreshInFlight = true;
  try {
    await Promise.all([
      loadMerchProducts({ silent }),
      loadCheckoutModes({ silent }),
      loadMerchOrders({ silent }),
      loadPresaleSummary({ silent }),
    ]);
  } finally {
    merchRefreshInFlight = false;
  }
};

const stopMerchAutoRefresh = () => {
  if (merchAutoRefreshTimer) {
    clearInterval(merchAutoRefreshTimer);
    merchAutoRefreshTimer = null;
  }
};

const startMerchAutoRefresh = () => {
  if (merchAutoRefreshTimer || !merchProductListEl) return;
  merchAutoRefreshTimer = setInterval(() => {
    if (activeView !== 'merch') {
      stopMerchAutoRefresh();
      return;
    }
    refreshMerchData({ silent: true });
  }, MERCH_REFRESH_INTERVAL_MS);
};

const renderProjectList = () => {
  projectListEl.innerHTML = '';
  if (!projects.length) {
    const placeholder = document.createElement('li');
    placeholder.className = 'project-list__empty';
    placeholder.textContent = '尚未创建售票项目。';
    projectListEl.appendChild(placeholder);
    return;
  }
  projects
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((project) => {
      const item = projectItemTemplate.content.firstElementChild.cloneNode(true);
      item.dataset.projectId = project.id;
      item.querySelector('.project-list__name').textContent = project.name;
      item.querySelector(
        '.project-list__stats'
      ).textContent = `${project.rows}×${project.cols}，可售座位 ${project.availableSeats}`;
      const openBtn = item.querySelector('.project-list__open');
      openBtn.addEventListener('click', () => selectProject(project.id));
      if (activeProject && activeProject.id === project.id) {
        item.classList.add('project-list__item--active');
        openBtn.textContent = '已打开';
        openBtn.disabled = true;
      }
      projectListEl.appendChild(item);
    });
};

const selectProject = async (projectId) => {
  stopProjectAutoSync();
  resetAutoSaveTimer();
  if (hasPendingChanges()) {
    await saveActiveProject({ manual: false, reason: 'auto' });
  }
  try {
    const response = await authFetch(`/api/projects/${projectId}`);
    if (!response.ok) throw new Error('项目不存在或已删除');
    const data = await response.json();
    activeProject = data.project;
    ensureActiveProjectMetadata();
    recomputeSeatLabels();
    modifiedSeats.clear();
    selectedSeats.clear();
    if (seatTableSearchInput) {
      seatTableSearchInput.value = '';
      seatTableSearchQuery = '';
    }
    updateSelectedCount();
    inputProjectName.value = activeProject.name;
    btnDeleteProject.disabled = false;
    workspaceHint.textContent = `当前项目：${activeProject.rows} 行 × ${activeProject.cols} 列。座位编号会自动生成。`;
    buildSeatGrid();
    updateTicketingControls();
    refreshSeatTable({ resetPage: true });
    setSeatTableStatus('');
    setTicketingStatus('');
    setAccountStatus('');
    updateWorkspaceAvailability();
    updateSaveButtonState();
    renderProjectList();
    joinSocketRoom(projectId);
    scheduleProjectAutoSync();
    setStatus(`已打开项目「${activeProject.name}」。`);
    loadTicketRules();
    loadTicketCoupons();
  } catch (error) {
    setStatus(error.message, true);
  }
};

const joinSocketRoom = (projectId) => {
  socket.emit('project:join', { projectId }, (resp) => {
    if (!resp.ok) {
      setStatus(resp.message || '无法加入项目实时频道', true);
    }
  });
};

const applyToSelectedSeats = (callback) => {
  if (!activeProject) {
    setStatus('请先选择项目。', true);
    return false;
  }
  if (!selectedSeats.size) {
    setStatus('请先选中至少一个座位。', true);
    return false;
  }
  let changed = false;
  const affectedRows = new Set();
  for (const id of selectedSeats) {
    const seat = activeProject.seats[id];
    if (seat) {
      callback(seat, id);
      changed = true;
      if (Number.isInteger(seat.row)) {
        affectedRows.add(seat.row);
      }
    }
  }
  if (!changed) {
    updateSaveButtonState();
    return false;
  }
  recomputeSeatLabels();
  refreshPriceLegend();
  const seatIdsToUpdate = collectSeatIdsForRows(affectedRows);
  if (seatIdsToUpdate.length) {
    refreshSeatElements(seatIdsToUpdate);
  } else {
    refreshSeatElements(selectedSeats);
  }
  updateZoneSummary();
  updateSaveButtonState();
  scheduleAutoSave();
  return true;
};

if (btnApplyPrice) btnApplyPrice.addEventListener('click', () => {
  const priceValue = Number(priceInput.value);
  if (!Number.isFinite(priceValue) || priceValue < 0) {
    setStatus('票价必须是非负数字。', true);
    return;
  }
  const altered = applyToSelectedSeats((seat, id) => {
    seat.status = 'available';
    seat.price = priceValue;
    ensureLocalPriceColor(priceValue);
    modifiedSeats.set(id, {
      row: seat.row,
      col: seat.col,
      status: 'available',
      price: priceValue,
    });
  });
  if (altered) {
    setStatus('已设置票价，请保存以同步。');
    resetSelection();
    refreshSeatTable();
  }
});

if (btnDisableSeats) btnDisableSeats.addEventListener('click', () => {
  const altered = applyToSelectedSeats((seat, id) => {
    seat.status = 'disabled';
    seat.price = null;
    seat.ticketCode = null;
    seat.ticketNumber = null;
    seat.ticketSequenceValue = null;
    seat.seatLabel = null;
    modifiedSeats.set(id, {
      row: seat.row,
      col: seat.col,
      status: 'disabled',
      price: null,
    });
  });
  if (altered) {
    setStatus('已禁用选中座位，请保存以同步。');
    resetSelection();
    refreshSeatTable();
  }
});

const applyBatchStatus = () => {
  if (!activeProject) {
    setStatus('请先选择项目。', true);
    return;
  }
  const rowStart = Number(inputBatchRowStart?.value) || null;
  const rowEnd = Number(inputBatchRowEnd?.value) || null;
  const status = selectBatchStatus?.value;
  if (!status) {
    setStatus('请选择目标状态。', true);
    return;
  }
  const priceSet = new Set(
    (inputBatchPrice?.value || '')
      .split(',')
      .map((p) => Number(p.trim()))
      .filter((n) => Number.isFinite(n))
  );
  let changed = false;
  const affectedRows = new Set();
  let affectedSeats = 0;
  Object.entries(activeProject.seats || {}).forEach(([id, seat]) => {
    const row = seat.row + 1;
    if (rowStart && row < rowStart) return;
    if (rowEnd && row > rowEnd) return;
    if (priceSet.size && (!Number.isFinite(Number(seat.price)) || !priceSet.has(Number(seat.price)))) return;
    seat.status = status;
    if (status === 'disabled') {
      seat.price = null;
      seat.ticketCode = null;
      seat.ticketNumber = null;
      seat.ticketSequenceValue = null;
      seat.seatLabel = null;
      resetSeatCheckinState(seat);
    } else if (status === 'available' && seat.price != null) {
      ensureLocalPriceColor(seat.price);
    }
    modifiedSeats.set(id, { row: seat.row, col: seat.col, status: seat.status, price: seat.price });
    affectedRows.add(seat.row);
    changed = true;
    affectedSeats += 1;
  });
  if (changed) {
    recomputeSeatLabels();
    const seatIdsToUpdate = collectSeatIdsForRows(affectedRows);
    refreshSeatElements(seatIdsToUpdate);
    updateZoneSummary();
    updateSaveButtonState();
    scheduleAutoSave();
    setStatus(`批量更新已应用，影响 ${affectedSeats} 个座位，请保存以同步。`);
    showToast(`批量更新 ${affectedSeats} 个座位`, 'success');
    refreshSeatTable();
  } else {
    setStatus('未找到符合条件的座位。', true);
  }
};

if (btnApplyBatchStatus) {
  btnApplyBatchStatus.addEventListener('click', () => applyBatchStatus());
}
if (btnResetSelection) btnResetSelection.addEventListener('click', () => {
  resetSelection();
});

if (seatTableBody) seatTableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.getAttribute('data-action');
  const rowEl = button.closest('tr');
  if (!rowEl) return;
  const seatId = rowEl.dataset.seatId;
  const seat = activeProject?.seats?.[seatId];
  if (!seatId || !seat) return;

  if (action === 'detail') {
    if (dialogSeatDetail && seatDetailBody) {
      const detailHtml = `
        <p><strong>座位：</strong>${seat.seatLabel || `${seat.row + 1}排${seat.col + 1}号`}</p>
        <p><strong>状态：</strong>${
          SEAT_VIEW_STATUS_LABELS[
            seat.checkedInAt && seat.status === 'sold' ? 'checked' : seat.status
          ] || seat.status
        }</p>
        <p><strong>票号：</strong>${seat.ticketNumber || '-'}</p>
        <p><strong>票价：</strong>${seat.price != null ? seat.price : '-'}</p>
        <p><strong>售票时间：</strong>${seat.issuedAt ? new Date(seat.issuedAt).toLocaleString() : '-'}</p>
        <p><strong>售票人：</strong>${seat.soldBy || '-'}</p>
        <p><strong>检票时间：</strong>${seat.checkedInAt ? new Date(seat.checkedInAt).toLocaleString() : '-'}</p>
        <p><strong>检票人：</strong>${seat.checkedInBy || '-'}</p>
      `;
      seatDetailBody.innerHTML = detailHtml;
      dialogSeatDetail.showModal();
      dialogSeatDetail.querySelectorAll('button[value="cancel"]').forEach((btn) =>
        btn.addEventListener('click', () => dialogSeatDetail.close())
      );
    }
    return;
  }

  if (!activeProject) {
    setSeatTableStatus('请先选择项目。', true);
    return;
  }
  if (action !== 'save') return;

  const statusSelect = rowEl.querySelector('select[data-role="status"]');
  const ticketInput = rowEl.querySelector('input[data-role="ticket"]');
  const priceInput = rowEl.querySelector('input[data-role="price"]');
  const checkinSelect = rowEl.querySelector('select[data-role="checkin"]');
  if (!statusSelect || !ticketInput || !priceInput) return;
  const payload = {
    status: statusSelect.value,
    ticketNumber: ticketInput.value.trim(),
  };
  if (checkinSelect) {
    payload.checkinStatus = checkinSelect.value === 'checked' ? 'checked' : 'unchecked';
  }
  const priceValueRaw = priceInput.value.trim();
  if (priceValueRaw === '') {
    payload.price = null;
  } else {
    const numericPrice = Number(priceValueRaw);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setSeatTableStatus('票价必须为非负数字。', true);
      priceInput.focus();
      return;
    }
    payload.price = numericPrice;
  }
  button.disabled = true;
  const originalLabel = button.textContent;
  button.textContent = '保存中...';
  setSeatTableStatus('正在保存...');

  try {
    const response = await authFetch(`/api/projects/${activeProject.id}/seats/${seatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.error || '保存失败');
    }
    const data = await response.json();
    if (data?.seat) {
      const updatedSeat = data.seat;
      activeProject.seats[seatId] = updatedSeat;
      ensureActiveProjectMetadata();

      if (updatedSeat.price != null) {
        ensureLocalPriceColor(updatedSeat.price);
      }
      const affectedRows = new Set();

      if (Number.isInteger(updatedSeat.row)) {
        affectedRows.add(updatedSeat.row);
      }
      recomputeSeatLabels();
      refreshPriceLegend();
      const idsToUpdate = collectSeatIdsForRows(affectedRows);

      if (idsToUpdate.length) {
        refreshSeatElements(idsToUpdate);
      } else {
        refreshSeatElements([seatId]);
      }

      refreshSeatTable();
      updateZoneSummary();
      updateSaveButtonState();
      setSeatTableStatus('已更新座位信息。');
    }

    modifiedSeats.delete(seatId);
  } catch (error) {
    setSeatTableStatus(error.message, true);
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
});
if (btnRefreshInlineCheckins) {
  btnRefreshInlineCheckins.addEventListener('click', () => refreshInlineCheckins());
}
if (btnRefreshSeatTable) btnRefreshSeatTable.addEventListener('click', () => {
  if (!activeProject) {
    setSeatTableStatus('请选择项目后再刷新。', true);
    return;
  }
  setSeatTableStatus('正在同步最新数据...');
  btnRefreshSeatTable.disabled = true;
  syncActiveProject({ silent: false, refreshSeatTable: true, refreshTicketing: false })
    .catch(() => {})
    .finally(() => {
      btnRefreshSeatTable.disabled = false;
      refreshInlineCheckins(true);
    });
});

if (btnExportSeatTable) {
  btnExportSeatTable.addEventListener('click', () => {
    if (!activeProject) {
      setSeatTableStatus('请选择项目后再导出。', true);
      return;
    }
    const rows = [
      ['排号', '座位号', '状态', '票号', '票价'],
    ];
    const seatList = Object.values(activeProject.seats || {}).sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });
    seatList.forEach((seat) => {
      rows.push([
        seat.row + 1,
        seat.seatLabel || `${seat.col + 1}号`,
        SEAT_STATUS_LABELS[seat.status] || seat.status,
        seat.ticketNumber || '',
        seat.price != null ? seat.price : '',
      ]);
    });
    const csv = rows
      .map((cols) =>
        cols
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');
  const safeName = (activeProject.name || 'seat-table').replace(/[^\w\u4e00-\u9fa5-]+/g, '_');
  downloadTextFile(`${safeName}-座位表.csv`, csv, 'text/csv');
  setSeatTableStatus('座位表已导出。');
  });
}

const exportSeats = async (type) => {
  if (!activeProject) {
    setStatus('请选择项目后导出。', true);
    return;
  }
  try {
    const response = await authFetch(`/api/projects/${activeProject.id}/export/${type}`);
    if (!response.ok) throw new Error('导出失败');
    const blob = await response.blob();
    const filename =
      `${(activeProject.name || 'project').replace(/[^\w\u4e00-\u9fa5-]+/g, '_')}-seats.${type}`;
    downloadBlob(filename, blob);
    setStatus(`座位${type.toUpperCase()}已导出。`);
  } catch (error) {
    setStatus(error.message || '导出失败', true);
  }
};

['csv', 'png', 'json'].forEach((type) => {
  document.querySelectorAll(`#btn-export-seats-${type}`).forEach((btn) => {
    btn.addEventListener('click', () => exportSeats(type));
  });
});

// 导出菜单显隐
if (btnExportProjectMenu && exportProjectMenu) {
  btnExportProjectMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = exportProjectMenu.hasAttribute('hidden');
    exportProjectMenu.toggleAttribute('hidden', !isHidden);
  });
  document.addEventListener('click', () => {
    exportProjectMenu.setAttribute('hidden', '');
  });
  exportProjectMenu.addEventListener('click', (e) => e.stopPropagation());
}

if (btnSyncProject) {
  btnSyncProject.addEventListener('click', async () => {
    if (btnSyncProject.disabled) return;
    btnSyncProject.disabled = true;
    await syncActiveProject({ silent: false, refreshSeatTable: false, refreshTicketing: false });
    if (activeProject) {
      btnSyncProject.disabled = false;
    } else {
      updateWorkspaceAvailability();
    }
  });
}

adminTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    updateActiveView(tab.dataset.view || 'seats');
    if ((tab.dataset.view || 'seats') === 'audit') {
      renderAuditLogs();
      renderBackups();
    }
    if ((tab.dataset.view || 'seats') === 'seats') {
      loadTicketRules();
      loadTicketCoupons();
    }
  });
});

if (seatTableSearchInput) {
  seatTableSearchInput.addEventListener('input', (event) => {
    seatTableSearchQuery = event.target.value;
    refreshSeatTable({ fromSearch: true, resetPage: true });
  });
  seatTableSearchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && seatTableSearchInput.value) {
      seatTableSearchInput.value = '';
      seatTableSearchQuery = '';
      refreshSeatTable({ fromSearch: true, resetPage: true });
    }
  });
}

if (btnSeatPrev) {
  btnSeatPrev.addEventListener('click', () => {
    if (seatPage > 1) {
      seatPage -= 1;
      refreshSeatTable();
    }
  });
}

if (btnSeatNext) {
  btnSeatNext.addEventListener('click', () => {
    const totalPages = seatTotal ? Math.ceil(seatTotal / SEAT_PAGE_SIZE) : 1;
    if (seatPage < totalPages) {
      seatPage += 1;
      refreshSeatTable();
    }
  });
}

if (btnCheckinPrev) {
  btnCheckinPrev.addEventListener('click', () => {
    if (checkinPage > 1) {
      checkinPage -= 1;
      renderCheckinPage();
    }
  });
}

if (btnCheckinNext) {
  btnCheckinNext.addEventListener('click', () => {
    const totalPages = checkinTotal ? Math.ceil(checkinTotal / CHECKIN_PAGE_SIZE) : 1;
    if (checkinPage < totalPages) {
      checkinPage += 1;
      renderCheckinPage();
    }
  });
}

if (btnAuditPrev) {
  btnAuditPrev.addEventListener('click', () => {
    if (auditPage > 1) {
      auditPage -= 1;
      renderAuditPage();
    }
  });
}

if (btnAuditNext) {
  btnAuditNext.addEventListener('click', () => {
    const totalPages = auditTotal ? Math.ceil(auditTotal / AUDIT_PAGE_SIZE) : 1;
    if (auditPage < totalPages) {
      auditPage += 1;
      renderAuditPage();
    }
  });
}

if (btnExportProject) {
  btnExportProject.addEventListener('click', async () => {
    if (!activeProject) {
      setSeatTableStatus('请选择项目后再导出。', true);
      return;
    }
    btnExportProject.disabled = true;
    setSeatTableStatus('正在导出项目数据...');
    try {
      const response = await authFetch(`/api/projects/${activeProject.id}/export`);
      if (!response.ok) throw new Error('导出失败');
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (activeProject.name || 'project').replace(/[^\w\u4e00-\u9fa5\-]+/g, '_');
      a.href = url;
      a.download = `${safeName}-${activeProject.id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSeatTableStatus('项目数据已导出。');
    } catch (error) {
      setSeatTableStatus(error.message || '导出失败', true);
    } finally {
      btnExportProject.disabled = false;
    }
  });
}

if (btnImportProject && inputImportFile) {
  btnImportProject.addEventListener('click', () => inputImportFile.click());
  inputImportFile.addEventListener('change', async (event) => {
    if (!activeProject) {
      setSeatTableStatus('请选择项目后再导入。', true);
      inputImportFile.value = '';
      return;
    }
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      setSeatTableStatus('正在导入项目数据...');
      const data = await dangerousJsonRequest(
        `/api/projects/${activeProject.id}/import`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
        { actionLabel: `导入项目「${activeProject.name}」座位数据` }
      );
      if (data?.project) {
        modifiedSeats.clear();
        selectedSeats.clear();
        mergeIncomingProject(data.project, { refreshSeatTable: true, refreshTicketing: true });
        const availableSeats = Object.values(data.project.seats || {}).filter(
          (seat) => seat.status === 'available'
        ).length;
        const summary = {
          id: data.project.id,
          name: data.project.name,
          rows: data.project.rows,
          cols: data.project.cols,
          availableSeats,
          createdAt: data.project.createdAt,
          updatedAt: data.project.updatedAt,
        };
        const existingIndex = projects.findIndex((item) => item.id === data.project.id);
        if (existingIndex >= 0) {
          projects[existingIndex] = { ...projects[existingIndex], ...summary };
        } else {
          projects.push(summary);
        }
        renderProjectList();
        updateSelectedCount();
        updateSaveButtonState();
        scheduleProjectAutoSync();
        setSeatTableStatus('导入成功，已更新当前项目。');
        if (data?.undo?.backupFilename) {
          showUndoToast('项目导入已完成', data.undo.backupFilename, { onUndo: restoreFromBackup });
        }
      }
    } catch (error) {
      setSeatTableStatus(error.message || '导入失败', true);
  } finally {
    inputImportFile.value = '';
  }
});
}

if (btnDownloadProjectTemplate) {
  btnDownloadProjectTemplate.addEventListener('click', () => {
    downloadTextFile(
      'project-import-template.json',
      JSON.stringify(PROJECT_IMPORT_TEMPLATE, null, 2),
      'application/json'
    );
    setSeatTableStatus('已下载项目导入模板。');
  });
}

const renderInlineCheckins = (logs = []) => {
  if (!inlineCheckinTable) return;
  inlineCheckinTable.innerHTML = '';
  if (!logs.length) {
    inlineCheckinTable.insertAdjacentHTML('beforeend', '<tr><td colspan="5">暂无记录</td></tr>');
    return;
  }
  const frag = document.createDocumentFragment();
  logs.forEach((log) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}</td>
      <td>${log.seatLabel || `${(log.row ?? 0) + 1}排${(log.col ?? 0) + 1}号`}</td>
      <td>${log.ticketNumber || '-'}</td>
      <td>${log.status === 'success' ? '成功' : (log.message || log.status || '-')}</td>
      <td>${log.checkedInBy || log.handledBy || '-'}</td>
    `;
    frag.appendChild(tr);
  });
  inlineCheckinTable.appendChild(frag);
};

const refreshInlineCheckins = async (silent = false) => {
  if (!inlineCheckinTable) return;
  if (!activeProject) {
    inlineCheckinTable.innerHTML = '<tr><td colspan="5">请选择项目</td></tr>';
    if (inlineCheckinStatus) inlineCheckinStatus.textContent = '';
    return;
  }
  if (!silent && inlineCheckinStatus) inlineCheckinStatus.textContent = '正在获取检票记录...';
  try {
    const res = await authFetch(`/api/checkins?projectId=${activeProject.id}&limit=200`);
    if (!res.ok) throw new Error('获取检票记录失败');
    const data = await res.json();
    renderInlineCheckins(data.logs || []);
    if (inlineCheckinStatus) inlineCheckinStatus.textContent = '';
  } catch (err) {
    renderInlineCheckins([]);
    if (inlineCheckinStatus) inlineCheckinStatus.textContent = err.message || '加载失败';
  }
};

accountForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = accountUsernameInput.value.trim();
  const password = accountPasswordInput.value.trim();
  const role = accountRoleSelect.value;
  if (!username || !password) {
    setAccountStatus('请输入用户名和密码。', true);
    return;
  }
  const normalized = username.toLowerCase();
  if (accounts.some((account) => account.username.toLowerCase() === normalized)) {
    setAccountStatus('该用户名已存在，请更换其他用户名。', true);
    return;
  }
  setAccountStatus('正在添加账号...');
  accountForm.querySelector('button[type="submit"]').disabled = true;
  try {
    const response = await authFetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || '添加失败');
    }
    accountUsernameInput.value = '';
    accountPasswordInput.value = '';
    setAccountStatus('账号添加成功。');
    await fetchAccounts();
  } catch (error) {
    setAccountStatus(error.message, true);
  } finally {
    accountForm.querySelector('button[type="submit"]').disabled = false;
  }
});

accountTableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action="delete"]');
  if (!button) return;
  const rowEl = button.closest('tr');
  if (!rowEl) return;
  const username = rowEl.dataset.username;
  if (!username) return;
  button.disabled = true;
  try {
    const data = await dangerousJsonRequest(
      `/api/accounts/${encodeURIComponent(username)}`,
      { method: 'DELETE' },
      { actionLabel: `删除账号「${username}」` }
    );
    setAccountStatus('账号已删除。');
    await fetchAccounts();
    if (data?.undo?.backupFilename) {
      showUndoToast('账号已删除', data.undo.backupFilename, { onUndo: restoreFromBackup });
    }
  } catch (error) {
    setAccountStatus(error.message, true);
  } finally {
    button.disabled = false;
  }
});

if (btnApplyTicketing) btnApplyTicketing.addEventListener('click', async () => {
  if (!activeProject) {
    setTicketingStatus('请先选择项目。', true);
    return;
  }
  if (!ticketingDirty) {
    setTicketingStatus('没有需要保存的修改。');
    return;
  }
  const mode = selectTicketingMode.value;
  const payload = { mode };
  if (mode === 'sequence') {
    const template = inputTicketTemplate.value.trim();
    const start = inputTicketStart.value.trim();
    if (!template || !/[xX]/.test(template)) {
      setTicketingStatus('请输入正确的票号模板（须包含尾部 X）', true);
      return;
    }
    const match = template.match(/(X+)$/i);
    if (!match) {
      setTicketingStatus('票号模板需以连续的 X 结尾', true);
      return;
    }
    if (!start || start.length !== match[1].length) {
      setTicketingStatus('流水码起始长度需与模板中 X 的数量一致', true);
      return;
    }
    if (!/^\d+$/.test(start)) {
      setTicketingStatus('流水码起始值必须是数字', true);
      return;
    }
    payload.sequence = {
      template: template.toUpperCase(),
      startValue: start,
    };
  }
  btnApplyTicketing.disabled = true;
  if (btnCancelTicketing) {
    btnCancelTicketing.disabled = true;
  }
  setTicketingStatus('正在保存票号配置...');
  try {
    const data = await dangerousJsonRequest(
      `/api/projects/${activeProject.id}/ticketing`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      { actionLabel: '重新生成票号配置' }
    );
    mergeIncomingProject(data.project, {
      refreshSeatTable: true,
      refreshTicketing: true,
    });
    updateSelectedCount();
    updateSaveButtonState();
    setTicketingDirty(false);
    setTicketingStatus('票号配置已保存并重新生成。');
    scheduleProjectAutoSync();
    if (data?.undo?.backupFilename) {
      showUndoToast('票号配置已更新', data.undo.backupFilename, { onUndo: restoreFromBackup });
    }
  } catch (error) {
    setTicketingStatus(error.message, true);
  } finally {
    evaluateTicketingDirty();
    btnApplyTicketing.disabled = ticketingDirty ? false : true;
    if (btnCancelTicketing) {
      btnCancelTicketing.disabled = !ticketingDirty;
    }
  }
});

if (btnCancelTicketing) {
  btnCancelTicketing.addEventListener('click', () => {
    applySnapshotToTicketingInputs();
    setTicketingDirty(false);
    setTicketingStatus('已取消修改。');
    evaluateTicketingDirty();
  });
}

if (btnRegenerateTicketing) btnRegenerateTicketing.addEventListener('click', async () => {
  if (!activeProject) {
    setTicketingStatus('请先选择项目。', true);
    return;
  }
  btnRegenerateTicketing.disabled = true;
  setTicketingStatus('正在重新生成票号...');
  try {
    const data = await dangerousJsonRequest(
      `/api/projects/${activeProject.id}/ticketing/regenerate`,
      { method: 'POST' },
      { actionLabel: '重算全部票号' }
    );
    mergeIncomingProject(data.project, { refreshSeatTable: true, refreshTicketing: true });
    updateSelectedCount();
    updateSaveButtonState();
    setTicketingStatus('票号已重新生成。');
    scheduleProjectAutoSync();
    if (data?.undo?.backupFilename) {
      showUndoToast('票号已重新生成', data.undo.backupFilename, { onUndo: restoreFromBackup });
    }
  } catch (error) {
    setTicketingStatus(error.message, true);
  } finally {
    btnRegenerateTicketing.disabled = false;
  }
});

if (btnSaveProject) btnSaveProject.addEventListener('click', () => {
  saveActiveProject({ manual: true, reason: 'manual' });
});

if (btnDeleteProject) btnDeleteProject.addEventListener('click', async () => {
  if (!activeProject) {
    setStatus('请选择要删除的项目。', true);
    return;
  }
  try {
    const data = await dangerousJsonRequest(
      `/api/projects/${activeProject.id}`,
      { method: 'DELETE' },
      { actionLabel: `删除项目「${activeProject.name}」` }
    );
    activeProject = null;
    stopProjectAutoSync();
    modifiedSeats.clear();
    selectedSeats.clear();
    inputProjectName.value = '';
    clearCanvas();
    updateWorkspaceAvailability();
    updateTicketingControls();
    updateSaveButtonState();
    await fetchProjects();
    setStatus('项目已删除。');
    if (data?.undo?.backupFilename) {
      showUndoToast('项目已删除', data.undo.backupFilename, { onUndo: restoreFromBackup });
    }
  } catch (error) {
    setStatus(error.message, true);
  }
});

if (inputProjectName) inputProjectName.addEventListener('input', () => {
  updateSaveButtonState();
  scheduleAutoSave();
});

if (btnNewProject) btnNewProject.addEventListener('click', () => {
  newProjectNameInput.value = '';
  newProjectRowsInput.value = '';
  newProjectColsInput.value = '';
  setNewProjectStatus('');
  newProjectTicketingMode.value = 'random';
  newProjectSequenceSection.classList.add('hidden');
  newProjectTicketTemplate.value = '';
  newProjectTicketStart.value = '';
  dialogNewProject.showModal();
});

if (btnRefreshMerch) {
  btnRefreshMerch.addEventListener('click', () => {
    refreshMerchData();
  });
}

if (btnRefreshPresaleSummary) {
  btnRefreshPresaleSummary.addEventListener('click', () => {
    loadPresaleSummary({ silent: false });
  });
}

if (btnOpenMerchForm) {
  btnOpenMerchForm.addEventListener('click', () => {
    resetMerchForm();
    openDialog(dialogMerchProduct);
  });
}

if (btnGoCheckoutModes) {
  btnGoCheckoutModes.addEventListener('click', () => {
    if (activeView !== 'merch') {
      updateActiveView('merch');
    }
    resetModeForm();
    openDialog(dialogModeForm);
  });
}

if (btnOpenTicketCoupons) {
  btnOpenTicketCoupons.addEventListener('click', async () => {
    if (!activeProject) {
      showToast('请先打开一个项目', 'error');
      return;
    }
    await loadTicketRules();
    await loadTicketCoupons();
    openDialog(dialogTicketCoupons);
  });
}

if (btnNewTicketRule) {
  btnNewTicketRule.addEventListener('click', () => {
    if (!activeProject) return;
    resetTicketRuleForm();
    openDialog(dialogTicketRuleForm);
    inputTicketRuleName?.focus();
  });
}

if (ticketRuleTableBody) {
  ticketRuleTableBody.addEventListener('click', async (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const rule = ticketDiscountRules.find((r) => r.id === id);
    if (!rule) return;
    if (btn.dataset.action === 'edit') {
      resetTicketRuleForm();
      if (inputTicketRuleId) inputTicketRuleId.value = rule.id;
      if (inputTicketRuleName) inputTicketRuleName.value = rule.name || '';
      if (inputTicketRuleCount) inputTicketRuleCount.value = String(rule.ticketCount || 1);
      if (inputTicketRuleDiscount) inputTicketRuleDiscount.value = String(rule.discountRate || 10);
      if (inputTicketRulePrices) {
        inputTicketRulePrices.value = Array.isArray(rule.allowedPrices) ? rule.allowedPrices.join(',') : '';
      }
      if (selectTicketRuleEnabled) selectTicketRuleEnabled.value = rule.enabled === false ? 'false' : 'true';
      openDialog(dialogTicketRuleForm);
      return;
    }
    if (btn.dataset.action === 'delete') {
      if (!confirmDanger(`确认删除折扣规则「${rule.name}」？`)) return;
      btn.disabled = true;
      try {
        const resp = await authFetch(`/api/projects/${activeProject.id}/ticket-discounts/${rule.id}`, {
          method: 'DELETE',
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(data.error || '删除失败');
        showToast('规则已删除', 'success');
        await loadTicketRules();
      } catch (error) {
        showToast(error.message || '删除失败', 'error');
      } finally {
        btn.disabled = false;
      }
    }
  });
}

if (ticketRuleForm) {
  ticketRuleForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!activeProject) return;
    if (ticketRuleFormStatus) ticketRuleFormStatus.textContent = '正在保存...';
    try {
      const payload = {
        id: inputTicketRuleId?.value || undefined,
        name: inputTicketRuleName?.value || '',
        ticketCount: Number(inputTicketRuleCount?.value || 1),
        discountRate: Number(inputTicketRuleDiscount?.value || 10),
        allowedPrices: inputTicketRulePrices?.value || '',
        enabled: (selectTicketRuleEnabled?.value || 'true') !== 'false',
      };
      const resp = await authFetch(`/api/projects/${activeProject.id}/ticket-discounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || '保存失败');
      if (ticketRuleFormStatus) ticketRuleFormStatus.textContent = '已保存。';
      showToast('规则已保存', 'success');
      closeDialog(dialogTicketRuleForm);
      await loadTicketRules();
    } catch (error) {
      if (ticketRuleFormStatus) ticketRuleFormStatus.textContent = error.message || '保存失败';
      showToast(error.message || '保存失败', 'error');
    }
  });
}

if (btnIssueTicketCoupons) {
  btnIssueTicketCoupons.addEventListener('click', async () => {
    if (!activeProject) return;
    const ruleId = selectTicketRule?.value || '';
    if (!ruleId) {
      showToast('请选择折扣规则', 'error');
      return;
    }
    const rawCodes = String(inputTicketCouponCodes?.value || '');
    const codes = rawCodes
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const uniqueCodes = Array.from(new Set(codes.map((c) => c.toUpperCase())));
    if (codes.length !== uniqueCodes.length) {
      showToast('自定义券码存在重复行，已自动去重', 'info');
    }
    let quantity = Math.max(1, Math.min(200, Math.floor(Number(inputTicketCouponQuantity?.value) || 1)));
    if (uniqueCodes.length > quantity) {
      quantity = Math.min(200, uniqueCodes.length);
      if (inputTicketCouponQuantity) inputTicketCouponQuantity.value = String(quantity);
    }
    btnIssueTicketCoupons.disabled = true;
    setTicketCouponStatus('正在签发...');
    try {
      const resp = await authFetch(`/api/projects/${activeProject.id}/ticket-coupons/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId, quantity, codes: uniqueCodes }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || '签发失败');
      const issuedCodes = (data.coupons || []).map((c) => c.code);
      const preview = issuedCodes.slice(0, 12).join('，');
      showToast(`已签发 ${data.coupons?.length || 0} 张`, 'success');
      setTicketCouponStatus(preview ? `已签发：${preview}${issuedCodes.length > 12 ? '…' : ''}` : '签发完成。');
      if (inputTicketCouponCodes) inputTicketCouponCodes.value = '';
      await loadTicketCoupons();
    } catch (error) {
      setTicketCouponStatus(error.message, true);
      showToast(error.message || '签发失败', 'error');
    } finally {
      btnIssueTicketCoupons.disabled = false;
    }
  });
}

if (btnRefreshTicketCoupons) {
  btnRefreshTicketCoupons.addEventListener('click', () => loadTicketCoupons());
}

if (inputTicketCouponSearch) {
  inputTicketCouponSearch.addEventListener('input', () => loadTicketCoupons());
}

if (selectTicketCouponStatus) {
  selectTicketCouponStatus.addEventListener('change', () => loadTicketCoupons());
}

if (ticketCouponTableBody) {
  ticketCouponTableBody.addEventListener('click', async (event) => {
    const btn = event.target.closest('button[data-action="void"]');
    if (!btn) return;
    const code = btn.dataset.code;
    if (!code) return;
    if (!confirmDanger(`确认作废优惠券 ${code}？`)) return;
    const reason = window.prompt('作废原因（可选）：', '') || '';
    btn.disabled = true;
    try {
      const resp = await authFetch(`/api/projects/${activeProject.id}/ticket-coupons/${encodeURIComponent(code)}/void`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true, reason }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || '作废失败');
      showToast('已作废优惠券', 'success');
      await loadTicketCoupons();
    } catch (error) {
      showToast(error.message || '作废失败', 'error');
    } finally {
      btn.disabled = false;
    }
  });
}

if (btnRefreshOrders) {
  btnRefreshOrders.addEventListener('click', () => {
    loadMerchOrders();
  });
}

if (merchOrdersTableBody) {
  merchOrdersTableBody.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const orderId = button.dataset.id;
    if (!orderId) return;
    const order = merchOrders.find((item) => item.id === orderId);
    if (!order) return;
    if (button.dataset.action === 'open-voucher') {
      if (order.voucherCode) {
        await openVoucherAdminDialog(order.voucherCode);
      } else {
        showToast('该记录没有预购券码', 'error');
      }
      return;
    }
    if (button.dataset.action === 'edit-order') {
      populateOrderForm(order);
      openDialog(dialogOrderForm);
      return;
    }
    if (button.dataset.action === 'statement-order') {
      await exportOrderStatement(orderId);
      return;
    }
    if (button.dataset.action === 'delete-order') {
      button.disabled = true;
      try {
        const data = await dangerousJsonRequest(
          `/api/merch/orders/${orderId}`,
          { method: 'DELETE' },
          { actionLabel: `删除销售记录 ${order.orderNumber || orderId}` }
        );
        setOrderFormStatus('记录已删除。');
        await loadMerchOrders();
        if (data?.undo?.backupFilename) {
          showUndoToast('销售记录已删除', data.undo.backupFilename, { onUndo: restoreFromBackup });
        }
      } catch (error) {
        setOrderFormStatus(error.message, true);
      } finally {
        button.disabled = false;
      }
    }
  });
}

if (inputVoucherConfirm) {
  inputVoucherConfirm.addEventListener('input', () => {
    updateVoucherAdminButtons(activeVoucherAdminVoucher);
  });
}

if (btnVoucherReplace) {
  btnVoucherReplace.addEventListener('click', async () => {
    if (!activeVoucherAdminCode) return;
    btnVoucherReplace.disabled = true;
    try {
      setVoucherAdminStatus('正在换码/重发...');
      const reason = typeof inputVoucherReason?.value === 'string' ? inputVoucherReason.value.trim() : '';
      const newCode = typeof inputVoucherNewCode?.value === 'string' ? inputVoucherNewCode.value.trim() : '';
      const data = await runVoucherAdminAction({
        code: activeVoucherAdminCode,
        endpoint: 'replace',
        payload: { confirm: true, reason, newCode },
      });
      const nextVoucher = data?.voucher || null;
      if (nextVoucher?.code) {
        activeVoucherAdminCode = nextVoucher.code;
        activeVoucherAdminVoucher = nextVoucher;
        if (inputVoucherConfirm) inputVoucherConfirm.value = '';
        showToast(`换码完成，新券码：${nextVoucher.code}`, 'success');
      } else {
        showToast('换码完成', 'success');
      }
      await refreshMerchData({ silent: true });
      await refreshVoucherAdminDialog();
      setVoucherAdminStatus('换码/重发完成。');
    } catch (error) {
      setVoucherAdminStatus(error.message, true);
      showToast(error.message || '操作失败', 'error');
    } finally {
      btnVoucherReplace.disabled = false;
    }
  });
}

if (btnVoucherUndoRedeem) {
  btnVoucherUndoRedeem.addEventListener('click', async () => {
    if (!activeVoucherAdminCode) return;
    btnVoucherUndoRedeem.disabled = true;
    try {
      setVoucherAdminStatus('正在撤销核销...');
      const reason = typeof inputVoucherReason?.value === 'string' ? inputVoucherReason.value.trim() : '';
      await runVoucherAdminAction({
        code: activeVoucherAdminCode,
        endpoint: 'undo-redeem',
        payload: { confirm: true, reason },
      });
      showToast('已撤销核销', 'success');
      await refreshMerchData({ silent: true });
      await refreshVoucherAdminDialog();
      setVoucherAdminStatus('已撤销核销。');
    } catch (error) {
      setVoucherAdminStatus(error.message, true);
      showToast(error.message || '操作失败', 'error');
    } finally {
      btnVoucherUndoRedeem.disabled = false;
    }
  });
}

if (btnVoucherVoid) {
  btnVoucherVoid.addEventListener('click', async () => {
    if (!activeVoucherAdminCode) return;
    if (!window.confirm(`确认作废预购券 ${activeVoucherAdminCode}？该操作不可逆（可通过换码/重发处理遗失/印错）。`)) {
      return;
    }
    btnVoucherVoid.disabled = true;
    try {
      setVoucherAdminStatus('正在作废...');
      const reason = typeof inputVoucherReason?.value === 'string' ? inputVoucherReason.value.trim() : '';
      await runVoucherAdminAction({
        code: activeVoucherAdminCode,
        endpoint: 'void',
        payload: { confirm: true, reason },
      });
      showToast('已作废预购券', 'success');
      await refreshMerchData({ silent: true });
      await refreshVoucherAdminDialog();
      setVoucherAdminStatus('已作废。');
    } catch (error) {
      setVoucherAdminStatus(error.message, true);
      showToast(error.message || '操作失败', 'error');
    } finally {
      btnVoucherVoid.disabled = false;
    }
  });
}

if (btnVoucherRefund) {
  btnVoucherRefund.addEventListener('click', async () => {
    if (!activeVoucherAdminCode) return;
    if (!window.confirm(`确认对预购券 ${activeVoucherAdminCode} 做“退款”标记？将阻止后续核销。`)) return;
    btnVoucherRefund.disabled = true;
    try {
      setVoucherAdminStatus('正在退款...');
      const reason = typeof inputVoucherReason?.value === 'string' ? inputVoucherReason.value.trim() : '';
      await runVoucherAdminAction({
        code: activeVoucherAdminCode,
        endpoint: 'refund',
        payload: { confirm: true, reason },
      });
      showToast('已标记退款', 'success');
      await refreshMerchData({ silent: true });
      await refreshVoucherAdminDialog();
      setVoucherAdminStatus('已退款。');
    } catch (error) {
      setVoucherAdminStatus(error.message, true);
      showToast(error.message || '操作失败', 'error');
    } finally {
      btnVoucherRefund.disabled = false;
    }
  });
}

if (btnNewOrder) {
  btnNewOrder.addEventListener('click', () => {
    resetOrderForm();
    openDialog(dialogOrderForm);
    inputOrderItems?.focus();
  });
}

if (btnResetOrderForm) {
  btnResetOrderForm.addEventListener('click', () => resetOrderForm());
}

if (btnRefreshCheckins) {
  btnRefreshCheckins.addEventListener('click', () => {
    loadCheckinLogs();
  });
}

if (selectCheckinProject) {
  selectCheckinProject.addEventListener('change', () => loadCheckinLogs());
}

if (btnExportCheckins) {
  btnExportCheckins.addEventListener('click', async () => {
    try {
      const params = new URLSearchParams();
      if (selectCheckinProject?.value) params.set('projectId', selectCheckinProject.value);
      const response = await authFetch(`/api/checkins?${params.toString()}`);
      if (!response.ok) throw new Error('导出失败');
      const data = await response.json();
      downloadTextFile(
        `checkins-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(data, null, 2),
        'application/json'
      );
      setCheckinLogStatus('检票记录已导出。');
    } catch (error) {
      setCheckinLogStatus(error.message, true);
    }
  });
}

if (checkinLogTable) {
  checkinLogTable.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="checkin-edit"]');
    if (!button) return;
    const logId = button.dataset.id;
    const log = checkinLogs.find((entry) => entry.id === logId);
    if (!log) return;
    if (inputCheckinTicket) inputCheckinTicket.value = log.ticketNumber || '';
    if (selectCheckinStatus) {
      selectCheckinStatus.value = log.status === 'success' || log.status === 'override' ? 'checked' : 'clear';
    }
    checkinSeatStatus.textContent = `已载入票号 ${log.ticketNumber || ''}`;
    checkinSeatStatus.style.color = '#20639b';
  });
}

if (checkinSeatForm) {
  checkinSeatForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });
  document.getElementById('btn-apply-checkin-seat')?.addEventListener('click', async () => {
    const ticket = inputCheckinTicket.value.trim();
    if (!ticket) {
      checkinSeatStatus.textContent = '请输入票号';
      checkinSeatStatus.style.color = '#ed553b';
      return;
    }
    const action = selectCheckinStatus.value;
    try {
      checkinSeatStatus.textContent = '正在应用...';
      checkinSeatStatus.style.color = '#20639b';
      const data = await dangerousJsonRequest(
        '/api/checkins/seat',
        {
          method: 'POST',
          body: JSON.stringify({ ticketNumber: ticket, action }),
        },
        { actionLabel: `修改检票状态 ${ticket}` }
      );
      checkinSeatStatus.textContent = '已更新检票状态。';
      checkinSeatStatus.style.color = '#20639b';
      inputCheckinTicket.value = '';
      await loadCheckinLogs();
      if (data?.undo?.backupFilename) {
        showUndoToast('检票状态已更新', data.undo.backupFilename, { onUndo: restoreFromBackup });
      }
    } catch (error) {
      checkinSeatStatus.textContent = error.message || '操作失败';
      checkinSeatStatus.style.color = '#ed553b';
    }
  });
}

if (merchOrderForm && inputOrderItems) {
  merchOrderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const items = parseOrderItemsInput(inputOrderItems.value);
      let createdAt = Date.now();
      if (inputOrderTime?.value) {
        const dt = new Date(inputOrderTime.value);
        if (!Number.isNaN(dt.getTime())) {
          createdAt = dt.getTime();
        }
      }
      const payload = {
        items,
        checkoutModeId: selectOrderCheckoutMode?.value || null,
        note: inputOrderNote?.value?.trim() || '',
        handledBy: inputOrderHandler?.value?.trim() || '',
        createdAt,
      };
      const modeId = inputOrderId.value.trim();
      const endpoint = modeId ? `/api/merch/orders/${modeId}` : '/api/merch/orders/manual';
      const method = modeId ? 'PUT' : 'POST';
      setOrderFormStatus('正在保存记录...');
      const response = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || '保存失败');
      }
      await response.json();
      setOrderFormStatus('记录已保存。');
      resetOrderForm();
      closeDialog(dialogOrderForm);
      await loadMerchOrders();
    } catch (error) {
      setOrderFormStatus(error.message, true);
    }
  });
}

if (btnExportOrders) {
  btnExportOrders.addEventListener('click', async () => {
    try {
      const response = await authFetch('/api/merch/orders/export');
      if (!response.ok) throw new Error('导出失败');
      const data = await response.json();
      downloadTextFile(
        `merch-orders-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(data, null, 2),
        'application/json'
      );
      setOrderFormStatus('记录已导出。');
    } catch (error) {
      setOrderFormStatus(error.message, true);
    }
  });
}

if (btnDownloadOrdersTemplate) {
  btnDownloadOrdersTemplate.addEventListener('click', () => {
    downloadTextFile(
      'merch-orders-import-template.json',
      JSON.stringify(ORDERS_IMPORT_TEMPLATE, null, 2),
      'application/json'
    );
    setOrderFormStatus('已下载订单导入模板。');
  });
}

const resolveProductImage = (productId, fallbackPath) => {
  const product = merchProducts.find((p) => p.id === productId);
  const imagePath = product?.imagePath || fallbackPath || null;
  const imageData = product?.imageData || null;
  if (imageData) return imageData;
  if (imagePath) {
    if (String(imagePath).startsWith('http')) return imagePath;
    if (String(imagePath).startsWith('/')) return `${window.location.origin}${imagePath}`;
    return `${window.location.origin}/${imagePath}`;
  }
  return PLACEHOLDER_IMAGE;
};

const buildOrderPdfHtml = (orders = []) => {
  const logo =
    (merchProducts.find((p) => p.imagePath || p.imageData)?.imagePath ||
      merchProducts.find((p) => p.imageData)?.imageData) ||
    '';
  const headerText = activeProject ? `项目：${activeProject.name}` : '文创订单';
  const footerText = `导出时间：${new Date().toLocaleString()}`;
  const rows = orders
    .map((order, index) => {
      const itemsHtml = (order.items || [])
        .map(
          (item) => `
        <div class="item">
          <img src="${resolveProductImage(item.productId, item.imagePath)}" alt="${item.name}" />
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-meta">数量：${item.quantity} | 单价：${formatCurrency(
              item.unitPrice || item.price || 0
            )}</div>
            <div class="item-meta">小计：${formatCurrency(item.subtotal || 0)}</div>
          </div>
        </div>
      `
        )
        .join('');
      return `
      <div class="order-card">
        <div class="order-header">
          <div>编号 ${index + 1} | 流水号：${(order.id || '').slice(0, 8).toUpperCase()}</div>
          <div>${new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div class="order-meta">
          <span>结账模式：${order.checkoutModeName || '原价'}</span>
          <span>操作人：${order.handledBy || '-'}</span>
          <span>金额：${formatCurrency(order.totalAfter)}${
        order.discount ? `（立减 ${formatCurrency(order.discount)}）` : ''
      }</span>
        </div>
        <div class="items">${itemsHtml}</div>
        <div class="order-note">备注：${order.note || '-'}</div>
      </div>`;
    })
    .join('');

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @page { size: A4; margin: 16mm; }
          body { font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif; margin:0; padding:0; color:#111; }
          .header { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
          .header img { height:32px; }
          .footer { font-size:12px; color:#64748b; margin-top:8px; }
          .sheet { width:100%; }
          .order-card {
            page-break-inside: avoid;
            border: 1px solid #d5d9e2;
            border-radius: 10px;
            padding: 12px 14px;
            margin-bottom: 12px;
            background: #fff;
          }
          .order-header { display:flex; justify-content:space-between; font-weight:700; margin-bottom:6px; }
          .order-meta { display:flex; flex-wrap:wrap; gap:12px; font-size: 12px; color:#334155; margin-bottom:8px; }
          .items { display:flex; flex-direction:column; gap:8px; margin-bottom:8px; }
          .item { display:flex; gap:10px; align-items:center; }
          .item img { width:60px; height:60px; object-fit:cover; border:1px solid #e2e8f0; border-radius:6px; }
          .item-name { font-weight:600; }
          .item-meta { font-size:12px; color:#475569; }
          .order-note { font-size:12px; color:#475569; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="header">
            ${logo ? `<img src="${logo}" alt="logo" />` : ''}
            <div>${headerText}</div>
          </div>
          ${rows}
          <div class="footer">${footerText}</div>
        </div>
      </body>
    </html>
  `;
};

const exportOrdersToPdf = async () => {
  try {
    const selected = merchOrders.filter((o) => selectedOrderIds.has(o.id));
    const idsParam = selected.length ? `?ids=${selected.map((o) => o.id).join(',')}` : '';
    const response = await authFetch(`/api/merch/orders/export/pdf${idsParam}`);
    if (!response.ok) throw new Error('导出失败');
    const blob = await response.blob();
    const date = new Date().toISOString().slice(0, 10);
    downloadBlob(`merch-orders-${date}.pdf`, blob, 'application/pdf');
    setOrderFormStatus('PDF 导出完成。');
    showToast('PDF 导出完成', 'success');
  } catch (error) {
    setOrderFormStatus(error.message || '导出失败', true);
    showToast(error.message || '导出失败', 'error');
  }
};

const exportOrderStatement = async (orderId) => {
  if (!orderId) return;
  try {
    const response = await authFetch(`/api/merch/orders/${orderId}/statement.pdf?ts=${Date.now()}`);
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || '导出失败');
    }
    const blob = await response.blob();
    downloadBlob(`merch-statement-${orderId}.pdf`, blob, 'application/pdf');
    showToast('已导出单据', 'success');
  } catch (error) {
    setOrderFormStatus(error.message, true);
  }
};

if (btnImportOrders && inputImportOrders) {
  btnImportOrders.addEventListener('click', () => inputImportOrders.click());
  inputImportOrders.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || !Array.isArray(data.orders)) {
        throw new Error('文件格式不正确');
      }
      const append = window.confirm('是否采用追加方式导入？选择“取消”将覆盖现有记录。');
      setOrderFormStatus('正在导入记录...');
      const response = await authFetch('/api/merch/orders/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: data.orders, mode: append ? 'append' : 'replace' }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || '导入失败');
      }
      await response.json();
      setOrderFormStatus('记录已导入。');
      await loadMerchOrders();
    } catch (error) {
      setOrderFormStatus(error.message, true);
    } finally {
      inputImportOrders.value = '';
    }
  });
}

if (btnExportOrdersMenu && exportOrdersMenu) {
  btnExportOrdersMenu.addEventListener('click', (event) => {
    event.stopPropagation();
    const willShow = exportOrdersMenu.hasAttribute('hidden');
    exportOrdersMenu.toggleAttribute('hidden', !willShow);
  });
  document.addEventListener('click', (event) => {
    if (!exportOrdersMenu || exportOrdersMenu.hasAttribute('hidden')) return;
    if (event.target === exportOrdersMenu || exportOrdersMenu.contains(event.target)) return;
    if (event.target === btnExportOrdersMenu) return;
    exportOrdersMenu.setAttribute('hidden', 'hidden');
  });
  // 选项点击后收起菜单
  ['btn-export-orders', 'btn-export-orders-csv', 'btn-export-orders-xls', 'btn-export-orders-pdf'].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => exportOrdersMenu.setAttribute('hidden', 'hidden'));
      }
    }
  );
}

if (btnExportOrdersPdf) {
  btnExportOrdersPdf.addEventListener('click', () => exportOrdersToPdf());
}

if (btnExportOrdersCsv) {
  btnExportOrdersCsv.addEventListener('click', async () => {
    const params = new URLSearchParams();
    if (inputOrdersSince?.value) params.set('since', Date.parse(inputOrdersSince.value));
    if (inputOrdersUntil?.value) params.set('until', Date.parse(inputOrdersUntil.value) + 24 * 3600 * 1000);
    if (inputOrdersHandler?.value) params.set('handler', inputOrdersHandler.value.trim());
    if (selectOrdersMode?.value) params.set('mode', selectOrdersMode.value);
    if (inputOrdersKeyword?.value) params.set('keyword', inputOrdersKeyword.value.trim());
    try {
      const response = await authFetch(`/api/merch/orders/export/csv?${params.toString()}`);
      if (!response.ok) throw new Error('导出失败');
      const csvText = await response.text();
      const date = new Date().toISOString().slice(0, 10);
      // 纯 CSV 下载
      const bomCsv = csvText.startsWith('\ufeff') ? csvText : `\ufeff${csvText}`; // 加 BOM 防止 Excel 乱码
      downloadBlob(`merch-orders-${date}.csv`, new Blob([bomCsv], { type: 'text/csv;charset=utf-8' }));
      setOrderFormStatus('CSV 导出完成。');
      showToast('CSV 导出完成', 'success');
    } catch (error) {
      setOrderFormStatus(error.message, true);
    }
  });
}

if (btnExportOrdersXls) {
  btnExportOrdersXls.addEventListener('click', async () => {
    const params = new URLSearchParams();
    if (inputOrdersSince?.value) params.set('since', Date.parse(inputOrdersSince.value));
    if (inputOrdersUntil?.value) params.set('until', Date.parse(inputOrdersUntil.value) + 24 * 3600 * 1000);
    if (inputOrdersHandler?.value) params.set('handler', inputOrdersHandler.value.trim());
    if (selectOrdersMode?.value) params.set('mode', selectOrdersMode.value);
    if (inputOrdersKeyword?.value) params.set('keyword', inputOrdersKeyword.value.trim());
    try {
      const response = await authFetch(`/api/merch/orders/export/csv?${params.toString()}`);
      if (!response.ok) throw new Error('导出失败');
      const csvText = await response.text();
      const date = new Date().toISOString().slice(0, 10);
      const bomCsv = csvText.startsWith('\ufeff') ? csvText : `\ufeff${csvText}`;
      const xlsBlob = new Blob([bomCsv], { type: 'application/vnd.ms-excel' });
      downloadBlob(`merch-orders-${date}.xls`, xlsBlob);
      setOrderFormStatus('Excel 导出完成。');
      showToast('Excel 导出完成', 'success');
    } catch (error) {
      setOrderFormStatus(error.message, true);
      showToast(error.message || '导出失败', 'error');
    }
  });
}

if (ordersSelectAll && merchOrdersTableBody) {
  ordersSelectAll.addEventListener('change', (event) => {
    const checked = event.target.checked;
    const currentIds = merchOrders.map((o) => o.id);
    if (checked) {
      currentIds.forEach((id) => selectedOrderIds.add(id));
    } else {
      currentIds.forEach((id) => selectedOrderIds.delete(id));
    }
    renderMerchOrders();
  });
  merchOrdersTableBody.addEventListener('change', (event) => {
    const checkbox = event.target.closest('.order-select');
    if (!checkbox) return;
    const id = checkbox.dataset.id;
    if (!id) return;
    if (checkbox.checked) {
      selectedOrderIds.add(id);
    } else {
      selectedOrderIds.delete(id);
    }
    renderMerchOrders();
  });
}

if (btnApplyOrdersFilter) {
  btnApplyOrdersFilter.addEventListener('click', () => {
    ordersPage = 1;
    loadMerchOrders();
  });
}

if (btnOrdersPrev) {
  btnOrdersPrev.addEventListener('click', () => {
    if (ordersPage > 1) {
      ordersPage -= 1;
      loadMerchOrders({ silent: true });
      showToast(`第 ${ordersPage} 页`, 'info');
    }
  });
}

if (btnOrdersNext) {
  btnOrdersNext.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(ordersTotal / ORDERS_PAGE_SIZE));
    if (ordersPage < totalPages) {
      ordersPage += 1;
      loadMerchOrders({ silent: true });
      showToast(`第 ${ordersPage} 页`, 'info');
    }
  });
}

if (btnClearOrders) {
  btnClearOrders.addEventListener('click', async () => {
    setOrderFormStatus('正在清空记录...');
    try {
      const data = await dangerousJsonRequest(
        '/api/merch/orders/clear',
        { method: 'POST' },
        { actionLabel: '清空全部销售记录' }
      );
      await loadMerchOrders();
      setOrderFormStatus('所有记录已清空。');
      if (data?.undo?.backupFilename) {
        showUndoToast('已清空销售记录', data.undo.backupFilename, { onUndo: restoreFromBackup });
      }
    } catch (error) {
      setOrderFormStatus(error.message, true);
    }
  });
}

if (btnResetMerchForm) {
  btnResetMerchForm.addEventListener('click', () => {
    resetMerchForm();
  });
}

if (btnResetModeForm) {
  btnResetModeForm.addEventListener('click', () => {
    resetModeForm();
  });
}

if (btnOpenModeForm) {
  btnOpenModeForm.addEventListener('click', () => {
    resetModeForm();
    openDialog(dialogModeForm);
  });
}

if (selectModeType) {
  selectModeType.addEventListener('change', () => {
    updateModeFieldVisibility();
  });
  updateModeFieldVisibility();
}

if (merchProductForm) {
  merchProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = inputMerchName.value.trim();
    const priceValue = inputMerchPrice.value;
    const stockValue = inputMerchStock.value;
    if (!name) {
      setMerchFormStatus('请输入商品名称', true);
      return;
    }
    const payload = {
      name,
      price: priceValue,
      stock: stockValue,
      description: inputMerchDescription.value.trim(),
    };
    if (inputMerchImage?.files?.length) {
      try {
        payload.imageData = await prepareImageData(inputMerchImage.files[0]);
      } catch (error) {
        setMerchFormStatus(error.message, true);
        return;
      }
    }
    const productId = inputMerchId.value.trim();
    const method = productId ? 'PUT' : 'POST';
    const endpoint = productId ? `/api/merch/products/${productId}` : '/api/merch/products';
    setMerchFormStatus('正在保存...');
    try {
      const response = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || '保存失败');
      }
      await response.json();
      setMerchFormStatus('商品已保存。');
      resetMerchForm();
      closeDialog(dialogMerchProduct);
      await loadMerchProducts();
    } catch (error) {
      setMerchFormStatus(error.message, true);
    }
  });
}

if (merchProductListEl) {
  merchProductListEl.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    const product = merchProducts.find((item) => item.id === id);
    if (!product) return;
    if (action === 'edit-product') {
      inputMerchId.value = product.id;
      inputMerchName.value = product.name;
      inputMerchPrice.value = product.price;
      inputMerchStock.value = product.stock;
      inputMerchDescription.value = product.description || '';
      if (inputMerchImage) {
        inputMerchImage.value = '';
      }
      setMerchFormStatus('正在编辑商品，可修改后保存。');
      openDialog(dialogMerchProduct);
    }
    if (action === 'toggle-product') {
      try {
        const response = await authFetch(`/api/merch/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: product.enabled === false }),
        });
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.error || '更新失败');
        }
        await loadMerchProducts();
      } catch (error) {
        setMerchFormStatus(error.message, true);
      }
    }
    if (action === 'delete-product') {
      button.disabled = true;
      try {
        const data = await dangerousJsonRequest(
          `/api/merch/products/${product.id}`,
          { method: 'DELETE' },
          { actionLabel: `删除商品「${product.name}」` }
        );
        showToast('商品已删除', 'success');
        await loadMerchProducts();
        if (data?.undo?.backupFilename) {
          showUndoToast('商品已删除', data.undo.backupFilename, { onUndo: restoreFromBackup });
        }
      } catch (error) {
        setMerchFormStatus(error.message, true);
      } finally {
        button.disabled = false;
      }
    }
  });
}

if (checkoutModeForm) {
  checkoutModeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      name: inputModeName.value.trim(),
      type: selectModeType.value,
      description: inputModeDescription.value.trim(),
    };
    if (!payload.name) {
      setModeFormStatus('请输入模式名称', true);
      return;
    }
    if (payload.type === 'discount') {
      payload.value = inputModeDiscount?.value || '';
    } else if (payload.type === 'fullcut') {
      payload.threshold = inputModeThreshold?.value || '';
      payload.cutAmount = inputModeCut?.value || '';
      payload.stackLimit = inputModeStack?.value || '';
    }
    const modeId = inputModeId.value.trim();
    const method = modeId ? 'PUT' : 'POST';
    const endpoint = modeId ? `/api/merch/modes/${modeId}` : '/api/merch/modes';
    setModeFormStatus('正在保存...');
    try {
      const response = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || '保存失败');
      }
      await response.json();
      setModeFormStatus('结账模式已保存。');
      resetModeForm();
      closeDialog(dialogModeForm);
      await loadCheckoutModes();
    } catch (error) {
      setModeFormStatus(error.message, true);
    }
  });
}

if (checkoutModeTableBody) {
  checkoutModeTableBody.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const mode = checkoutModes.find((item) => item.id === button.dataset.id);
    if (!mode) return;
    if (button.dataset.action === 'edit-mode') {
      inputModeId.value = mode.id;
      inputModeName.value = mode.name;
      selectModeType.value = mode.type;
      if (inputModeDiscount) inputModeDiscount.value = mode.type === 'discount' ? (Number(mode.value) * 10).toFixed(1) : '9.5';
      if (inputModeThreshold) inputModeThreshold.value = mode.threshold ?? '';
      if (inputModeCut) inputModeCut.value = mode.cutAmount ?? '';
      if (inputModeStack) inputModeStack.value = mode.stackLimit ?? 0;
      inputModeDescription.value = mode.description || '';
      setModeFormStatus('已载入结账模式，可编辑后保存。');
      updateModeFieldVisibility();
      openDialog(dialogModeForm);
      return;
    }
    if (button.dataset.action === 'delete-mode') {
      button.disabled = true;
      try {
        const data = await dangerousJsonRequest(
          `/api/merch/modes/${mode.id}`,
          { method: 'DELETE' },
          { actionLabel: `删除结账模式「${mode.name}」` }
        );
        setModeFormStatus('结账模式已删除。');
        await loadCheckoutModes();
        if (data?.undo?.backupFilename) {
          showUndoToast('结账模式已删除', data.undo.backupFilename, { onUndo: restoreFromBackup });
        }
      } catch (error) {
        setModeFormStatus(error.message, true);
      } finally {
        button.disabled = false;
      }
    }
  });
}

if (btnCancelNewProject) {
  btnCancelNewProject.addEventListener('click', () => {
    setNewProjectStatus('');
    dialogNewProject.close('cancel');
  });
}

if (btnCreateProject) btnCreateProject.addEventListener('click', async () => {
  const name = newProjectNameInput.value.trim();
  const rows = Number(newProjectRowsInput.value);
  const cols = Number(newProjectColsInput.value);
  const ticketMode = newProjectTicketingMode.value;
  if (!name) {
    setNewProjectStatus('请输入项目名称', true);
    return;
  }
  if (
    !Number.isInteger(rows) ||
    !Number.isInteger(cols) ||
    rows <= 0 ||
    cols <= 0 ||
    rows > 200 ||
    cols > 200
  ) {
    setNewProjectStatus('行列数需为 1-200 的整数', true);
    return;
  }
  let ticketingConfig = { mode: 'random' };
  if (ticketMode === 'sequence') {
    const template = newProjectTicketTemplate.value.trim();
    const start = newProjectTicketStart.value.trim();
    if (!template || !/[xX]/.test(template)) {
      setNewProjectStatus('请输入正确的票号模板（须包含尾部 X）', true);
      return;
    }
    const match = template.match(/(X+)$/i);
    if (!match) {
      setNewProjectStatus('票号模板需以连续的 X 结尾', true);
      return;
    }
    if (!start || start.length !== match[1].length) {
      setNewProjectStatus('流水码起始长度需与模板中 X 的数量一致', true);
      return;
    }
    if (!/^\d+$/.test(start)) {
      setNewProjectStatus('流水码起始值必须是数字', true);
      return;
    }
    ticketingConfig = {
      mode: 'sequence',
      sequence: {
        template: template.toUpperCase(),
        startValue: start,
      },
    };
  }
  try {
    const response = await authFetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rows, cols, ticketing: ticketingConfig }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || '创建失败');
    }
    const data = await response.json();
    dialogNewProject.close();
    await fetchProjects();
    setStatus(`项目「${data.project.name}」创建成功，请设置座位。`);
    selectProject(data.project.id);
  } catch (error) {
    setNewProjectStatus(error.message, true);
  }
});

if (btnLogout) btnLogout.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore
  }
  window.location.href = '/login.html?role=admin';
});

if (btnBackHome) btnBackHome.addEventListener('click', () => {
  window.location.href = '/';
});

window.addEventListener('pointerup', () => {
  if (!isDragging) {
    pointerDownSeatId = null;
    pointerDownWasSelected = false;
    return;
  }
  const wasDrag = dragMoved;
  const targetSeatId = pointerDownSeatId;
  isDragging = false;
  dragOrigin = null;
  dragSelectionBase = new Set();
  dragMoved = false;

  if (!wasDrag && targetSeatId) {
    if (pointerDownWasSelected) {
      selectedSeats.delete(targetSeatId);
    } else {
      selectedSeats.add(targetSeatId);
    }
  }

  pointerDownSeatId = null;
  pointerDownWasSelected = false;
  updateSelectedCount();
  refreshSelectionStyles();
});

window.addEventListener('pointercancel', () => {
  if (dragSelectionBase.size) {
    selectedSeats.clear();
    dragSelectionBase.forEach((key) => selectedSeats.add(key));
  }
  isDragging = false;
  dragOrigin = null;
  dragSelectionBase = new Set();
  dragMoved = false;
  pointerDownSeatId = null;
  pointerDownWasSelected = false;
  updateSelectedCount();
  refreshSelectionStyles();
});

window.addEventListener('beforeunload', () => {
  stopProjectAutoSync();
  stopMerchAutoRefresh();
});

const mergeIncomingProject = (project, { refreshSeatTable: shouldRefreshTable = false, refreshTicketing = false } = {}) => {
  if (!activeProject || activeProject.id !== project.id) return;
  const nameChangedByServer = modifiedSeats.size === 0;
  activeProject = project;
  ensureActiveProjectMetadata();
  if (nameChangedByServer) {
    inputProjectName.value = activeProject.name;
  }
  modifiedSeats.forEach((pending, id) => {
    const seat = activeProject.seats[id];
    if (!seat) return;
    seat.status = pending.status;
    seat.price = pending.price;
    if (seat.price != null) {
      ensureLocalPriceColor(seat.price);
    }
  });
  selectedSeats.forEach((id) => {
    const seat = activeProject.seats[id];
    if (!seat || seat.status === 'disabled') {
      selectedSeats.delete(id);
    }
  });
  recomputeSeatLabels();
  buildSeatGrid();
  if (shouldRefreshTable) {
    refreshSeatTable();
  }
  if (refreshTicketing) {
    updateTicketingControls();
  }
  updateSelectedCount();
  updateWorkspaceAvailability();
  updateSaveButtonState();
};

socket.on('project:update', ({ projectId, project }) => {
  if (activeProject && activeProject.id === projectId) {
    mergeIncomingProject(project, { refreshSeatTable: false, refreshTicketing: false });
    setStatus('座位状态已根据最新数据更新。');
    scheduleProjectAutoSync();
  }
  const projectIndex = projects.findIndex((item) => item.id === projectId);
  if (projectIndex >= 0) {
    projects[projectIndex] = {
      ...projects[projectIndex],
      updatedAt: project.updatedAt,
    };
  }
  renderProjectList();
});

socket.on('admin:accounts:update', ({ accounts: nextAccounts }) => {
  accounts = nextAccounts || [];
  renderAccounts();
});

updateTicketingControls();
updateWorkspaceAvailability();
updateSaveButtonState();
resetOrderForm();
refreshMerchData();
fetchProjects();
fetchAccounts();
loadCheckinLogs();

const bindAuditBackupEvents = () => {
  if (btnRefreshAudit) {
    btnRefreshAudit.addEventListener('click', () => renderAuditLogs());
  }
  if (btnExportAudit) {
    btnExportAudit.addEventListener('click', async () => {
      try {
        const response = await authFetch('/api/audit/export');
        if (!response.ok) throw new Error('导出失败');
        const blob = await response.blob();
        downloadBlob(`audit-${new Date().toISOString().slice(0, 10)}.json`, blob);
        showToast('审计日志导出完成', 'success');
      } catch (error) {
        showToast(error.message || '导出失败', 'error');
      }
    });
  }
  if (btnRefreshBackups) {
    btnRefreshBackups.addEventListener('click', () => renderBackups());
  }
  if (backupTableBody) {
    backupTableBody.addEventListener('click', async (event) => {
      const btn = event.target.closest('button[data-backup]');
      if (!btn) return;
      const name = btn.dataset.backup;
      if (!name) return;
      try {
        const data = await dangerousJsonRequest(
          '/api/backups/restore',
          {
            method: 'POST',
            body: JSON.stringify({ filename: name }),
          },
          { actionLabel: `恢复备份 ${name}` }
        );
        showToast('备份已恢复，数据已刷新。', 'success');
        if (data?.undo?.backupFilename) {
          showUndoToast('已恢复备份', data.undo.backupFilename, { onUndo: restoreFromBackup });
        }
        renderBackups();
        renderAuditLogs();
        await fetchProjects();
        await refreshMerchData();
        await loadMerchOrders();
      } catch (error) {
        showToast(error.message || '恢复失败', 'error');
      }
    });
  }
};

bindAuditBackupEvents();
const updateAuditPaginationControls = (totalPages) => {
  if (auditPageInfo) {
    auditPageInfo.textContent = `第 ${auditPage} / ${totalPages} 页（共 ${auditTotal} 条）`;
  }
  if (btnAuditPrev) {
    btnAuditPrev.disabled = auditPage <= 1 || auditTotal === 0;
  }
  if (btnAuditNext) {
    btnAuditNext.disabled = auditPage >= totalPages || auditTotal === 0;
  }
};

const renderAuditPage = () => {
  if (!auditTableBody) return;
  const totalPages = auditTotal ? Math.ceil(auditTotal / AUDIT_PAGE_SIZE) : 1;
  if (auditPage > totalPages) auditPage = totalPages;
  if (auditPage < 1) auditPage = 1;
  const start = (auditPage - 1) * AUDIT_PAGE_SIZE;
  const pageLogs = auditLogs.slice(start, start + AUDIT_PAGE_SIZE);
  auditTableBody.innerHTML = '';
  if (!auditTotal) {
    auditTableBody.innerHTML = '<tr><td colspan="4">暂无记录</td></tr>';
    updateAuditPaginationControls(totalPages);
    return;
  }
  pageLogs.forEach((log) => {
    const tr = document.createElement('tr');
    const tag =
      log.action && log.action.includes('backup')
        ? '<span class="badge badge--info">备份</span>'
        : log.action && log.action.includes('checkin')
        ? '<span class="badge badge--success">检票</span>'
        : log.action && log.action.includes('order')
        ? '<span class="badge badge--warning">订单</span>'
        : '';
    tr.innerHTML = `<td>${new Date(log.createdAt).toLocaleString()}</td><td>${log.actor || '-'}</td><td>${tag || ''} ${log.action}</td><td>${log.detail || ''}</td>`;
    auditTableBody.appendChild(tr);
  });
  updateAuditPaginationControls(totalPages);
};

const renderAuditLogs = async () => {
  if (!auditTableBody) return;
  try {
    const response = await authFetch('/api/audit');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '获取审计日志失败');
    auditLogs = data.logs || [];
    auditTotal = auditLogs.length;
    auditPage = 1;
    renderAuditPage();
  } catch (error) {
    auditTotal = 0;
    auditPage = 1;
    updateAuditPaginationControls(1);
    auditTableBody.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
  }
};

const renderBackups = async () => {
  if (!backupTableBody) return;
  try {
    const response = await authFetch('/api/backups');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '获取备份失败');
    const backups = data.backups || [];
    backupTableBody.innerHTML = '';
    if (!backups.length) {
      backupTableBody.innerHTML = '<tr><td colspan="2">暂无备份</td></tr>';
      return;
    }
    backups.forEach((b) => {
      const tr = document.createElement('tr');
      const timeText = b.mtime ? new Date(b.mtime).toLocaleString() : '';
      tr.innerHTML = `<td><div>${b.name}</div><div class="hint">${timeText}</div></td><td><button class="button button--secondary" data-backup="${b.name}">恢复</button></td>`;
      backupTableBody.appendChild(tr);
    });
  } catch (error) {
    backupTableBody.innerHTML = `<tr><td colspan="2">${error.message}</td></tr>`;
  }
};
