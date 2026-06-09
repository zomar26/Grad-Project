import * as THREE from "three";

export default {
 uniforms:{
  tDiffuse:{ value:null },
  severity:{ value:0.5 },
  fovea:{ value:[0.5,0.5] },
  resolution:{ value: new THREE.Vector2(800,600) },
  time:{ value:0.0 }
 },

 vertexShader:`
 varying vec2 vUv;

 void main(){
   vUv = uv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
 }
 `,

 fragmentShader:`
 varying vec2 vUv;

 uniform sampler2D tDiffuse;
 uniform float severity;
 uniform vec2 fovea;
 uniform vec2 resolution;
 uniform float time;

 float lum(vec3 c){
   return dot(c, vec3(0.2126,0.7152,0.0722));
 }

 float hash(vec2 p){
   return fract( sin(dot(p,vec2(127.1,311.7)))
    
     * 43758.5453
   );
 }

 float noise(vec2 p){

   vec2 i = floor(p);
   vec2 f = fract(p);

   float a = hash(i);
   float b = hash(i+vec2(1.0,0.0));
   float c = hash(i+vec2(0.0,1.0));
   float d = hash(i+vec2(1.0,1.0));

   vec2 u = f*f*(3.0-2.0*f);

   return
     mix(a,b,u.x)
     +(c-a)*u.y*(1.0-u.x)
     +(d-b)*u.x*u.y;
 }

 float fbm(vec2 p){

   float value = 0.0;
   float amplitude = 0.5;

   for(int i=0;i<5;i++){
     value += noise(p)*amplitude;
     p *= 2.0;
     amplitude *= 0.5;
   }
   return value;
 }

 void main(){

   vec3 color = texture2D(tDiffuse,vUv).rgb;
    
   vec2 center = vec2(0.52,0.548);
    
   vec2 p = vUv - center;

   p.x *= resolution.x / resolution.y;

   p.y *= 1.05;

   float dist = length(p);

   float tunnelRadius = mix(1.005, 0.045, pow(severity,1.04));
    
   float noiseScale = mix(0.3,1.0,severity);
  
   float angle = atan(p.y,p.x);

   float edgeNoise = sin(angle*3.0)*0.004 + sin(angle*7.0+1.7)*0.002 + ((fbm(vUv*4.0)-0.5)*0.004);
    
   edgeNoise *= noiseScale;

   float distortedDist = dist + edgeNoise;

   float feather = mix(0.08, 0.012, pow(severity,1.5));
      
   float tunnel = smoothstep( tunnelRadius, tunnelRadius + feather, distortedDist);
     
   float patchNoise = fbm(vUv*7.0);
  
   float patches = smoothstep(0.82, 0.95, dist + (patchNoise-0.5)*0.015);
    
   float patchStrength = severity * 0.25;
    
   float degeneration = max(tunnel, patches * patchStrength);
    
   color *= (1.0 - degeneration);
    
   float grey = lum(color);
    
   color = mix(color, vec3(grey), degeneration * 0.35);
     
   color *= mix(1.0, 0.78, severity);
    
   gl_FragColor = vec4(color,1.0);
    
 }
 `
};