import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

export function createScene(mountRef) {

  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 1.7, 4);

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.xr.enabled = true;

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.display = "block";

  if ("outputEncoding" in renderer) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  } else if (renderer.outputColorSpace !== undefined) {
    renderer.outputColorSpace =
      THREE.SRGBColorSpace;
  } else {
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
  }

  renderer.toneMapping =
    THREE.NoToneMapping;

  renderer.toneMappingExposure = 1.0;

  mountRef.current.appendChild(
    renderer.domElement
  );
  
  document.body.appendChild(
  VRButton.createButton(renderer)
  );

  const controls =
  new PointerLockControls(
    camera,
    renderer.domElement
  );
  
  renderer.domElement.addEventListener("click",() => {
    if (!renderer.xr.isPresenting) {
      controls.lock();
    }
  }
);

  return {
    scene,
    camera,
    renderer,
    controls
  };
}