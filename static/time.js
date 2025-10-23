const $time = document.getElementById("time");
const $diff = document.getElementById("diff");
let offsetMs = 0;

const pad = (n) => String(n).padStart(2, "0");

function updateDisplay() {
  const now = new Date(Date.now() + offsetMs);
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  const ms = Math.floor(now.getMilliseconds() / 100);

  $time.textContent = `${h}:${m}:${s}`;
}

async function syncTime() {
  try {
    const start = performance.now();

    const res = await fetch("/time", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const end = performance.now();

    const latency = (end - start) / 2;
    console.log(`Latency: ${latency.toFixed(2)} ms`);
    const server = new Date(data.time.replace(" ", "T"));
    const serverNow = server.getTime() + latency;
    const localNow = Date.now();

    offsetMs = serverNow - localNow;

    const diffSec = (offsetMs / 1000).toFixed(3);
    const color =
      Math.abs(offsetMs) > 200 ? "#f87171" : "#9ca3af";

    $diff.innerHTML = `
      <span style="color:${color}">${diffSec} s</span>
    `;
  } catch (err) {
    console.error(err);
  }
}

syncTime();
setInterval(syncTime, 5000);  
setInterval(updateDisplay, 100);