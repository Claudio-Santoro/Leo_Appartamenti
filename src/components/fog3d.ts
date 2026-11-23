// Nebbia in profondità con three.js, solo desktop (la carica Fog.astro con import()).
// Banchi di nebbia a strati: sprite con texture di rumore morbido, a profondità diverse, che scivolano
// verso la camera e salgono dalla valle. Il movimento è tutto nello shader: JS aggiorna solo pochi uniform.
// Il cursore apre un varco (più largo nei banchi vicini) che si richiude piano; di notte la nebbia
// prende la luce ambra dei lampioni, vicino al lampione vero della foto e attorno al cursore.
import {
  WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, InstancedBufferGeometry, InstancedBufferAttribute,
  Mesh, ShaderMaterial, CanvasTexture, Vector2, Color, NormalBlending, LinearFilter,
} from 'three';

const VERT = /* glsl */ `
attribute vec3 aBase; attribute vec2 aScale; attribute float aRot; attribute float aAlpha; attribute float aSeed;
uniform float uTime; uniform float uRange;
varying vec2 vUv; varying float vAlpha; varying float vDepth; varying float vSeed;
void main() {
  vUv = uv; vAlpha = aAlpha; vSeed = aSeed;
  // ogni banco avanza verso la camera e, uscito davanti, ricomincia in fondo
  float z = -1000.0 + mod(aBase.z + uTime * (9.0 + 6.0 * aSeed), uRange);
  float x = aBase.x + sin(uTime * 0.04 + aSeed * 6.283) * 60.0 + uTime * 4.0 * (aSeed - 0.35);
  x = mod(x + 1300.0, 2600.0) - 1300.0;                          // il vento li porta di lato, senza esaurirli
  float y = aBase.y + sin(uTime * 0.03 + aSeed * 11.0) * 18.0 + uTime * 0.0;
  float a = aRot + uTime * 0.015 * (aSeed - 0.5);
  vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (position.xy * aScale);
  vec4 mv = modelViewMatrix * vec4(vec3(x, y, z) + vec3(p, 0.0), 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform sampler2D uTex0; uniform sampler2D uTex1; uniform sampler2D uTex2;
uniform vec2 uRes; uniform vec2 uMouse; uniform float uHole; uniform float uNight; uniform vec2 uLamp; uniform float uDensity;
uniform vec3 uDay; uniform vec3 uDusk;
varying vec2 vUv; varying float vAlpha; varying float vDepth; varying float vSeed;
void main() {
  vec4 t = vSeed < 0.33 ? texture2D(uTex0, vUv) : vSeed < 0.66 ? texture2D(uTex1, vUv) : texture2D(uTex2, vUv);
  float a = t.a * vAlpha * uDensity;
  a *= smoothstep(25.0, 160.0, vDepth) * (1.0 - smoothstep(760.0, 1000.0, vDepth)); // compare in fondo, svanisce addosso
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  a *= 0.3 + 0.9 * (1.0 - smoothstep(0.1, 0.9, uv.y));                // più densa in basso: sale dalla valle
  float near = 1.0 - smoothstep(120.0, 650.0, vDepth);
  float d = length((uv - uMouse) * vec2(asp, 1.0));
  float hole = smoothstep(0.04, 0.22 + 0.14 * near, d);
  a *= mix(1.0, hole, uHole * (0.35 + 0.65 * near));                    // il varco: i banchi vicini si aprono di più
  vec3 col = mix(uDay, uDusk, uNight);
  col *= 0.84 + 0.2 * vUv.y;                                            // un filo d'ombra sotto ogni banco: volume
  float dl = length((uv - uLamp) * vec2(asp, 1.0));
  col = mix(col, vec3(1.0, 0.74, 0.38), uNight * (1.0 - smoothstep(0.0, 0.42, dl)) * 0.9);  // il lampione
  col = mix(col, vec3(1.0, 0.8, 0.5), uNight * uHole * (1.0 - smoothstep(0.0, 0.3, d)) * 0.45); // la lanterna
  gl_FragColor = vec4(col * a, a);
}`;

// Un ciuffo di nebbia: tante macchie morbide sovrapposte, con i bordi che sfumano a zero.
function puff(seed: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d')!;
  for (let i = 0; i < 26; i++) {
    const x = 128 + (rnd() - 0.5) * 150, y = 128 + (rnd() - 0.5) * 80, r = 30 + rnd() * 70;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, `rgba(255,255,255,${0.18 + rnd() * 0.18})`); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  }
  for (let i = 0; i < 900; i++) { // fili sottili: la nebbia vera è sfilacciata
    g.fillStyle = `rgba(255,255,255,${rnd() * 0.05})`;
    g.fillRect(128 + (rnd() - 0.5) * 220, 128 + (rnd() - 0.5) * 120, 1 + rnd() * 10, 1);
  }
  g.globalCompositeOperation = 'destination-in';
  const m = g.createRadialGradient(128, 128, 20, 128, 128, 126);
  m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = m; g.fillRect(0, 0, 256, 256);
  const tex = new CanvasTexture(c); tex.minFilter = tex.magFilter = LinearFilter; tex.generateMipmaps = false;
  return tex;
}

