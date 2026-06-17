export default {

 uniforms:{
  tDiffuse:{ value:null },
  severity:{ value:0.5 }
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

 float lum(vec3 c){
   return dot(c,vec3(0.2126,0.7152,0.0722));
 }

 float hash(vec2 p){
   return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
 }

 float noise(vec2 p){
   vec2 i=floor(p);
   vec2 f=fract(p);

   float a=hash(i);
   float b=hash(i+vec2(1.0,0.0));
   float c=hash(i+vec2(0.0,1.0));
   float d=hash(i+vec2(1.0,1.0));

   vec2 u=f*f*(3.0-2.0*f);

   return mix(a,b,u.x)+
          (c-a)*u.y*(1.0-u.x)+
          (d-b)*u.x*u.y;
 }

 void main(){

   vec3 color = texture2D(tDiffuse,vUv).rgb;

   vec2 center = vec2(0.5,0.5);
   float dist = distance(vUv,center);

   float radius = mix(0.05,0.10,severity);

   float irregular = noise(vUv*80.0)*0.01;

   float mask = smoothstep(
     radius,
     radius + 0.06,
     dist + irregular
   );

   float macula = 1.0 - mask;

   vec2 blur = vec2(0.004) * severity;

   vec3 blurColor =
       texture2D(tDiffuse,vUv + blur).rgb +
       texture2D(tDiffuse,vUv - blur).rgb +
       texture2D(tDiffuse,vUv + vec2(blur.x,0)).rgb +
       texture2D(tDiffuse,vUv - vec2(blur.x,0)).rgb +
       texture2D(tDiffuse,vUv + vec2(0,blur.y)).rgb +
       texture2D(tDiffuse,vUv - vec2(0,blur.y)).rgb +
       texture2D(tDiffuse,vUv + blur*2.0).rgb +
       texture2D(tDiffuse,vUv - blur*2.0).rgb +
       texture2D(tDiffuse,vUv).rgb;

   blurColor /= 9.0;

   color = mix(color, blurColor, macula);

   float brightness = lum(color);

   vec3 shifted = vec3(
      color.r + brightness*0.05,
      color.g + brightness*0.03,
      color.b - brightness*0.04
   );

   color = mix(color, shifted, macula*0.6);

   float fleckNoise = noise(vUv*200.0);

   float flecks = smoothstep(
      0.94,
      1.0,
      fleckNoise
   ) * macula * severity;

   color += vec3(1.0,0.8,0.3) * flecks * 0.25;

   float grey = lum(color);
   color = mix(color,vec3(grey),macula*0.45);

   gl_FragColor = vec4(color,1.0);
 }
 `
}