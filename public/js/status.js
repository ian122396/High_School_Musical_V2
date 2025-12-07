const metricsStatus = document.getElementById('metrics-status');
const metricsSummary = document.getElementById('metrics-summary');
const metricsCounters = document.getElementById('metrics-counters');
const btnRefresh = document.getElementById('btn-refresh-metrics');
const urlInput = document.getElementById('loadtest-url');
const concurrencyInput = document.getElementById('loadtest-concurrency');
const durationInput = document.getElementById('loadtest-duration');
const methodSelect = document.getElementById('loadtest-method');
const btnStartLoad = document.getElementById('btn-start-loadtest');
const loadResult = document.getElementById('loadtest-result');
const loadStatus = document.getElementById('loadtest-status');

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
};

const fetchMetrics = async () => {
  metricsStatus.textContent = '加载中...';
  try {
    const res = await fetch('/api/metrics', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('获取失败');
    const data = await res.json();
    renderMetrics(data);
    metricsStatus.textContent = '已更新';
  } catch (err) {
    metricsStatus.textContent = err.message || '加载失败（需管理员登录）';
  }
};

const runLoadTest = async () => {
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

fetchMetrics().catch(() => {});
