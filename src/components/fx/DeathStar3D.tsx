'use client';
import { useEffect, useRef } from 'react';
import * as T from 'three';

// Estrela da Morte 3D guiada pelo scroll: o superlaser carrega e dispara conforme a página desce.
// Portada do protótipo. Canvas fixo cobrindo a tela; `onReady` avisa quando o primeiro frame foi desenhado.
export default function DeathStar3D({ reduced, onReady }: { reduced: boolean; onReady: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let r: T.WebGLRenderer;
    try { r = new T.WebGLRenderer({ canvas: c, alpha: true, antialias: true }); } catch { return; }
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.outputColorSpace = T.SRGBColorSpace;
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(35, 1, 0.1, 100);
    cam.position.set(0, 0, 10);

    const R = 2.2, W = 2048, H = 1024, phi = Math.PI / 2 - 0.38, th = Math.PI / 3, ar = 0.23;
    const tc = document.createElement('canvas'); tc.width = W; tc.height = H;
    const g = tc.getContext('2d')!;
    const ec = document.createElement('canvas'); ec.width = W; ec.height = H;
    const e2 = ec.getContext('2d')!;
    e2.fillStyle = '#000'; e2.fillRect(0, 0, W, H);
    g.fillStyle = '#3b3b3e'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 6000; i++) {
      const l = (44 + Math.random() * 34) | 0;
      g.fillStyle = `rgb(${l},${l},${l + 3})`;
      g.fillRect(Math.random() * W, Math.random() * H, 6 + Math.random() * 44, 3 + Math.random() * 16);
    }
    g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 0; y < H; y += 22) g.fillRect(0, y, W, 1);
    g.fillStyle = 'rgba(0,0,0,.18)'; for (let x = 0; x < W; x += 46) g.fillRect(x, 0, 1, H);
    for (let i = 0; i < 900; i++) {
      e2.fillStyle = Math.random() < 0.2 ? 'rgba(255,50,30,1)' : 'rgba(255,235,215,.8)';
      e2.fillRect(Math.random() * W, Math.random() * H, 2, 1);
    }
    g.fillStyle = '#0b0b0c'; g.fillRect(0, H / 2 - 7, W, 14);
    g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(0, H / 2 - 9, W, 2);
    const cx = (phi / (2 * Math.PI)) * W, cy = (th / Math.PI) * H, ry = (ar / Math.PI) * H, rx = ((ar / (2 * Math.PI)) * W) / Math.sin(th);
    g.save(); g.translate(cx, cy); g.scale(rx / ry, 1);
    const gr = g.createRadialGradient(-ry * 0.2, -ry * 0.2, 0, 0, 0, ry);
    gr.addColorStop(0, '#2c2c2f'); gr.addColorStop(0.72, '#141416'); gr.addColorStop(0.93, '#070707'); gr.addColorStop(1, '#6a6a6e');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, ry, 0, 6.283); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 2;
    for (let k = 1; k < 6; k++) { g.beginPath(); g.arc(0, 0, (ry * k) / 6, 0, 6.283); g.stroke(); }
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * 6.283;
      g.beginPath(); g.moveTo(Math.cos(a) * ry * 0.2, Math.sin(a) * ry * 0.2); g.lineTo(Math.cos(a) * ry * 0.95, Math.sin(a) * ry * 0.95); g.stroke();
    }
    g.restore();

    const map = new T.CanvasTexture(tc); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 4;
    const emap = new T.CanvasTexture(ec); emap.colorSpace = T.SRGBColorSpace;
    const mat = new T.MeshStandardMaterial({ map, roughness: 0.82, metalness: 0.28, emissive: 0xffffff, emissiveMap: emap, emissiveIntensity: 0.55 });
    const group = new T.Group();
    group.add(new T.Mesh(new T.SphereGeometry(R, 160, 80), mat));
    scene.add(group);

    const dl = new T.Vector3(-Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th));
    const dish = new T.Object3D();
    dish.position.copy(dl.clone().multiplyScalar(R));
    dish.lookAt(dl.clone().multiplyScalar(R * 2));
    group.add(dish);

    const gc = document.createElement('canvas'); gc.width = gc.height = 128;
    const g3 = gc.getContext('2d')!;
    const rg = g3.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.18, 'rgba(255,80,60,.9)'); rg.addColorStop(0.45, 'rgba(225,6,0,.35)'); rg.addColorStop(1, 'rgba(225,6,0,0)');
    g3.fillStyle = rg; g3.fillRect(0, 0, 128, 128);
    const glowTex = new T.CanvasTexture(gc);
    const additive = { transparent: true, blending: T.AdditiveBlending, depthWrite: false };
    const focalZ = 0.55, rimR = R * Math.sin(ar) * 0.9;

    const dishGlow = new T.Sprite(new T.SpriteMaterial({ ...additive, map: glowTex, color: 0xe10600, opacity: 0 }));
    dishGlow.position.set(0, 0, 0.05); dish.add(dishGlow);
    const focal = new T.Sprite(new T.SpriteMaterial({ ...additive, map: glowTex, color: 0xffffff, opacity: 0 }));
    focal.position.set(0, 0, focalZ); dish.add(focal);

    const up = new T.Vector3(0, 1, 0);
    const cyl = (rad: number, col: number, op: number) =>
      new T.Mesh(new T.CylinderGeometry(rad, rad, 1, 20, 1, true), new T.MeshBasicMaterial({ ...additive, color: col, opacity: op }));
    const place = (m: T.Object3D, a: T.Vector3, b: T.Vector3) => {
      const d = b.clone().sub(a), L = d.length();
      m.scale.set(1, Math.max(L, 1e-4), 1);
      m.position.copy(a).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(up, d.normalize());
    };
    const rims: T.Mesh<T.CylinderGeometry, T.MeshBasicMaterial>[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * 6.283;
      const m = cyl(0.012, 0xff2a1f, 0);
      place(m, new T.Vector3(Math.cos(a) * rimR, Math.sin(a) * rimR, -0.03), new T.Vector3(0, 0, focalZ));
      dish.add(m); rims.push(m);
    }
    const core = cyl(0.03, 0xffffff, 0.95), glow = cyl(0.1, 0xff2a1f, 0.45), haze = cyl(0.26, 0xe10600, 0.14);
    [core, glow, haze].forEach((m) => { m.visible = false; scene.add(m); });
    const tip = new T.Sprite(new T.SpriteMaterial({ ...additive, map: glowTex, color: 0xffffff, opacity: 0 }));
    scene.add(tip);
    const pl = new T.PointLight(0xff2a1f, 0, 7, 1.5);
    dish.add(pl); pl.position.set(0, 0, 0.8);
    scene.add(new T.AmbientLight(0xffffff, 0.12));
    const key = new T.DirectionalLight(0xfff1e6, 1.5); key.position.set(-5, 4, 6); scene.add(key);
    const rim = new T.DirectionalLight(0xe10600, 2.6); rim.position.set(6, 1.5, -4); scene.add(rim);

    const resize = () => { const w = c.clientWidth, h = c.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    resize();
    window.addEventListener('resize', resize);

    const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const fw = new T.Vector3(), tgt = new T.Vector3();
    let p = 0, raf = 0, ready = false;
    const t0 = performance.now();
    const loop = () => {
      const t = (performance.now() - t0) / 1000;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const goal = Math.min(1, window.scrollY / max);
      p += (goal - p) * (reduced ? 1 : 0.08);
      const mob = cam.aspect < 1, s = mob ? 0.62 : 1, wob = reduced ? 0 : 1;
      group.scale.setScalar(s);
      group.position.set((mob ? 0.75 : 3.0) + Math.sin(t * 0.22) * 0.18 * wob, (mob ? 1.7 : 0.45) + Math.sin(t * 0.17) * 0.06 * wob, 0);
      group.rotation.set(0.12, -0.1 + Math.sin(t * 0.06) * 0.14 * wob, 0);
      group.updateMatrixWorld(true);
      const charge = sm(0.14, 0.42, p), conv = sm(0.26, 0.46, p), beam = Math.pow(Math.min(1, Math.max(0, (p - 0.44) / 0.56)), 1.35);
      dishGlow.material.opacity = charge * 0.85;
      dishGlow.scale.setScalar((0.4 + charge * 1.6) * (1 + Math.sin(t * 6) * 0.04 * charge));
      focal.material.opacity = conv;
      focal.scale.setScalar(0.15 + conv * 0.55 + beam * 0.4);
      pl.intensity = charge * 6 + beam * 10;
      rims.forEach((m, i) => { m.material.opacity = conv * (0.7 + 0.3 * Math.sin(t * 18 + i)); });
      focal.getWorldPosition(fw);
      tgt.set(cam.position.x - 0.2, cam.position.y - 0.3, cam.position.z - 1.5);
      const on = beam > 0.002;
      [core, glow, haze].forEach((m) => { m.visible = on; });
      tip.visible = on;
      if (on) {
        const end = fw.clone().lerp(tgt, beam);
        place(core, fw, end); place(glow, fw, end); place(haze, fw, end);
        const fl = 1 + Math.sin(t * 38) * 0.06;
        core.material.opacity = 0.95 * fl; glow.material.opacity = 0.45 * fl;
        tip.position.copy(end);
        tip.material.opacity = Math.min(1, beam * 3);
        tip.scale.setScalar((0.35 + beam * 0.9) * s);
      }
      r.render(scene, cam);
      if (!ready) { ready = true; onReady(); }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      r.dispose();
      map.dispose(); emap.dispose(); glowTex.dispose(); mat.dispose();
    };
  }, [reduced, onReady]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
