import * as THREE from "three";

const NuclearShader = {
  uniforms: {
    tDiffuse: { value: null },
    severity: { value: 0.0 },
    resolution: { value: new THREE.Vector2() }, 
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
      vec4 color = texture2D(tDiffuse, vUv);

      color.r += severity * 0.15;
      color.g += severity * 0.1;
      color.b -= severity * 0.2;

      color.rgb = mix(color.rgb, vec3(dot(color.rgb, vec3(0.299, 0.587, 0.114))), severity * 0.4);

      gl_FragColor = color;
    }
  `,
};

export default NuclearShader;