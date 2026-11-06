// 遊戲裡所有聲音都用 Web Audio 即時合成，不使用任何錄音。
export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// scat 音節：子音 + 母音（+ 結尾的 t / p）。母音用三個共振峰（女聲的大約值，Hz）模擬。
const VOWELS = {
  a: [850, 1220, 2810],
  u: [370, 950, 2670],
  i: [310, 2790, 3310],
  o: [600, 940, 2700],
};
// 各母音的音量補正：不同共振峰合成出來的響度差很多，用離線量測的結果拉齊
const VOWEL_GAIN = { a: 0.5, u: 0.2, i: 0.3, o: 0.5 };
// w / y / l 開頭時，共振峰從這個口型滑到母音
const GLIDE_FROM = { w: [330, 750, 2400], dw: [330, 750, 2400], y: [300, 2700, 3300], l: [400, 1200, 2900] };
// c：b 嘴唇爆破、d 舌尖爆破、sh 氣音、sk 氣音接 k、z 帶聲的氣音、w/y/l 滑音、'' 直接發母音
export const SYLLABLES = {
  ba: { c: 'b', v: 'a' },
  bap: { c: 'b', v: 'a', end: 'p' },
  bee: { c: 'b', v: 'i' },
  bip: { c: 'b', v: 'i', end: 'p' },
  bo: { c: 'b', v: 'o' },
  bop: { c: 'b', v: 'o', end: 'p' },
  dah: { c: 'd', v: 'a' },
  dat: { c: 'd', v: 'a', end: 't' },
  dee: { c: 'd', v: 'i' },
  doo: { c: 'd', v: 'u' },
  doot: { c: 'd', v: 'u', end: 't' },
  dwee: { c: 'dw', v: 'i' },
  sha: { c: 'sh', v: 'a' },
  shoo: { c: 'sh', v: 'u' },
  skee: { c: 'sk', v: 'i' },
  zah: { c: 'z', v: 'a' },
  zoo: { c: 'z', v: 'u' },
  wah: { c: 'w', v: 'a' },
  ya: { c: 'y', v: 'a' },
  la: { c: 'l', v: 'a' },
  lee: { c: 'l', v: 'i' },
  ooh: { c: '', v: 'u' },
};

export class AudioEngine {
  // ctx 可以傳入 OfflineAudioContext 做離線測試；平常不傳
  constructor(ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = ctx || new AC({ latencyHint: 'interactive' });
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = 0.9;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 12;
    comp.ratio.value = 4;
    comp.attack.value = 0.004;
    comp.release.value = 0.2;
    this.master.connect(comp);
    comp.connect(c.destination);
    this.reverb = c.createConvolver();
    this.reverb.buffer = this.makeImpulse(2.2, 3.2);
    this.reverb.connect(this.master);
    this.noiseBuf = this.makeNoise(3);
    this.ksCache = new Map();
    this.newSession();
  }

  // 每局一條獨立的輸出線：重新開始或離開時整條切斷，已排程的聲音也一起靜音
  newSession() {
    if (this.bus) {
      try {
        this.bus.disconnect();
        this.wet.disconnect();
      } catch {}
    }
    this.bus = this.ctx.createGain();
    this.bus.connect(this.master);
    this.wet = this.ctx.createGain();
    this.wet.connect(this.reverb);
  }

  now() {
    return this.ctx.currentTime;
  }

  // 喇叭「此刻正在播出」的時間點（扣掉輸出延遲），畫面和判定都用這個時間，才會跟聽到的聲音對齊
  heardTime() {
    const c = this.ctx;
    if (c.state === 'running' && c.getOutputTimestamp) {
      const ts = c.getOutputTimestamp();
      if (ts.contextTime > 0 && ts.performanceTime > 0) {
        const dt = (performance.now() - ts.performanceTime) / 1000;
        if (dt >= 0 && dt < 0.2) return ts.contextTime + dt;
      }
    }
    return c.currentTime - (c.outputLatency || c.baseLatency || 0);
  }

