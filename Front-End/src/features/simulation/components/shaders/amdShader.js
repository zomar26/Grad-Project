export default {
  uniforms: {
    tDiffuse: { value: null },
    scotomaTex: { value: null },
    dispTex: { value: null },
    fovea: { value: [0.5, 0.5] },
    radius: { value: 0.13 },
    feather: { value: 0.07 },
    severity: { value: 0.7 },
    scotomaOpacity: { value: 0.65 },
    metamorph: { value: 0.35 },
    desaturation: { value: 0.84 },
    resolution: { value: [800, 600] }
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform sampler2D scotomaTex;
    uniform sampler2D dispTex;
    uniform vec2 fovea;
    uniform float radius;
    uniform float feather;
    uniform float severity;
    uniform float scotomaOpacity;
    uniform float metamorph;
    uniform float desaturation;
    uniform vec2 resolution;

    float lum(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
    }

float irregularMaskCustom(vec2 uv, vec2 center, float r, float noiseScale, float noiseAmp){
    vec2 p = (uv - center) * noiseScale;

    float angle = (center.x + center.y) * 6.2831;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    p = rot * p;

    float n = 0.0;
    float amp = noiseAmp;

    for (int i = 0; i < 3; i++) {
        n += noise(p) * amp;
        p *= 2.1;
        amp *= 0.5;
    }

    float d = distance(uv, center);
    float distortion = (n - 0.5) * 0.10;
    float shaped = d + distortion;

    float base = 1.0 - smoothstep(r - feather, r + feather, shaped);
    return pow(base, 3.5);
}

float multiIrregularMask(vec2 uv){
    float globalGrowth = pow(severity, 1.85);

    float growthFactors[3];
    growthFactors[0] = 1.25; 
    growthFactors[1] = 1.85; 
    growthFactors[2] = 1.80; 

    vec2 centers[3];
    centers[0] = fovea + vec2( 0.00,  0.00);   
    centers[1] = fovea + vec2( 0.09, -0.05);   
    centers[2] = fovea + vec2(-0.07,  0.06);  

    float radii[3];
    radii[0] = 0.074;  
    radii[1] = 0.063;   
    radii[2] = 0.055;  

    float noiseScaleArr[3];
    noiseScaleArr[0] = 4.8;
    noiseScaleArr[1] = 5.7;
    noiseScaleArr[2] = 7.3;

    float noiseAmpArr[3];
    noiseAmpArr[0] = 0.60;
    noiseAmpArr[1] = 0.52;
    noiseAmpArr[2] = 0.48;

    float prodComplement = 1.0;
    float hardMax = 0.0;
    float blobVals[3];

    for (int i = 0; i < 3; i++){
        float scaledR = radii[i] * mix(1.0, growthFactors[i], globalGrowth);
        float scaledNoiseAmp = mix(noiseAmpArr[i], noiseAmpArr[i] * 1.12, pow(severity, 1.2));

        float blob = irregularMaskCustom(
            uv,
            centers[i],
            scaledR,
            noiseScaleArr[i],
            scaledNoiseAmp
        );

        blobVals[i] = blob;

        prodComplement *= (1.0 - blob);

        hardMax = max(hardMax, blob);
    }

    float softUnion = 1.0 - prodComplement; 
    float blend = smoothstep(0.88, 1.0, pow(severity, 1.65));
    float mask = mix(hardMax, softUnion, blend);
    mask = pow(mask, 1.0 + 0.5 * severity);

    return mask;
}
    
    vec3 cheapBlur(sampler2D tex, vec2 uv, float s){
      vec2 px = 1.0 / resolution;
      vec3 c = texture(tex, uv).rgb * 0.36;
      c += texture(tex, uv + vec2(px.x, 0.0) * s).rgb * 0.16;
      c += texture(tex, uv - vec2(px.x, 0.0) * s).rgb * 0.16;
      c += texture(tex, uv + vec2(0.0, px.y) * s).rgb * 0.16;
      c += texture(tex, uv - vec2(0.0, px.y) * s).rgb * 0.16;
      return c;
    }

    void main(){
      vec2 uv = vUv;
      float s = severity;

      float m = multiIrregularMask(uv);

      float distortionStrength = metamorph * s * pow(m, 1.4) * 2.3;
      vec2 d = texture(dispTex, uv * 0.7 + vec2(0.05, 0.03)).rg;
      vec2 offset = (d - 0.5) * distortionStrength * 0.1;
      vec2 displacedUV = uv + offset;

      vec3 base = texture(tDiffuse, displacedUV).rgb;
      vec3 blurred = cheapBlur(tDiffuse, displacedUV, mix(0.3, 4.0, s * m));
      vec3 color = mix(base, blurred, m * s);

      float grey = lum(color);
      vec3 desat = vec3(grey);
      color = mix(color, desat, desaturation * s * pow(m, 1.3));

      color = mix(color, vec3(0.0), pow(m, 8.0) * s);

      vec4 sc = texture(scotomaTex, uv);
      float scMask = sc.a * scotomaOpacity * s * m;
      color = mix(color, color * 0.08, scMask);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};
