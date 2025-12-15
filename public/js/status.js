const metricsStatus = document.getElementById('metrics-status') || document.getElementById('ops-status');
const metricsSummary = document.getElementById('metrics-summary');
const metricsCounters = document.getElementById('metrics-counters');
const opsMetrics = document.getElementById('ops-metrics');
const btnRefresh = document.getElementById('btn-refresh-metrics') || document.getElementById('btn-refresh');
const btnRefreshBackups = document.getElementById('btn-refresh-backups');
const urlInput = document.getElementById('loadtest-url');
const concurrencyInput = document.getElementById('loadtest-concurrency');
const durationInput = document.getElementById('loadtest-duration');
const methodSelect = document.getElementById('loadtest-method');
const btnStartLoad = document.getElementById('btn-start-loadtest');
const loadResult = document.getElementById('loadtest-result');
const loadStatus = document.getElementById('loadtest-status');
const backupList = document.getElementById('backup-list');
const btnDownloadState = document.getElementById('btn-download-state');

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes)) return '-';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(1)} ${units[i]}`;
};

const renderMetrics = (data) => {
  const loadClass = (val) => (val > 2 ? 'status-error' : val > 1 ? 'status-warn' : 'status-ok');
  if (metricsSummary && metricsCounters) {
    metricsSummary.innerHTML = `
      <div class="metric"><span>时间</span><span>${new Date(data.timestamp).toLocaleString()}</span></div>
      <div class="metric"><span>进程运行</span><span>${data.uptimeSeconds?.toFixed(0) || '-'} s</span></div>
      <div class="metric"><span>系统运行</span><span>${data.systemUptimeSeconds?.toFixed(0) || '-'} s</span></div>
      <div class="metric"><span>负载(1m/5m/15m)</span>
        <span class="${loadClass(data.loadavg?.[0] || 0)}">${(data.loadavg || []).map((n) => n?.toFixed(2)).join(' / ')}</span>
      </div>
      <div class="metric"><span>内存(进程RSS)</span><span>${formatBytes(data.memory?.rss)}</span></div>
      <div class="metric"><span>内存使用率</span><span>${data.memory?.usedPercent ? data.memory.usedPercent.toFixed(1) + '%' : '-'}</span></div>
      <div class="metric"><span>Node</span><span>${data.process?.nodeVersion || '-'}</span></div>
      <div class="metric"><span>PID</span><span>${data.process?.pid || '-'}</span></div>
    `;
    metricsCounters.innerHTML = `
      <div class="metric"><span>账号</span><span>${data.counters?.accounts ?? '-'}</span></div>
      <div class="metric"><span>项目</span><span>${data.counters?.projects ?? '-'}</span></div>
      <div class="metric"><span>商品</span><span>${data.counters?.merchProducts ?? '-'}</span></div>
      <div class="metric"><span>订单</span><span>${data.counters?.merchOrders ?? '-'}</span></div>
      <div class="metric"><span>审计日志</span><span>${data.counters?.auditLogs ?? '-'}</span></div>
      <div class="metric"><span>检票日志</span><span>${data.counters?.checkinLogs ?? '-'}</span></div>
      <div class="metric"><span>当前连接</span><span>${data.counters?.sockets ?? '-'}</span></div>
    `;
    return;
  }

  if (opsMetrics) {
    const loadText = (data.loadavg || []).map((n) => n?.toFixed(2)).join(' / ');
    const lines = [];
    lines.push(`时间: ${new Date(data.timestamp).toLocaleString()}`);
    lines.push(`进程运行: ${data.uptimeSeconds?.toFixed(0) || '-'} s`);
    lines.push(`系统运行: ${data.systemUptimeSeconds?.toFixed(0) || '-'} s`);
    lines.push(`负载(1m/5m/15m): ${loadText || '-'}`);
    lines.push(`内存(进程RSS): ${formatBytes(data.memory?.rss)}`);
    lines.push(`内存使用率: ${data.memory?.usedPercent ? data.memory.usedPercent.toFixed(1) + '%' : '-'}`);
    lines.push(`Node: ${data.process?.nodeVersion || '-'}`);
    lines.push(`PID: ${data.process?.pid || '-'}`);
    lines.push('');
    lines.push('计数:');
    lines.push(`- 账号: ${data.counters?.accounts ?? '-'}`);
    lines.push(`- 项目: ${data.counters?.projects ?? '-'}`);
    lines.push(`- 商品: ${data.counters?.merchProducts ?? '-'}`);
    lines.push(`- 订单: ${data.counters?.merchOrders ?? '-'}`);
    lines.push(`- 审计日志: ${data.counters?.auditLogs ?? '-'}`);
    lines.push(`- 检票日志: ${data.counters?.checkinLogs ?? '-'}`);
    lines.push(`- 当前连接: ${data.counters?.sockets ?? '-'}`);
    opsMetrics.textContent = lines.join('\n');
  }
};

const fetchMetrics = async () => {
  if (metricsStatus) metricsStatus.textContent = '加载中...';
  try {
    const res = await fetch('/api/metrics', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('获取失败');
    const data = await res.json();
    renderMetrics(data);
    if (metricsStatus) metricsStatus.textContent = '已更新';
  } catch (err) {
    if (metricsStatus) metricsStatus.textContent = err.message || '加载失败（需管理员登录）';
    if (opsMetrics) opsMetrics.textContent = err.message || '加载失败（需管理员登录）';
  }
};

const fetchBackups = async () => {
  if (!backupList) return;
  backupList.textContent = '加载中...';
  try {
    const res = await fetch('/api/backups', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('获取备份失败（需管理员登录）');
    const data = await res.json();
    const backups = data.backups || [];
    if (!backups.length) {
      backupList.textContent = '暂无备份';
      return;
    }
    const ul = document.createElement('ul');
    backups.forEach((b) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = `下载 ${b.name} (${new Date(b.mtime || Date.now()).toLocaleString()})`;
      btn.className = 'button';
      btn.onclick = () => {
        const a = document.createElement('a');
        a.href = `/api/backups/${encodeURIComponent(b.name)}`;
        a.download = b.name;
        a.click();
      };
      li.appendChild(btn);
      ul.appendChild(li);
    });
    backupList.innerHTML = '';
    backupList.appendChild(ul);
  } catch (err) {
    backupList.textContent = err.message || '加载失败';
  }
};

const runLoadTest = async () => {
  if (!urlInput || !concurrencyInput || !durationInput || !methodSelect || !loadResult || !loadStatus) {
    return;
  }
  const url = urlInput.value.trim() || '/healthz';
  const concurrency = Math.max(1, Number(concurrencyInput.value) || 1);
  const durationSec = Math.max(1, Number(durationInput.value) || 5);
  const method = methodSelect.value || 'GET';
  let stop = false;
  let ok = 0;
  let fail = 0;
  const latencies = [];
  const start = performance.now();
  const deadline = start + durationSec * 1000;

  const oneWorker = async () => {
    while (!stop && performance.now() < deadline) {
      const t0 = performance.now();
      try {
        const res = await fetch(url, { method, credentials: 'same-origin' });
        res.ok ? ok++ : fail++;
      } catch {
        fail++;
      } finally {
        latencies.push(performance.now() - t0);
      }
    }
  };

  loadStatus.textContent = '运行中...';
  loadResult.textContent = '测试进行中...';
  const workers = Array.from({ length: concurrency }, () => oneWorker());
  await Promise.all(workers);
  stop = true;

  const total = ok + fail;
  const sorted = latencies.sort((a, b) => a - b);
  const p95 = sorted.length ? sorted[Math.floor(sorted.length * 0.95)] : 0;
  const p99 = sorted.length ? sorted[Math.floor(sorted.length * 0.99)] : 0;
  const duration = (performance.now() - start) / 1000;
  loadStatus.textContent = '完成';
  loadResult.textContent = `URL: ${url}
并发: ${concurrency}，时长: ${durationSec}s（实际 ${duration.toFixed(2)}s）
总请求: ${total}，成功: ${ok}，失败: ${fail}
TPS(粗略): ${(total / duration).toFixed(1)}
延迟 ms: min=${sorted[0]?.toFixed(1) || '-'}  avg=${(sorted.reduce((a, b) => a + b, 0) / (sorted.length || 1)).toFixed(1)}  p95=${p95?.toFixed(1) || '-'}  p99=${p99?.toFixed(1) || '-'}
（说明：此压力测试在浏览器内执行，受浏览器/网络限制，仅供快速估算。如需严谨压测请使用专业工具或服务器端脚本。）`;
};

if (btnRefresh) {
  btnRefresh.addEventListener('click', fetchMetrics);
}
if (btnStartLoad) {
  btnStartLoad.addEventListener('click', runLoadTest);
}
if (btnRefreshBackups) {
  btnRefreshBackups.addEventListener('click', fetchBackups);
}
if (btnDownloadState) {
  btnDownloadState.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = '/data/state.json';
    a.download = 'state.json';
    a.click();
  });
}

fetchMetrics().catch(() => {});
