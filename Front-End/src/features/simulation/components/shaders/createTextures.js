import * as THREE from "three";

export function createTextures() {

  function generateScotomaCanvas(size = 512) {
    const c = document.createElement("canvas");
    c.width = c.height = size;

    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    
    const blobs = 3 + Math.floor(Math.random() * 3); 

    for (let i = 0; i < blobs; i++) {
      const x = size * (0.45 + (Math.random() - 0.5) * 0.3); 
      const y = size * (0.45 + (Math.random() - 0.5) * 0.3);
      const r = size * (0.12 + Math.random() * 0.18);
      const g = ctx.createRadialGradient(x,y, r * 0.1, x, y, r);
      g.addColorStop( 0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2 );
      ctx.fill();
    }
    return c;
  }

  function generateDispCanvas(size = 512) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 20 + Math.random() * 80;
      const a = 0.02 + Math.random() * 0.08;
      const hue = Math.random() * 360;

      ctx.fillStyle = `hsla(${hue}, 50%, 50%, ${a})`;
      ctx.beginPath();
      ctx.arc(x, y,r,0, Math.PI * 2);
      ctx.fill();
    }
    return c;
  }

  const scCanvas = generateScotomaCanvas(512);
  const dispCanvas = generateDispCanvas(512);
  const blackCanvas = generateScotomaCanvas(512);
  const scTex = new THREE.CanvasTexture(scCanvas);
   
  scTex.wrapS = scTex.wrapT = THREE.ClampToEdgeWrapping;
  scTex.needsUpdate = true;

  const dispTex =new THREE.CanvasTexture(dispCanvas
    );

  dispTex.wrapS = dispTex.wrapT = THREE.RepeatWrapping;
  dispTex.needsUpdate = true;

  const blackTex =new THREE.CanvasTexture(blackCanvas);
    
  blackTex.wrapS = blackTex.wrapT = THREE.ClampToEdgeWrapping;
  blackTex.needsUpdate = true;

  const initialResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
      
  return {
    scTex,
    dispTex,
    blackTex,
    initialResolution
  };
}