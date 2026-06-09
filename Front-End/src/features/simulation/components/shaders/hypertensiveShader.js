export const hypertensiveShader = {
  uniforms: {
    tDiffuse: { value: null },
    severity: { value: 0.5 },
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
    uniform float severity;
    uniform float time;
    varying vec2 vUv;

    float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = rand(i);
        float b = rand(i + vec2(1.0, 0.0));
        float c = rand(i + vec2(0.0, 1.0));
        float d = rand(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float gradientNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      float a = sin(dot(i, vec2(12.7, 31.1)));
      float b = sin(dot(i + vec2(1.0, 0.0), vec2(12.7, 31.1)));
      float c = sin(dot(i + vec2(0.0, 1.0), vec2(12.7, 31.1)));
      float d = sin(dot(i + vec2(1.0, 1.0), vec2(12.7, 31.1)));
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = vUv;
      float wave = gradientNoise(uv * 3.0 + time * 0.2);

      vec4 blurColor = vec4(0.0);
      float blurStep = severity * 0.02;
      blurColor += texture2D(tDiffuse, uv + vec2(blurStep, 0.0));
      blurColor += texture2D(tDiffuse, uv - vec2(blurStep, 0.0));
      blurColor += texture2D(tDiffuse, uv + vec2(0.0, blurStep));
      blurColor += texture2D(tDiffuse, uv - vec2(0.0, blurStep));
      blurColor += texture2D(tDiffuse, uv + vec2(blurStep * 0.7, blurStep * 0.7));
      blurColor += texture2D(tDiffuse, uv - vec2(blurStep * 0.7, blurStep * 0.7));
      blurColor /= 6.0;

      float dist = distance(uv, vec2(0.5));
      
      vec2 ovalUv = uv * vec2(1.0, 1.5); 
      
      float blotches = noise(ovalUv * 6.0 - time * 0.4); 
      float blotches2 = noise(ovalUv * 10.0 + time * 0.2); 
      
      float finalNoise = smoothstep(0.6, 0.9, blotches * blotches2);
      
      float centerLimit = smoothstep(0.5, 0.2, dist); 
      
      float blotchIntensity = finalNoise * centerLimit * severity;
      blurColor.rgb = mix(blurColor.rgb, vec3(0.01, 0.0, 0.0), blotchIntensity * 0.9);
      
      float edgeBase = 0.4 + (wave * 0.15); 
      float vignette = smoothstep(edgeBase, 0.8, dist);
      float midHaze = smoothstep(0.0, 0.5, dist + wave * 0.1);
      blurColor.rgb = mix(blurColor.rgb * 0.85, blurColor.rgb, midHaze);

      vec3 finalColor = mix(blurColor.rgb, vec3(0.05, 0.05, 0.08), vignette * severity);
      finalColor = mix(finalColor, vec3(0.5), 0.1 * severity);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

export default hypertensiveShader;