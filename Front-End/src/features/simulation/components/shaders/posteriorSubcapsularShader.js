const posteriorSubcapsularShader = {
  uniforms: {
    tDiffuse: { value: null },
    severity: { value: 0.5 },
    resolution: { value: null }
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
    uniform vec2 resolution;
    varying vec2 vUv;

    void main() {

      vec4 base = texture2D(tDiffuse, vUv);

      // ----- Central cloudy opacity -----
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);

      float cloud = smoothstep(0.4, 0.05, dist);
      float fogStrength = cloud * severity;

      // ----- Strong multi-sample blur (lens opacity) -----
      float blurAmount = 6.0 * severity / resolution.x;
      vec4 blur = vec4(0.0);

      for(int x = -2; x <= 2; x++){
        for(int y = -2; y <= 2; y++){
          vec2 offset = vec2(float(x), float(y)) * blurAmount;
          blur += texture2D(tDiffuse, vUv + offset);
        }
      }
      blur /= 25.0;

      vec4 mixed = mix(base, blur, fogStrength);

      // ----- Light scattering / glare -----
      float brightness = dot(base.rgb, vec3(0.299, 0.587, 0.114));
      float glare = smoothstep(0.5, 1.0, brightness);
      mixed.rgb += glare * severity * 0.6;

      // ----- Contrast reduction -----
      mixed.rgb = mix(vec3(0.5), mixed.rgb, 1.0 - severity * 0.6);

      // ----- Slight desaturation -----
      float gray = dot(mixed.rgb, vec3(0.299, 0.587, 0.114));
      mixed.rgb = mix(mixed.rgb, vec3(gray), severity * 0.35);

      gl_FragColor = mixed;
    }
  `
};

export default posteriorSubcapsularShader;