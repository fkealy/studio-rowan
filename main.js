import * as THREE from "three";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 720px)").matches;

// Signal that JS is in control — CSS uses this to set the pre-reveal state,
// so the page degrades gracefully (fully visible) if the script never runs.
document.documentElement.classList.add("js-ready");

/* ------------------------------------------------------------------ *
 *  WebGL — a quiet topographic field. Fine ink contour lines breathe
 *  across white paper and recede to a clean horizon: a calm landscape
 *  drawn with the fewest possible marks. Do more with less.
 * ------------------------------------------------------------------ */

const noiseGLSL = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uAmp;
  uniform vec2 uMouse;     // cursor projected onto the ground plane (x,z)
  attribute float aDepth;  // 0 = far horizon, 1 = near foreground
  varying float vAlpha;
  varying float vDepth;
  ${noiseGLSL}

  void main(){
    vec3 p = position;
    float t = uTime * 0.07;

    // Two octaves of rolling terrain — broad swell + finer ripple.
    float h = snoise(vec3(p.x * 0.05, p.z * 0.06, t)) * 2.4
            + snoise(vec3(p.x * 0.13 + 9.0, p.z * 0.11, t * 1.45)) * 0.8;

    // A soft swell follows the cursor.
    float md = distance(p.xz, uMouse);
    h += exp(-md * md * 0.018) * 1.7;

    // Foreground reads taller than the horizon.
    h *= mix(0.35, 1.0, aDepth);
    p.y += h * uAmp * uReveal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

    // Fade the far rows into the white horizon.
    vAlpha = smoothstep(0.0, 0.4, aDepth) * uReveal;
    vDepth = aDepth;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uAlphaScale;
  varying float vAlpha;
  varying float vDepth;
  void main(){
    // Near lines a touch darker; distant lines barely there.
    float a = vAlpha * mix(0.06, 0.30, vDepth) * uAlphaScale;
    gl_FragColor = vec4(uColor, a);
  }
`;

class Landscape {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = new THREE.Vector2(0, 0);
    this.target = new THREE.Vector2(0, 0);
    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.build();
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.bindPointer();
  }

  build() {
    const COLS = isMobile ? 120 : 190; // points along each contour
    const ROWS = isMobile ? 36 : 56; // number of contour lines
    const W = 52; // world width
    const D = 42; // world depth (front to horizon)

    const positions = [];
    const depths = [];

    for (let r = 0; r < ROWS; r++) {
      const dt = r / (ROWS - 1); // 0 = far, 1 = near
      const z = -D * 0.5 + dt * D;
      for (let c = 0; c < COLS - 1; c++) {
        const x0 = -W * 0.5 + (c / (COLS - 1)) * W;
        const x1 = -W * 0.5 + ((c + 1) / (COLS - 1)) * W;
        positions.push(x0, 0, z, x1, 0, z); // one line segment
        depths.push(dt, dt);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("aDepth", new THREE.Float32BufferAttribute(depths, 1));

    this.uniforms = {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uAmp: { value: isMobile ? 0.66 : 1 },
      uAlphaScale: { value: isMobile ? 0.72 : 1 },
      uMouse: { value: new THREE.Vector2(0, -100) },
      uColor: { value: new THREE.Color("#15150f") },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.lines = new THREE.LineSegments(geo, mat);
    this.group.add(this.lines);

    this.W = W;
    this.D = D;
  }

  bindPointer() {
    const move = (x, y) => {
      const nx = (x / window.innerWidth) * 2 - 1;
      const ny = -((y / window.innerHeight) * 2 - 1);
      this.target.set(nx, ny);
    };
    window.addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
    window.addEventListener("pointerleave", () => this.target.set(0, 0), { passive: true });
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    // Frame the plane: sit above it, look toward the horizon.
    // Narrow / portrait screens pull the camera back so the field still fills.
    const portraitPull = Math.max(0, 0.9 - w / h) * 10;
    this.camera.position.set(0, 4.4, 22 + portraitPull);
    this.camera.lookAt(0, -3.2, -7);
    this.camera.updateProjectionMatrix();
  }

  render() {
    const dt = this.clock.getDelta();
    if (!reduceMotion) this.uniforms.uTime.value += dt;

    this.mouse.lerp(this.target, 0.05);

    // Project the cursor roughly onto the ground plane for the swell.
    this.uniforms.uMouse.value.set(
      this.mouse.x * this.W * 0.42,
      -this.mouse.y * this.D * 0.42
    );

    // Whisper-soft parallax.
    this.group.rotation.y = this.mouse.x * 0.05;
    this.camera.position.x = this.mouse.x * 1.4;
    this.camera.lookAt(0, -3.2, -7);

    this.renderer.render(this.scene, this.camera);
  }
}

/* ------------------------------------------------------------------ *
 *  Boot: loader → reveal
 * ------------------------------------------------------------------ */

const canvas = document.getElementById("scene");
const field = new Landscape(canvas);

function loop() {
  field.render();
  requestAnimationFrame(loop);
}
loop();

let started = false;
function revealField() {
  if (started) return;
  started = true;
  gsap.to(field.uniforms.uReveal, {
    value: 1,
    duration: reduceMotion ? 0 : 3.2,
    ease: "power2.out",
  });
}

const loader = document.getElementById("loader");
const loaderNum = document.getElementById("loaderNum");
const loaderFill = document.getElementById("loaderFill");

function intro() {
  revealField();

  const lines = document.querySelectorAll(".hero__title .line__inner");
  gsap.set(lines, { yPercent: 110 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (!reduceMotion) {
    tl.to(loader, { yPercent: -100, duration: 1.0, ease: "power4.inOut" });
  } else {
    gsap.set(loader, { display: "none" });
  }

  tl.to(lines, {
    yPercent: 0,
    duration: 1.2,
    stagger: 0.12,
    clearProps: "transform",
  }, reduceMotion ? 0 : "-=0.55")
    .to("[data-reveal]", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.05,
    }, "-=0.8");
}

function runLoader() {
  if (reduceMotion) {
    loaderNum.textContent = "100";
    loaderFill.style.width = "100%";
    intro();
    return;
  }
  const state = { v: 0 };
  gsap.to(state, {
    v: 100,
    duration: 1.8,
    ease: "power2.inOut",
    onUpdate() {
      const val = Math.round(state.v);
      loaderNum.textContent = val;
      loaderFill.style.width = val + "%";
    },
    onComplete: intro,
  });
}

if (document.fonts && document.fonts.ready) {
  Promise.race([
    document.fonts.ready,
    new Promise((r) => setTimeout(r, 1200)),
  ]).then(runLoader);
} else {
  window.addEventListener("load", runLoader);
}
