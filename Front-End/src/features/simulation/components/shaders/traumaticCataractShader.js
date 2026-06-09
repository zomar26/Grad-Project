const traumaticCataractShader = {
  uniforms: {
    tDiffuse: { value: null },
    severity: { value: 0.5 }
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
    varying vec2 vUv;

    void main() {

      vec4 baseColor = texture2D(tDiffuse, vUv);

      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);

      float angle = atan(vUv.y - center.y, vUv.x - center.x);
      float star = abs(sin(angle * 6.0)) * 0.5;

      float opacityMask = smoothstep(0.2, 0.5, dist);
      float traumaOpacity = (1.0 - opacityMask) * severity;

      float offset = 0.002 * severity;
      vec4 blurSample =
        texture2D(tDiffuse, vUv + vec2(offset, 0.0)) +
        texture2D(tDiffuse, vUv - vec2(offset, 0.0)) +
        texture2D(tDiffuse, vUv + vec2(0.0, offset)) +
        texture2D(tDiffuse, vUv - vec2(0.0, offset));
      blurSample *= 0.25;

      vec4 mixed = mix(baseColor, blurSample, severity * 0.6);

      mixed.rgb += star * severity * 0.2;

      float gray = dot(mixed.rgb, vec3(0.299, 0.587, 0.114));
      mixed.rgb = mix(mixed.rgb, vec3(gray), severity * 0.3);

      mixed.rgb = mix(mixed.rgb, vec3(1.0), traumaOpacity * 0.4);

      gl_FragColor = mixed;
    }
  `
};

export default traumaticCataractShader;