export function startFog3d(host: HTMLElement, density = 1) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  const cv = renderer.domElement;
  cv.className = 'fog-canvas'; cv.setAttribute('aria-hidden', 'true');
  host.insertBefore(cv, host.querySelector('.fog-canvas') ?? null);

  const scene = new Scene();
  const camera = new PerspectiveCamera(52, 1, 1, 1200);

  // ponytail: 110 banchi bastano a coprire l'inquadratura; più banchi = più costo di riempimento.
  const N = 110, base = new Float32Array(N * 3), scale = new Float32Array(N * 2), rot = new Float32Array(N), alpha = new Float32Array(N), seed = new Float32Array(N);
  let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < N; i++) {
    base[i * 3] = (rnd() - 0.5) * 2600;
    base[i * 3 + 1] = -460 + Math.pow(rnd(), 1.7) * 560;   // più banchi in basso
    base[i * 3 + 2] = rnd() * 975;
    const w = 420 + rnd() * 520; scale[i * 2] = w; scale[i * 2 + 1] = w * (0.42 + rnd() * 0.2); // banchi larghi e bassi
    rot[i] = (rnd() - 0.5) * 0.5; alpha[i] = 0.32 + rnd() * 0.4; seed[i] = rnd();
  }
  const geo = new InstancedBufferGeometry().copy(new PlaneGeometry(1, 1) as any);
  geo.instanceCount = N;
  geo.setAttribute('aBase', new InstancedBufferAttribute(base, 3));
  geo.setAttribute('aScale', new InstancedBufferAttribute(scale, 2));
  geo.setAttribute('aRot', new InstancedBufferAttribute(rot, 1));
  geo.setAttribute('aAlpha', new InstancedBufferAttribute(alpha, 1));
  geo.setAttribute('aSeed', new InstancedBufferAttribute(seed, 1));

  const U = {
    uTime: { value: 0 }, uRange: { value: 975 }, uRes: { value: new Vector2(1, 1) },
    uMouse: { value: new Vector2(-2, -2) }, uHole: { value: 0 }, uNight: { value: 0 }, uLamp: { value: new Vector2(-2, -2) },
    uDensity: { value: density }, uDay: { value: new Color(0.95, 0.95, 0.93) }, uDusk: { value: new Color(0.42, 0.46, 0.52) },
    uTex0: { value: puff(11) }, uTex1: { value: puff(29) }, uTex2: { value: puff(47) },
  };
  const mat = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: U, transparent: true, depthWrite: false, depthTest: false, blending: NormalBlending, premultipliedAlpha: true });
  const mesh = new Mesh(geo, mat); mesh.frustumCulled = false; scene.add(mesh);

  // La nebbia è morbida: la disegniamo a bassa risoluzione e la allarga il browser.
  let ratio = 0.5;
  const halo = host.querySelector<HTMLElement>('.lamp-halo'); // c'è solo nell'apertura
  const size = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setPixelRatio(ratio); renderer.setSize(w, h, false);
    cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.getDrawingBufferSize(U.uRes.value);
    if (halo && !halo.hidden) {
      const hb = host.getBoundingClientRect(), lb = halo.getBoundingClientRect();
      U.uLamp.value.set((lb.left + lb.width / 2 - hb.left) / hb.width, 1 - (lb.top + lb.height / 2 - hb.top) / hb.height);
    } else U.uLamp.value.set(-2, -2);
  };
  size(); new ResizeObserver(size).observe(host);

  const root = document.documentElement;
  let nightGoal = root.dataset.time === 'night' ? 1 : 0; U.uNight.value = nightGoal;
  new MutationObserver(() => { nightGoal = root.dataset.time === 'night' ? 1 : 0; }).observe(root, { attributes: true, attributeFilter: ['data-time'] });

  // Varco e parallasse seguono il mouse con ritardo, come nebbia che si sposta e si richiude.
  const goal = { x: 0.5, y: 0.5, hole: 0 }, pos = { x: 0.5, y: 0.5 };
  host.addEventListener('pointermove', (e) => {
    const b = host.getBoundingClientRect();
    goal.x = (e.clientX - b.left) / b.width; goal.y = 1 - (e.clientY - b.top) / b.height; goal.hole = 1;
  });
  host.addEventListener('pointerleave', () => { goal.hole = 0; });

  let raf = 0, visible = false, last = performance.now(), slow = 0, frames = 0;
  const t0 = last - 30000; // parte già "a regime", con i banchi distribuiti
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = now - last; last = now;
    pos.x += (goal.x - pos.x) * 0.05; pos.y += (goal.y - pos.y) * 0.05;
    U.uHole.value += (goal.hole - U.uHole.value) * 0.03;
    U.uNight.value += (nightGoal - U.uNight.value) * 0.04;
    U.uMouse.value.set(pos.x, pos.y);
    camera.position.x = (pos.x - 0.5) * 60; camera.position.y = (pos.y - 0.5) * 30; // parallasse: i banchi vicini si spostano di più
    U.uTime.value = (now - t0) / 1000;
    renderer.render(scene, camera);
    if (frames++ > 5 && dt > 30) slow++;
    if (slow > 30 && ratio > 0.26) { ratio *= 0.75; slow = 0; size(); } // fotogrammi lenti: meno pixel
  };
  const sync = () => { cancelAnimationFrame(raf); if (visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(host);
  document.addEventListener('visibilitychange', sync);
  requestAnimationFrame(() => cv.classList.add('ready'));
}