  makeNoise(sec) {
    const c = this.ctx;
    const b = c.createBuffer(1, Math.floor(c.sampleRate * sec), c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  makeImpulse(sec, decay) {
    const c = this.ctx;
    const len = Math.floor(c.sampleRate * sec);
    const b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }

  out(node, wet = 0) {
    node.connect(this.bus);
    if (wet > 0) {
      const g = this.ctx.createGain();
      g.gain.value = wet;
      node.connect(g);
      g.connect(this.wet);
    }
  }

  noise(t, dur) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.start(t, Math.random() * Math.max(0, this.noiseBuf.duration - dur - 0.1), dur + 0.05);
    return s;
  }

  // ---------- 樂團伴奏 ----------

  bass(t, midi, dur) {
    const c = this.ctx;
    const o = c.createOscillator();
    const f = c.createBiquadFilter();
    const g = c.createGain();
    o.type = 'sawtooth';
    o.frequency.value = mtof(midi);
    f.type = 'lowpass';
    f.Q.value = 0.8;
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(380, t + 0.15);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.28, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.13, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur, 0.25));
    o.connect(f);
    f.connect(g);
    this.out(g, 0.04);
    o.start(t);
    o.stop(t + Math.max(dur, 0.25) + 0.02);
  }

  // 鋼琴和弦（電鋼琴感的音色）
  keys(t, midis, dur, vel = 0.07) {
    const c = this.ctx;
    const g = c.createGain();
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 2400;
    const end = t + dur + 0.35;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    for (const m of midis) {
      const fr = mtof(m);
      const o1 = c.createOscillator();
      o1.type = 'sine';
      o1.frequency.value = fr;
      const o2 = c.createOscillator();
      o2.type = 'triangle';
      o2.frequency.value = fr * 2.001;
      const g2 = c.createGain();
      g2.gain.value = 0.18;
      o1.connect(f);
      o2.connect(g2);
      g2.connect(f);
      o1.start(t);
      o2.start(t);
      o1.stop(end + 0.02);
      o2.stop(end + 0.02);
    }
    f.connect(g);
    this.out(g, 0.3);
  }

  ride(t, vel = 0.1) {
    const c = this.ctx;
    const s = this.noise(t, 0.5);
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    s.connect(hp);
    hp.connect(g);
    // 金屬感的「叮」
    for (const fr of [3420, 5150]) {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.value = fr;
      const og = c.createGain();
      og.gain.setValueAtTime(vel * 0.12, t);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + 0.2);
    }
    this.out(g, 0.15);
  }

  hat(t, vel = 0.06) {
    const c = this.ctx;
    const s = this.noise(t, 0.06);
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 8500;
    const g = c.createGain();
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(hp);
    hp.connect(g);
    this.out(g);
  }

  kick(t, vel = 0.25) {
    const c = this.ctx;
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.1);
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g);
    this.out(g);
    o.start(t);
    o.stop(t + 0.27);
  }

  // 數拍用的鼓棒敲擊聲
  stick(t, vel = 0.3) {
    const c = this.ctx;
    const s = this.noise(t, 0.05);
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2500;
    bp.Q.value = 3;
    const g = c.createGain();
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    s.connect(bp);
    bp.connect(g);
    const o = c.createOscillator();
    o.frequency.value = 1100;
    const og = c.createGain();
    og.gain.setValueAtTime(vel * 0.5, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    o.connect(og);
    og.connect(g);
    o.start(t);
    o.stop(t + 0.04);
    this.out(g, 0.1);
  }

  crash(t, vel = 0.22) {
    const c = this.ctx;
    const s = this.noise(t, 2.2);
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 4000;
    const g = c.createGain();
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
    s.connect(hp);
    hp.connect(g);
    this.out(g, 0.3);
  }

  // 掌聲：一連串隨機的短促噪音，amount 是拍手的次數
  applause(t, amount) {
    const c = this.ctx;
    for (let i = 0; i < amount; i++) {
      const at = t + Math.random() * 2.4;
      const s = this.noise(at, 0.03);
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 900 + Math.random() * 1800;
      bp.Q.value = 0.9;
      const g = c.createGain();
      const v = 0.05 + Math.random() * 0.06;
      g.gain.setValueAtTime(v, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.03 + Math.random() * 0.03);
      s.connect(bp);
      bp.connect(g);
      this.out(g, 0.25);
    }
  }

  // 洗衣板：快速刮過金屬波紋的幾下短促高頻噪音
  washboard(t, vel = 0.34) {
    const c = this.ctx;
    for (let i = 0; i < 4; i++) {
      const at = t + i * 0.032;
      const s = this.noise(at, 0.028);
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 3600 + i * 500;
      bp.Q.value = 2.2;
      const g = c.createGain();
      g.gain.setValueAtTime(vel * (i === 0 ? 1 : 0.7), at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
      s.connect(bp);
      bp.connect(g);
      this.out(g, 0.12);
    }
  }

  // 鐵琴般的柔和鐘聲
  bell(t, midi, vel = 0.16) {
    const c = this.ctx;
    const f = mtof(midi);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    for (const [ratio, level] of [[1, 1], [4, 0.14]]) {
      const o = c.createOscillator();
      o.frequency.value = f * ratio;
      const og = c.createGain();
      og.gain.value = level;
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + 0.95);
    }
    this.out(g, 0.2);
  }

  // 走音：兩個差一點點的音一起往下滑
  sour(t, vel = 0.3) {
    const c = this.ctx;
    const g = c.createGain();
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    for (const f of [220, 233]) {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.42, t + 0.45);
      o.connect(lp);
      o.start(t);
      o.stop(t + 0.52);
    }
    lp.connect(g);
    this.out(g, 0.1);
  }

  // ---------- 玩家演奏的三種樂器 ----------

  // 吉他：Karplus-Strong 撥弦合成，預先算好各音高的波形
  ksBuffer(midi) {
    if (this.ksCache.has(midi)) return this.ksCache.get(midi);
    const c = this.ctx;
    const sr = c.sampleRate;
    const N = Math.max(2, Math.round(sr / mtof(midi)));
    const len = Math.floor(sr * 1.6);
    const buf = c.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    const ring = new Float32Array(N);
    let last = 0;
    for (let i = 0; i < N; i++) {
      // 先把雜訊稍微濾過，音色比較溫暖，像爵士吉他
      last = last * 0.55 + (Math.random() * 2 - 1) * 0.45;
      ring[i] = last;
    }
    let idx = 0;
    for (let i = 0; i < len; i++) {
      const a = ring[idx];
      const next = (idx + 1) % N;
      d[i] = a;
      ring[idx] = 0.4985 * (a + ring[next]);
      idx = next;
    }
    this.ksCache.set(midi, buf);
    return buf;
  }

  guitar(t, midi, vel = 1) {
    const c = this.ctx;
    const s = c.createBufferSource();
    s.buffer = this.ksBuffer(midi);
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 2800;
    const g = c.createGain();
    g.gain.value = 1.1 * vel;
    s.connect(f);
    f.connect(g);
    this.out(g, 0.18);
    s.start(t);
  }

  scat(t, midi, syl = 'doo', vel = 1) {
    const c = this.ctx;
    const S = SYLLABLES[syl] || SYLLABLES.doo;
    const F = VOWELS[S.v];
    const f = mtof(midi);
    const short = !!S.end; // 結尾有 t / p 的音節唱得比較短、收得乾脆
    const dur = short ? 0.15 : S.c === '' ? 0.32 : 0.26;
    // 母音開始的時間：氣音開頭的要等氣音先出來
    const vt = t + ({ sh: 0.07, sk: 0.09, z: 0.045, '': 0 }[S.c] ?? 0.012);
    const end = vt + dur + (short ? 0.03 : 0.12);
    const attack = S.c === '' ? 0.06 : GLIDE_FROM[S.c] ? 0.04 : 0.025;

    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f * 0.96, vt);
    o.frequency.exponentialRampToValueAtTime(f, vt + 0.05);
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = 5.8;
    lg.gain.setValueAtTime(0, vt);
    lg.gain.linearRampToValueAtTime(f * 0.015, vt + dur);
    lfo.connect(lg);
    lg.connect(o.frequency);

    const sum = c.createGain();
    const amps = [1, 0.55, 0.25];
    F.forEach((fr, i) => {
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = fr / (i === 0 ? 90 : 120);
      bp.frequency.value = fr;
      const from = GLIDE_FROM[S.c];
      if (from) {
        // w / y / l：從另一個口型滑到母音
        bp.frequency.setValueAtTime(from[i], vt);
        bp.frequency.exponentialRampToValueAtTime(fr, vt + 0.07);
      } else if (S.c === 'b') {
        // b：嘴唇打開，共振峰從低處往上滑
        bp.frequency.setValueAtTime(fr * 0.7, vt);
        bp.frequency.exponentialRampToValueAtTime(fr, vt + 0.05);
      } else if (S.c === 'd' && i === 1) {
        // d：第二共振峰從 1700Hz 附近滑到母音
        bp.frequency.setValueAtTime(1700, vt);
        bp.frequency.exponentialRampToValueAtTime(fr, vt + 0.06);
      }
      const ag = c.createGain();
      ag.gain.value = amps[i] * 3.5;
      o.connect(bp);
      bp.connect(ag);
      ag.connect(sum);
    });

    const vg = c.createGain();
    const peak = vel * VOWEL_GAIN[S.v];
    vg.gain.setValueAtTime(0.0001, vt);
    vg.gain.exponentialRampToValueAtTime(peak, vt + attack);
    vg.gain.setValueAtTime(peak, vt + dur * 0.7);
    vg.gain.exponentialRampToValueAtTime(0.0001, end);
    sum.connect(vg);
    this.out(vg, 0.15);

    // 子音的氣音／爆破音
    const burst = (at, len, type, freq, q, gain, rise = 0) => {
      const n = this.noise(at, len + rise);
      const nf = c.createBiquadFilter();
      nf.type = type;
      nf.frequency.value = freq;
      nf.Q.value = q;
      const ng = c.createGain();
      if (rise) {
        ng.gain.setValueAtTime(0.0001, at);
        ng.gain.exponentialRampToValueAtTime(gain * vel, at + rise);
      } else ng.gain.setValueAtTime(gain * vel, at);
      ng.gain.exponentialRampToValueAtTime(0.0001, at + rise + len);
      n.connect(nf);
      nf.connect(ng);
      this.out(ng);
    };
    if (S.c === 'b') burst(vt - 0.004, 0.02, 'lowpass', 600, 2, 0.25);
    else if (S.c === 'd' || S.c === 'dw') burst(vt - 0.004, 0.02, 'bandpass', 3500, 2, 0.25);
    else if (S.c === 'sh') burst(t, 0.07, 'bandpass', 3200, 1.2, 0.35, 0.03);
    else if (S.c === 'sk') {
      burst(t, 0.045, 'bandpass', 6500, 1.5, 0.3, 0.025); // s
      burst(vt - 0.012, 0.02, 'bandpass', 1800, 2, 0.25); // k
    } else if (S.c === 'z') burst(t, 0.06, 'bandpass', 4500, 1.5, 0.2, 0.02);
    // 結尾的 t：舌尖輕輕一彈
    if (S.end === 't') burst(vt + dur + 0.02, 0.015, 'bandpass', 4000, 2, 0.2);

    o.start(vt);
    lfo.start(vt);
    o.stop(end + 0.02);
    lfo.stop(end + 0.02);
  }

  whistle(t, midi, vel = 1) {
    const c = this.ctx;
    const f = mtof(midi);
    const dur = 0.3;
    const end = t + dur + 0.12;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f * 0.93, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.045);
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = 6.2;
    lg.gain.setValueAtTime(0, t + 0.08);
    lg.gain.linearRampToValueAtTime(f * 0.01, t + dur);
    lfo.connect(lg);
    lg.connect(o.frequency);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.17 * vel, t + 0.025);
    g.gain.setValueAtTime(0.17 * vel, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    o.connect(g);
    this.out(g, 0.25);
    // 吹氣聲
    const n = this.noise(t, dur + 0.12);
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = f;
    bp.Q.value = 6;
    const ng = c.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.exponentialRampToValueAtTime(0.06 * vel, t + 0.03);
    ng.gain.exponentialRampToValueAtTime(0.0001, end);
    n.connect(bp);
    bp.connect(ng);
    this.out(ng);
    o.start(t);
    lfo.start(t);
    o.stop(end + 0.02);
    lfo.stop(end + 0.02);
  }
}
