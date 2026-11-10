/**
 * Shaders GLSL de la escena. Ruido simplex 3D de Ashima Arts / Stefan
 * Gustavson (licencia MIT).
 */

export const simplexNoise = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

/* ---------- Partículas: seis formaciones que se interpolan ---------- */

export const particlesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uStage;
  uniform float uIntro;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uMouseStrength;
  uniform float uFocusX;
  uniform vec3 uMouse;
  uniform vec3 uBlue;
  uniform vec3 uViolet;
  uniform vec3 uCyan;

  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute vec3 aP5;
  attribute vec3 aDust;
  attribute vec3 aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  ${simplexNoise}

  // Avance hacia la formación k, con un pequeño desfase por partícula
  float stageMix(float k) {
    float t = clamp(uStage - (k - 1.0), 0.0, 1.0);
    t = clamp(t * 1.4 - aRandom.x * 0.4, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    vec3 p = position;
    p = mix(p, aP1, stageMix(1.0));
    p = mix(p, aP2, stageMix(2.0));
    p = mix(p, aP3, stageMix(3.0));
    p = mix(p, aP4, stageMix(4.0));
    p = mix(p, aP5, stageMix(5.0));

    // Deriva orgánica: cada partícula flota sobre un campo de ruido
    float t = uTime * 0.14;
    p += vec3(
      snoise(p * 0.7 + vec3(t, 0.0, 0.0)),
      snoise(p * 0.7 + vec3(17.3, t, 0.0)),
      snoise(p * 0.7 + vec3(0.0, 41.7, t))
    ) * 0.075;

    // Entrada: el núcleo se condensa desde el polvo
    float intro = clamp(uIntro * 1.6 - aRandom.y * 0.6, 0.0, 1.0);
    intro = 1.0 - pow(1.0 - intro, 3.0);
    p = mix(aDust, p, intro);

    // El puntero aparta las partículas cercanas
    vec3 d = p - uMouse;
    float f = exp(-dot(d, d) * 1.8) * uMouseStrength;
    p += normalize(d + vec3(1e-4)) * f * 0.55;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aRandom.z * uPixelRatio / -mv.z;

    vec3 c = mix(uBlue, uViolet, smoothstep(0.15, 0.85, aRandom.x));
    c = mix(c, uCyan, step(0.84, aRandom.y));
    float twinkle = 0.62 + 0.38 * sin(uTime * 1.6 + aRandom.y * 60.0);
    // En la formación "señal", el nodo del paso activo brilla más
    float signal = 1.0 - clamp(abs(uStage - 2.0), 0.0, 1.0);
    float focus = exp(-pow(aP2.x - uFocusX, 2.0) * 4.0) * signal;
    vColor = c * twinkle * (1.0 + f * 2.0 + focus * 1.8);
    vAlpha = uOpacity * intro;
  }
`;

export const particlesFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.7);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* ---------- Núcleo: cristal oscuro con borde de neón y superficie viva ---------- */

export const coreVertex = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  ${simplexNoise}

  void main() {
    float t = uTime * 0.22;
    float n = snoise(normal * 1.35 + vec3(t)) * 0.6 + snoise(normal * 3.1 - vec3(t * 1.6)) * 0.4;
    vNoise = n;
    vec3 p = position + normal * n * (0.1 + uEnergy * 0.08);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const coreFragment = /* glsl */ `
  uniform float uTime;
  uniform float uVisibility;
  uniform vec3 uBlue;
  uniform vec3 uViolet;
  uniform vec3 uCyan;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.4);
    // Bandas iridiscentes que recorren la superficie
    float bands = 0.5 + 0.5 * sin(vNoise * 9.0 + uTime * 0.8);
    vec3 rim = mix(uViolet, uCyan, clamp(vNoise * 0.5 + 0.5, 0.0, 1.0));
    vec3 body = vec3(0.012, 0.016, 0.04) + uBlue * bands * 0.07;
    vec3 color = body + rim * fresnel * 1.55;
    float alpha = (0.55 + fresnel * 0.45) * uVisibility;
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* ---------- Sinapsis: arcos con pulsos de luz ---------- */

export const synapseVertex = /* glsl */ `
  attribute float aAlong;
  attribute float aSeed;
  varying float vAlong;
  varying float vSeed;

  void main() {
    vAlong = aAlong;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const synapseFragment = /* glsl */ `
  uniform float uTime;
  uniform float uVisibility;
  uniform vec3 uBlue;
  uniform vec3 uCyan;
  varying float vAlong;
  varying float vSeed;

  void main() {
    float head = fract(uTime * (0.22 + vSeed * 0.25) + vSeed * 7.0);
    float pulse = smoothstep(0.14, 0.0, abs(head - vAlong));
    float base = 0.08;
    vec3 color = mix(uBlue, uCyan, pulse) * (base + pulse * 2.4);
    gl_FragColor = vec4(color, (base + pulse) * uVisibility);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
