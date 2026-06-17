export const cscrShader = {
  uniforms: {
    tDiffuse: { value: null },
    severity: { value: 0.5 },
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

    vec4 strongBlur(sampler2D image, vec2 uv, float intensity) {
      vec2 texelSize = intensity / resolution; 
      vec4 blurColor = vec4(0.0);
      
      blurColor += texture2D(image, uv + vec2(-texelSize.x, -texelSize.y));
      blurColor += texture2D(image, uv + vec2(0.0, -texelSize.y));
      blurColor += texture2D(image, uv + vec2(texelSize.x, -texelSize.y));
      
      blurColor += texture2D(image, uv + vec2(-texelSize.x, 0.0));
      blurColor += texture2D(image, uv + vec2(0.0, 0.0));
      blurColor += texture2D(image, uv + vec2(texelSize.x, 0.0));
      
      blurColor += texture2D(image, uv + vec2(-texelSize.x, texelSize.y));
      blurColor += texture2D(image, uv + vec2(0.0, texelSize.y));
      blurColor += texture2D(image, uv + vec2(texelSize.x, texelSize.y));
      
      return blurColor / 9.0;
    }
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      float blurOffset = smoothstep(0.1, 0.6, dist) * severity * 0.015;

      vec4 color = texture2D(tDiffuse, vUv); 
      color += texture2D(tDiffuse, vUv + vec2(blurOffset, blurOffset));
      color += texture2D(tDiffuse, vUv + vec2(-blurOffset, blurOffset));
      color += texture2D(tDiffuse, vUv + vec2(blurOffset, -blurOffset));
      color += texture2D(tDiffuse, vUv + vec2(-blurOffset, -blurOffset));
      color /= 5.0;

      float radius = 1.0 * severity;
      float scotoma = 1.0 - smoothstep(0.0, radius, dist);
      
      vec3 blackSpot = vec3(0.0, 0.0, 0.0); 
      
      float intensity = scotoma * severity; 
      
      color.rgb = mix(color.rgb, blackSpot, intensity);

      gl_FragColor = color;
    }
`
};

export default cscrShader;