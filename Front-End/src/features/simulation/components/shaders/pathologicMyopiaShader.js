import * as THREE from "three";

const PathologicMyopiaShader = {
  uniforms: {
    tDiffuse: { value: null },
    severity: { value: 0.5 },
    resolution: { value: new THREE.Vector2(1, 1) },
    time: { value: 0.0 },
    scotomaTex: { value: null },
    blackSpotsTex: { value: null },
    desaturation: { value: 0.45 },
    contrast: { value: 0.75 },
    flashAmount: { value: 0.0 }
  },

  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    precision mediump float;

    uniform sampler2D tDiffuse;
    uniform sampler2D scotomaTex;
    uniform sampler2D blackSpotsTex;

    uniform float severity;
    uniform vec2 resolution;
    uniform float time;
    uniform float desaturation;
    uniform float contrast;
    uniform float flashAmount;

    varying vec2 vUv;

    float noise(vec2 p){
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {

      vec2 uv = clamp(vUv, 0.0, 1.0);
      vec2 center = vec2(0.5);

      float dist = distance(uv, center);

      vec2 blurOffset = vec2(
        noise(uv + time) - 0.5,
        noise(uv * 2.0 - time) - 0.5
      ) * severity * 0.003;

      vec4 base = texture2D(tDiffuse, clamp(uv + blurOffset, 0.0, 1.0));

      float focusLoss = smoothstep(0.0, 0.8, severity);
      float blurStrength = focusLoss * 0.015;

      vec4 blur = vec4(0.0);

      blur += texture2D(tDiffuse, clamp(uv + vec2(blurStrength, 0.0), 0.0, 1.0));
      blur += texture2D(tDiffuse, clamp(uv - vec2(blurStrength, 0.0), 0.0, 1.0));
      blur += texture2D(tDiffuse, clamp(uv + vec2(0.0, blurStrength), 0.0, 1.0));
      blur += texture2D(tDiffuse, clamp(uv - vec2(0.0, blurStrength), 0.0, 1.0));
      blur *= 0.25;

      vec4 col = mix(base, blur, severity);

      vec2 scUV = clamp(uv, 0.0, 1.0);

      float scotoma = texture2D(scotomaTex, scUV).r;
      float blackSpots = texture2D(blackSpotsTex, scUV).r;

      col.rgb *= (1.0 - scotoma * severity * 0.6);
      col.rgb *= (1.0 - blackSpots * severity * 0.5);

      float peripheral = smoothstep(0.3, 1.0, dist);
      col.rgb *= (1.0 - peripheral * severity * 0.3);

      col.rgb = (col.rgb - 0.5) * (1.0 - severity * (1.0 - contrast)) + 0.5;

      float gray = dot(col.rgb, vec3(0.299, 0.587, 0.114));
      col.rgb = mix(col.rgb, vec3(gray), severity * desaturation);

      col.rgb = clamp(col.rgb, 0.0, 1.0);

      gl_FragColor = col;
    }
  `
};

export default PathologicMyopiaShader;