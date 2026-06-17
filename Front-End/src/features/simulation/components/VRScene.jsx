import { useEffect, useRef } from "react";
import React, { useState } from "react";
import * as THREE from "three";
import { modelCache, preloadModels, modelsReady } from "./modelCache";
import { loadModels } from "./loaders/loadModels";
import { createScene } from "./core/createScene.js";
import { setupLights } from "./core/setupLights.js";
import { setupKeyboard } from "./core/setupKeyboard";
import { movementController } from "./controls/movementController";
import { setupResize } from "./core/setupResize.js";
import { startAnimationLoop } from "./core/startAnimationLoop";
import { setActiveDisease } from "./shaders/setActiveDisease.js";
import { createShaderPasses } from "./shaders/createShaderPasses.js";
import { assessmentLogic } from "./assessment/assessmentLogic.js";
import { initializeAssessment } from "./assessment/initializeAssessment";
import { updateAssessmentTimer } from "./assessment/updateAssessmentTimer";
import { createTextures } from "./shaders/createTextures";
import { updateShaderSeverity } from "./shaders/updateShaderSeverity";
import { initializeShaderUniforms } from "./shaders/initializeShaderUniforms";
import { setupPuckerDebug } from "./shaders/setupPuckerDebug";
import { applySeverity } from "./shaders/applySeverity";
import { assignPassRefs } from "./shaders/assignPassRefs";
import { initializeDiseasePasses } from "./shaders/initializeDiseasePasses";

const GammaCorrectionShader = {
  uniforms: {
    tDiffuse: { value: null },
    gamma: { value: 1.0 / 2.2 }
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
    uniform float gamma;
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      // convert linear -> sRGB by applying gamma curve
      c = pow(c, vec3(gamma));
      gl_FragColor = vec4(c, 1.0);
    }
  `
};

export default function VRScene({
  severity = 0.5,
  enabled = true,
  disease = "AMD",
  gameMode = false,
  setTask,
  setElapsedTime,
  setShowQuestion
}) {
  
  const [loading, setLoading] = useState(true);

  const mountRef = useRef(null);

  // persistent refs
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const keysRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false
  });
  
  const amdPassRef = useRef(null);
  const puckerPassRef = useRef(null);
  const myopiaPassRef = useRef(null);
  const nuclearPassRef = useRef(null);
  const traumaticPassRef = useRef(null);
  const posteriorPassRef = useRef(null);
  const rpPassRef = useRef(null); 
  const stargardtPassRef = useRef(null);
  const choroideremiaPassRef = useRef(null);
  const cscrPassRef = useRef(null);
  const hypertensivePassRef = useRef(null);
  const corticalPassRef = useRef(null);
  const gammaPassRef = useRef(null);
  const rafRef = useRef(null);
  const taskRef = useRef(0);
  const startTimeRef = useRef(null);
  const completedRef = useRef(false);
  const extinguisherRef = useRef(null);
  const exitSignRef = useRef(null);
  const roomNumberRef = useRef(null);
  const clockRef = useRef(null);
  const currentSeverityRef = useRef(severity);
  const targetSeverityRef = useRef(severity);
  const gameModeRef = useRef(false);
  const foveaRef = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const init = () => {
    const { scene, camera, renderer, controls } = createScene(mountRef);
    setupLights(scene);
    rendererRef.current = renderer;

    const cleanupKeyboard = setupKeyboard(keysRef);
    
    loadModels({scene, modelCache, extinguisherRef, clockRef, exitSignRef, roomNumberRef});

    setLoading(false);
    
    const {composer, amdPass, puckerPass, myopiaPass, nuclearPass, 
      traumaticPass, posteriorPass, rpPass, stargardtPass, choroideremiaPass, 
      cscrPass, hypertensivePass, corticalPass, gammaPass} = createShaderPasses({renderer, scene, camera, GammaCorrectionShader});
      
      composerRef.current = composer;

      assignPassRefs({amdPassRef, puckerPassRef, myopiaPassRef, nuclearPassRef, traumaticPassRef, posteriorPassRef,
        rpPassRef, stargardtPassRef, choroideremiaPassRef, cscrPassRef, hypertensivePassRef, corticalPassRef,
        gammaPassRef, amdPass, puckerPass, myopiaPass, nuclearPass, traumaticPass, posteriorPass, rpPass,
        stargardtPass, choroideremiaPass, cscrPass, hypertensivePass, corticalPass, gammaPass});

      const {scTex, dispTex, blackTex, initialResolution} = createTextures();

      initializeShaderUniforms({severity, foveaRef, initialResolution, scTex, 
        dispTex, blackTex, puckerPass, myopiaPass, nuclearPass, traumaticPass, 
        posteriorPass, choroideremiaPass, corticalPass});

      initializeDiseasePasses({disease, enabled, amdPass, puckerPass, myopiaPass, 
        nuclearPass,traumaticPass, posteriorPass, rpPass, stargardtPass, choroideremiaPass, 
        cscrPass, hypertensivePass,corticalPass});

    setupPuckerDebug(puckerPass);

    startAnimationLoop({rafRef, renderer, composer, camera, controls, keysRef, currentSeverityRef, targetSeverityRef, 
      gameModeRef, startTimeRef, completedRef, taskRef, exitSignRef, extinguisherRef, clockRef, roomNumberRef, 
      setTask, setElapsedTime, setShowQuestion, updateShaderSeverity, movementController, updateAssessmentTimer, 
      assessmentLogic, amdPassRef, puckerPassRef, myopiaPassRef, nuclearPassRef, traumaticPassRef, posteriorPassRef, 
      rpPassRef, stargardtPassRef, choroideremiaPassRef, cscrPassRef, hypertensivePassRef, corticalPassRef});

    const cleanupResize = setupResize({
      renderer, composer, camera, amdPassRef, puckerPassRef, rpPassRef,  corticalPassRef, stargardtPassRef, posteriorPassRef});
     
    return () => {
      // cleanup
      cleanupKeyboard();
      renderer.setAnimationLoop(null);
      cleanupResize();
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);

      // dispose textures
      scTex.dispose();
      dispTex.dispose();

      try { composer.dispose(); } catch (e) {}
      try { renderer.dispose(); } catch (e) {}

      try { delete window.puckerTweak; } catch (e) {}
    };
    };
    preloadModels().then(() => {
  init();
});
  }, []);

  useEffect(() => {
    targetSeverityRef.current = severity;
    setActiveDisease({disease, enabled, amdPassRef, puckerPassRef, myopiaPassRef,
      nuclearPassRef, traumaticPassRef, posteriorPassRef, rpPassRef, stargardtPassRef,
      choroideremiaPassRef, cscrPassRef, hypertensivePassRef, corticalPassRef});

  applySeverity({severity, amdPassRef, puckerPassRef, myopiaPassRef, nuclearPassRef,
    traumaticPassRef, posteriorPassRef, rpPassRef, stargardtPassRef, choroideremiaPassRef,
    cscrPassRef, hypertensivePassRef, corticalPassRef});

  }, [severity, enabled, disease]);

  useEffect(() => {

  initializeAssessment({gameMode, gameModeRef, taskRef, completedRef,
    startTimeRef, setTask, setShowQuestion});

}, [gameMode]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}