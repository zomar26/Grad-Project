export function initializeShaderUniforms({
  severity,
  foveaRef,
  initialResolution,
  scTex,
  dispTex,
  blackTex,
  puckerPass,
  myopiaPass,
  nuclearPass,
  traumaticPass,
  posteriorPass,
  choroideremiaPass,
  corticalPass
}) {

  // Pucker uniforms
  if (puckerPass.uniforms) {
    puckerPass.uniforms.tDiffuse.value = null;

    if (puckerPass.uniforms.scotomaTex !== undefined) {
      puckerPass.uniforms.scotomaTex.value = scTex;
    } else {
      puckerPass.uniforms.scotomaTex = {value: scTex};
    }

    puckerPass.uniforms.dispTex.value = dispTex;
    puckerPass.uniforms.fovea.value = foveaRef.current.clone();
    puckerPass.uniforms.radius.value = 0.12;
    puckerPass.uniforms.feather.value = 0.08;
    puckerPass.uniforms.severity.value = severity;
    puckerPass.uniforms.wrinkleFreq.value = 3.0;
    puckerPass.uniforms.wrinkleAmp.value = 0.025;
    puckerPass.uniforms.blurAmount.value = 0.22;
    puckerPass.uniforms.desaturation.value = 0.10;
    puckerPass.uniforms.traction.value = 0.0;
    puckerPass.uniforms.tractionFreq.value = 8.0;
    puckerPass.uniforms.tractionSharp.value = 80.0;
    puckerPass.uniforms.resolution.value = initialResolution.clone();
  }

  if (puckerPass.material && puckerPass.material.uniforms) {
    if (puckerPass.material.uniforms.scotomaTex !== undefined) {
      puckerPass.material.uniforms.scotomaTex.value = scTex;
    } else {
      puckerPass.material.uniforms.scotomaTex = {value: scTex};
    }
    puckerPass.material.uniforms.dispTex.value = dispTex;
    puckerPass.material.uniforms.severity.value = severity;
    puckerPass.material.uniforms.resolution.value = initialResolution.clone();
  }

  // Choroideremia
  if (choroideremiaPass.uniforms) {
    choroideremiaPass.uniforms.tDiffuse.value = null;
    choroideremiaPass.uniforms.strength.value = severity;
  }

  // Myopia
  if (myopiaPass.uniforms) {
    myopiaPass.uniforms.tDiffuse.value = null;
    myopiaPass.uniforms.severity.value = severity;
    myopiaPass.uniforms.resolution.value = initialResolution.clone();
    myopiaPass.uniforms.time.value = 0.0;
    myopiaPass.uniforms.scotomaTex.value = scTex;
    myopiaPass.uniforms.blackSpotsTex.value = blackTex;
    myopiaPass.uniforms.desaturation.value = 0.45;
    myopiaPass.uniforms.contrast.value = 0.75;
    myopiaPass.uniforms.flashAmount.value = 0.0;
  }

  if (myopiaPass.material && myopiaPass.material.uniforms) {
    myopiaPass.material.uniforms.severity.value = severity;
    myopiaPass.material.uniforms.resolution.value = initialResolution.clone();
    myopiaPass.material.uniforms.time.value = 0.0;
    myopiaPass.material.uniforms.scotomaTex.value = scTex;
    myopiaPass.material.uniforms.blackSpotsTex.value = blackTex;
    myopiaPass.material.uniforms.desaturation.value = 0.45;
    myopiaPass.material.uniforms.contrast.value = 0.75;
    myopiaPass.material.uniforms.flashAmount.value = 0.0;
  }

  // Nuclear
  if (nuclearPass.uniforms) {
    nuclearPass.uniforms.tDiffuse.value = null;
    nuclearPass.uniforms.severity.value = severity;
  }

  if (nuclearPass.material && nuclearPass.material.uniforms) {
    nuclearPass.material.uniforms.severity.value = severity;
  }

  // Traumatic
  if (traumaticPass.uniforms) {
    traumaticPass.uniforms.tDiffuse.value = null;
    traumaticPass.uniforms.severity.value = severity;
  }

  if (traumaticPass.material && traumaticPass.material.uniforms) {
    traumaticPass.material.uniforms.severity.value = severity;  
  }

  // Posterior
  if (posteriorPass.uniforms) {
    posteriorPass.uniforms.tDiffuse.value = null;
    posteriorPass.uniforms.severity.value = severity;
    posteriorPass.uniforms.resolution.value = initialResolution.clone();
  }

  if (posteriorPass.material && posteriorPass.material.uniforms) {
    posteriorPass.material.uniforms.severity.value = severity;
    posteriorPass.material.uniforms.resolution.value = initialResolution.clone();
  }

  // Cortical
  if (corticalPass && corticalPass.uniforms) {
    corticalPass.uniforms.severity.value = severity;
    corticalPass.uniforms.resolution.value = initialResolution.clone();
  }

  if (corticalPass && corticalPass.material && corticalPass.material.uniforms) {
    corticalPass.material.uniforms.severity.value = severity;
    corticalPass.material.uniforms.resolution.value = initialResolution.clone();  
  }
}