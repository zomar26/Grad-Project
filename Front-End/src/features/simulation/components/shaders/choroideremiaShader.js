export const choroideremiaShader = {
  uniforms: {
    tDiffuse: { value: null },
    strength: { value: 1.0 },
    center: { value: [0.5, 0.5] },
    time: { value: 0.0 }
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float strength;
    uniform vec2 center;
    uniform float time;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) +
             (c - a)* u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
    }

    float fbm(vec2 st) {
      float value = 0.0;
      float amp = 0.5;

      for(int i = 0; i < 4; i++) {
        value += amp * noise(st);
        st *= 2.0;
        amp *= 0.5;
      }
      return value;
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      float dist = distance(vUv, center);

      float vignette = smoothstep(0.1, 0.6, dist);

      vignette = pow(vignette, 1.5);

      float n = fbm(vUv * 3.0 + time * 0.05);
      float blotches = smoothstep(0.45, 0.75, n);

      float centerDamage = smoothstep(0.0, 0.2, dist);

      float mask = max(vignette * 1.0, blotches);

      mask = mix(mask, 1.0, (1.0 - centerDamage) * 0.8);

      mask *= strength;

      float blurAmount = mask * 0.00;

      vec4 blur =
        texture2D(tDiffuse, vUv + vec2( blurAmount)) +
        texture2D(tDiffuse, vUv - vec2( blurAmount)) +
        texture2D(tDiffuse, vUv + vec2(-blurAmount, blurAmount)) +
        texture2D(tDiffuse, vUv + vec2( blurAmount, -blurAmount)) +
        texture2D(tDiffuse, vUv);

      blur /= 6.0;

      vec3 darkColor = mix(blur.rgb, vec3(0.0), mask);

      float gray = dot(darkColor, vec3(0.299, 0.587, 0.114));
      darkColor = mix(darkColor, vec3(gray), mask * 0.6);

      gl_FragColor = vec4(darkColor, 1.0);
    }
  `
};

export default choroideremiaShader;