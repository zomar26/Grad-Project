import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import AMDShader from "./amdShader.js";
import MacularPuckerShader from "./macularPuckerShader.js";
import ChoroideremiaShader from "./choroideremiaShader.js";
import CSCRShader from "./cscrShader.js";
import HypertensiveShader from "./hypertensiveShader.js";
import RPShader from "./rpShader.js";
import StargardtShader from "./stargardtShader.js";
import PathologicMyopiaShader from "./pathologicMyopiaShader.js";
import NuclearShader from "./nuclear.js";
import traumaticCataractShader from "./traumaticCataractShader.js";
import PosteriorSubcapsularShader from "./posteriorSubcapsularShader.js";
import CorticalCataractShader from "./corticalCataractShader.js";

export function createShaderPasses({
  renderer,
  scene,
  camera,
  GammaCorrectionShader
}) {
// Composer + passes
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    try {
      if (composer.renderTarget1 && composer.renderTarget1.texture) {
        composer.renderTarget1.texture.encoding = THREE.LinearEncoding;
      }
      if (composer.renderTarget2 && composer.renderTarget2.texture) {
        composer.renderTarget2.texture.encoding = THREE.LinearEncoding;
      }
    } catch (e) {
    }

    // AMD pass
    const amdPass = new ShaderPass(AMDShader);
    composer.addPass(amdPass);

    // Pucker pass
    const puckerPass = new ShaderPass(MacularPuckerShader);
    composer.addPass(puckerPass);

    // Myopia pass 
    const myopiaPass = new ShaderPass(PathologicMyopiaShader);
    composer.addPass(myopiaPass);

    // Nuclear pass
    const nuclearPass = new ShaderPass(NuclearShader);
    composer.addPass(nuclearPass);

    // Traumatic Cataract pass
    const traumaticPass = new ShaderPass(traumaticCataractShader);
    composer.addPass(traumaticPass);

    // Posterior Subcapsular Cataract pass
    const posteriorPass = new ShaderPass(PosteriorSubcapsularShader);
    posteriorPass.enabled = false; 
    composer.addPass(posteriorPass);

    // Choroideremia pass
    const choroideremiaPass = new ShaderPass(ChoroideremiaShader);
    composer.addPass(choroideremiaPass);

    // CSCR pass
    const cscrPass = new ShaderPass(CSCRShader);
    composer.addPass(cscrPass);

    // Hypertensive Retinopathy Pass
    const hypertensivePass = new ShaderPass(HypertensiveShader);
    hypertensivePass.enabled = false; 
    composer.addPass(hypertensivePass);

    // RP pass
    const rpPass = new ShaderPass(RPShader);
    composer.addPass(rpPass);

    // Stargardt pass
    const stargardtPass = new ShaderPass(StargardtShader);
    composer.addPass(stargardtPass);

    // Cortical Cataract pass
    const corticalPass = new ShaderPass(CorticalCataractShader);
    composer.addPass(corticalPass);

    const gammaPass = new ShaderPass(GammaCorrectionShader);
    gammaPass.renderToScreen = true;
    composer.addPass(gammaPass);

    return { 
      composer, 
      amdPass,
      puckerPass,
      myopiaPass,
      nuclearPass,
      traumaticPass,
      posteriorPass,
      rpPass,
      stargardtPass,
      choroideremiaPass,
      cscrPass,
      hypertensivePass,
      corticalPass,
      gammaPass
    };
}