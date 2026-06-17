export function initializeDiseasePasses({

  disease,
  enabled,

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

  corticalPass

}) {

  amdPass.enabled =
    disease === "AMD" &&
    enabled;

  puckerPass.enabled =
    disease === "Pucker" &&
    enabled;

  myopiaPass.enabled =
    disease === "Myopia" &&
    enabled;

  nuclearPass.enabled =
    disease === "Nuclear" &&
    enabled;

  traumaticPass.enabled =
    disease === "Traumatic" &&
    enabled;

  posteriorPass.enabled =
    disease === "Posterior" &&
    enabled;

  rpPass.enabled =
    disease === "RP" &&
    enabled;

  stargardtPass.enabled =
    disease === "Stargardt" &&
    enabled;

  choroideremiaPass.enabled =
    disease === "Choroideremia" &&
    enabled;

  cscrPass.enabled =
    disease === "CSCR" &&
    enabled;

  hypertensivePass.enabled =
    disease === "Hypertensive" &&
    enabled;

  corticalPass.enabled =
    disease === "Cortical" &&
    enabled;

}