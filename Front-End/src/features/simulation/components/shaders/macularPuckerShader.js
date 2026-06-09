export default {
  uniforms: {
    tDiffuse:      { value: null },
    scotomaTex:    { value: null },
    dispTex:       { value: null },
    fovea:         { value: [0.5, 0.5] },
    radius:        { value: 0.08 },
    feather:       { value: 0.04 },
    severity:      { value: 0.6 },
    scotomaOpacity:{ value: 0.25 },
    metamorph:     { value: 0.45 },
    desaturation:  { value: 0.15 },
    wrinkleFreq:   { value: 3.0 },
    wrinkleAmp:    { value: 0.025 },
    blurAmount:    { value: 0.22 },
    traction:      { value: 0.55 },
    tractionFreq:  { value: 8.0 },
    tractionSharp: { value: 80.0 },
    resolution:    { value: [800, 600] },
    time:          { value: 0.0 }
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    precision highp float;

    varying vec2 vUv;

    uniform sampler2D tDiffuse;
    uniform sampler2D scotomaTex;
    uniform sampler2D dispTex;

    uniform vec2  fovea;
    uniform float radius;
    uniform float feather;
    uniform float severity;
    uniform float scotomaOpacity;
    uniform float metamorph;
    uniform float desaturation;
    uniform float wrinkleFreq;
    uniform float wrinkleAmp;
    uniform float blurAmount;
    uniform float traction;
    uniform float tractionFreq;
    uniform float tractionSharp;
    uniform vec2  resolution;
    uniform float time;

    float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2  u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x)
           + (c - a) * u.y * (1.0 - u.x)
           + (d - b) * u.x * u.y;
    }

    vec3 blur8(sampler2D tex, vec2 uv, float s) {
      vec2 px = 1.0 / resolution;
      vec3 c  = texture2D(tex, uv).rgb * 0.36;
      c += texture2D(tex, uv + vec2( px.x,  0.0) * s).rgb * 0.10;
      c += texture2D(tex, uv + vec2(-px.x,  0.0) * s).rgb * 0.10;
      c += texture2D(tex, uv + vec2( 0.0,  px.y) * s).rgb * 0.10;
      c += texture2D(tex, uv + vec2( 0.0, -px.y) * s).rgb * 0.10;
      c += texture2D(tex, uv + px          * s * 0.707).rgb * 0.055;
      c += texture2D(tex, uv - px          * s * 0.707).rgb * 0.055;
      c += texture2D(tex, uv + vec2( px.x, -px.y) * s * 0.707).rgb * 0.055;
      c += texture2D(tex, uv + vec2(-px.x,  px.y) * s * 0.707).rgb * 0.055;
      return c; // weights sum to 1.0
    }

    float radialFalloff(vec2 uv) {
      float d = distance(uv, fovea) / radius;
      return clamp(1.0 - smoothstep(0.0, 1.0, d), 0.0, 1.0);
    }

    vec3 iridescentSheen(
      vec2 uv,         // current UV
      vec2 tangent,    // tangent direction at this pixel
      float ridgeMask, // how strongly we're on a wrinkle ridge (0-1)
      float s          // severity
    ) {
      float shiftAmt = 0.0014 * s * ridgeMask;

      float breathe  = 1.0 + 0.18 * sin(time * 0.6);
      shiftAmt      *= breathe;

      vec2 shiftR =  tangent * shiftAmt;
      vec2 shiftB = -tangent * shiftAmt;

      float rC = texture2D(tDiffuse, clamp(uv + shiftR, 0.0, 1.0)).r;
      float gC = texture2D(tDiffuse, uv).g;
      float bC = texture2D(tDiffuse, clamp(uv + shiftB, 0.0, 1.0)).b;

      return vec3(rC, gC, bC);
    }

    void main() {
      vec2  uv = vUv;
      float s = severity;

      vec2  toC = uv - fovea;
      float r = length(toC);
      vec2  dir = r > 1e-5 ? normalize(toC) : vec2(1.0, 0.0);
      float theta = atan(toC.y, toC.x);

      vec2 tangent = vec2(-dir.y, dir.x);

      float fall = radialFalloff(uv);

      float asym = 1.0 + 0.18 * sin(theta * 1.3 + noise(uv * 20.0) * 2.0);
      fall *= pow(asym, 0.8);
      fall = clamp(fall, 0.0, 1.0);

      float phase1 = noise(uv * 40.0) * 6.28318;
      float phase2 = noise(uv * 80.0) * 6.28318 * 0.6;

      float amp = wrinkleAmp * s * pow(fall, 1.9);
      float wave1 = sin(theta * wrinkleFreq       + phase1);
      float wave2 = sin(theta * wrinkleFreq * 0.6 + phase2);
      float wave = mix(wave1, wave2, 0.45) * (0.7 + 0.3 * noise(uv * 120.0));

      vec2 tangentialOffset = tangent * wave * amp;

      vec2 disp = texture2D(dispTex, uv * 0.8 + vec2(0.02, 0.01)).rg;
      vec2 organic = (disp - 0.5) * 0.02 * s * fall;

      vec2 offsetUV = uv + tangentialOffset + organic;

      float contraction = 1.0 - (0.012 * s * fall);
      vec2  scaledUV = fovea + (offsetUV - fovea) * contraction;

      vec2  px = 1.0 / resolution;
      float eH = abs(lum(texture2D(tDiffuse, scaledUV + vec2(px.x, 0.0)).rgb)
                   - lum(texture2D(tDiffuse, scaledUV - vec2(px.x, 0.0)).rgb));
      float eV = abs(lum(texture2D(tDiffuse, scaledUV + vec2(0.0, px.y)).rgb)
                   - lum(texture2D(tDiffuse, scaledUV - vec2(0.0, px.y)).rgb));
      float edge     = clamp((eH + eV) * 12.0, 0.0, 1.0);
      float edgeMask = 1.0 - smoothstep(0.2, 0.8, edge);
      float protAmp  = amp * mix(0.4, 1.0, edgeMask);

      vec2 finalTangential = tangent * wave * protAmp;
      vec2 finalOffsetUV   = uv + finalTangential + organic;
      vec2 finalScaledUV   = fovea + (finalOffsetUV - fovea) * contraction;

      vec3 color = texture2D(tDiffuse, finalScaledUV).rgb;
      
      float blurFactor = blurAmount * s * (1.0 - smoothstep(0.0, radius, r));
      if (blurFactor > 0.01) {
        vec3 b = blur8(tDiffuse, finalScaledUV, 1.4 * blurFactor);
        color  = mix(color, b, blurFactor);
      }

      float ridgeMask = abs(wave);
      ridgeMask = smoothstep(0.55, 1.0, ridgeMask);
      ridgeMask *= pow(fall, 1.4);                   

      vec3 sheen = iridescentSheen(finalScaledUV, tangent, ridgeMask, s);
      float sheenMix = ridgeMask * s * traction * 0.55;
      color = mix(color, sheen, sheenMix);

      float crestBright = ridgeMask * fall * traction * s * 0.07;
      color += color * crestBright;

      float a = atan(dir.y, dir.x);
      float streak = cos(a * tractionFreq + noise(uv * 40.0) * 3.0);
      streak = smoothstep(0.9, 1.0, pow(abs(streak), tractionSharp));
      streak *= pow(fall, 1.4) * traction * s * 0.6;
      color += color * streak * 0.10;

      float g = lum(color);
      color = mix(color, vec3(g), desaturation * s * fall);

      vec3  mid = vec3(0.5);
      float cBoost = 1.0 + 0.06 * s * fall;
      color = (color - mid) * cBoost + mid;

      color *= mix(1.0, 0.88, pow(fall, 2.0) * 0.6 * s);

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `
};