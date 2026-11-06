// 樂器圖案，揮音符和泡泡樂團共用。每個都用程式畫，手機上放大縮小都清楚
export const COLORS = {
  guitar: '#f5b83d',
  whistle: '#2dd4bf',
  washboard: '#60a5fa',
  note: '#f472b6',
  scat: '#a78bfa',
  mic: '#a3e635',
  bomb: '#ef4444',
};

// 只畫樂器本身，圓心在 (0, 0)，r 是可以用的半徑
function drawGlyph(c, type, r) {
  const col = COLORS[type];
  c.save();
  if (type === 'guitar') {
    c.rotate(0.65);
    c.fillStyle = '#8a5a2b';
    c.fillRect(-r * 0.065, -r * 0.84, r * 0.13, r * 0.7);
    c.fillStyle = '#5b3a1b';
    c.fillRect(-r * 0.11, -r * 0.84, r * 0.22, r * 0.18);
    c.fillStyle = col;
    c.beginPath();
    c.arc(0, r * 0.33, r * 0.38, 0, Math.PI * 2);
    c.arc(0, -r * 0.04, r * 0.26, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#3a2508';
    c.beginPath();
    c.arc(0, r * 0.14, r * 0.09, 0, Math.PI * 2);
    c.fill();
  } else if (type === 'whistle') {
    // 吹口哨的表情：閉著眼睛、嘟嘴，旁邊飄一個音符
    const k = r / 33;
    c.scale(k, k);
    c.fillStyle = '#ffd27a';
    c.beginPath();
    c.arc(-5, 3, 23, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#3a2508';
    c.lineWidth = 3;
    c.lineCap = 'round';
    c.stroke(new Path2D('M-18 -5 q5 -5 9 0 M0 -5 q5 -5 9 0'));
    c.fillStyle = '#3a2508';
    c.beginPath();
    c.ellipse(2, 13, 4.5, 3.8, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = col;
    c.font = "700 22px Georgia, 'Times New Roman', serif";
    c.textAlign = 'center';
    c.textBaseline = 'alphabetic';
    c.fillText('♪', 23, -11);
  } else if (type === 'washboard') {
    c.fillStyle = '#b7793f';
    c.fillRect(-r * 0.48, -r * 0.68, r * 0.96, r * 1.36);
    c.fillStyle = '#d7dadd';
    c.fillRect(-r * 0.35, -r * 0.3, r * 0.7, r * 0.84);
    c.strokeStyle = '#7f858b';
    c.lineWidth = r * 0.055;
    for (let y = -r * 0.2; y < r * 0.52; y += r * 0.135) {
      c.beginPath();
      c.moveTo(-r * 0.35, y);
      c.lineTo(r * 0.35, y);
      c.stroke();
    }
  } else if (type === 'mic') {
    c.rotate(0.6);
    c.fillStyle = '#cfd3d6';
    c.fillRect(-r * 0.12, -r * 0.1, r * 0.24, r * 0.78);
    c.fillStyle = col;
    c.beginPath();
    c.arc(0, -r * 0.34, r * 0.32, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(16, 12, 8, 0.55)';
    c.lineWidth = r * 0.05;
    c.beginPath();
    c.moveTo(-r * 0.3, -r * 0.34);
    c.lineTo(r * 0.3, -r * 0.34);
    c.stroke();
  } else if (type === 'scat') {
    // Scat 沒有公認的符號，所以直接畫唱出來的音節：對話泡泡寫 doo
    const k = r / 33;
    c.scale(k, k);
    c.fillStyle = col;
    c.fill(new Path2D('M-25 -19 h50 a6 6 0 0 1 6 6 v21 a6 6 0 0 1 -6 6 h-30 l-11 12 v-12 h-9 a6 6 0 0 1 -6 -6 v-21 a6 6 0 0 1 6 -6z'));
    c.fillStyle = '#100c08';
    c.font = "700 21px Georgia, 'Times New Roman', serif";
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('doo', 0, 2);
  } else {
    c.fillStyle = col;
    c.font = `700 ${r * 1.25}px Georgia, 'Times New Roman', serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('♫', -r * 0.02, r * 0.06);
  }
  c.restore();
}

// 揮音符的飛行物：深色圓底加彩色外框，在舞台背景上才看得清楚
export function drawIcon(c, type, r) {
  const col = COLORS[type];
  c.save();
  if (type === 'bomb') {
    c.shadowColor = col;
    c.shadowBlur = r * 0.5;
    const grad = c.createRadialGradient(-r * 0.25, -r * 0.1, r * 0.1, 0, r * 0.08, r * 0.8);
    grad.addColorStop(0, '#4b4b4b');
    grad.addColorStop(1, '#070707');
    c.fillStyle = grad;
    c.beginPath();
    c.arc(0, r * 0.1, r * 0.78, 0, Math.PI * 2);
    c.fill();
    c.shadowBlur = 0;
    c.lineCap = 'round';
    c.strokeStyle = '#c9a26b';
    c.lineWidth = r * 0.1;
    c.beginPath();
    c.moveTo(r * 0.3, -r * 0.55);
    c.quadraticCurveTo(r * 0.45, -r * 0.95, r * 0.75, -r * 0.78);
    c.stroke();
    c.fillStyle = '#fde047';
    c.beginPath();
    c.arc(r * 0.78, -r * 0.78, r * 0.13, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#ef4444';
    c.lineWidth = r * 0.16;
    c.beginPath();
    c.moveTo(-r * 0.28, -r * 0.16);
    c.lineTo(r * 0.28, r * 0.36);
    c.moveTo(r * 0.28, -r * 0.16);
    c.lineTo(-r * 0.28, r * 0.36);
    c.stroke();
    c.restore();
    return;
  }
  c.shadowColor = col;
  c.shadowBlur = r * 0.35;
  c.fillStyle = 'rgba(16, 12, 8, 0.92)';
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.fill();
  c.shadowBlur = 0;
  c.strokeStyle = col;
  c.lineWidth = r * 0.09;
  c.stroke();
  c.restore();
  drawGlyph(c, type, r);
}

// 泡泡樂團的泡泡：整顆是樂器的顏色，一眼就能分辨；中間深色圓裡是樂器
export function drawBubble(c, type, r) {
  const col = COLORS[type];
  c.save();
  const grad = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.28, col);
  grad.addColorStop(1, col);
  c.fillStyle = grad;
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  c.lineWidth = r * 0.05;
  c.stroke();
  c.fillStyle = 'rgba(16, 12, 8, 0.88)';
  c.beginPath();
  c.arc(0, 0, r * 0.72, 0, Math.PI * 2);
  c.fill();
  c.restore();
  drawGlyph(c, type, r * 0.68);
}
