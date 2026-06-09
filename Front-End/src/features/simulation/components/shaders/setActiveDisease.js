export function setActiveDisease({
  disease,
  enabled,
  amdPassRef,
  puckerPassRef,
  myopiaPassRef,
  nuclearPassRef,
  traumaticPassRef,
  posteriorPassRef,
  rpPassRef,
  stargardtPassRef,
  choroideremiaPassRef,
  cscrPassRef,
  hypertensivePassRef,
  corticalPassRef
}) {

  const allPasses = [
    amdPassRef,
    puckerPassRef,
    myopiaPassRef,
    nuclearPassRef,
    traumaticPassRef,
    posteriorPassRef,
    rpPassRef,
    stargardtPassRef,
    choroideremiaPassRef,
    cscrPassRef,
    hypertensivePassRef,
    corticalPassRef
  ];

  allPasses.forEach((passRef) => {
    if (passRef?.current) {
      passRef.current.enabled = false;
    }
  });

  if (!enabled) {
    return;
  }

  switch (disease) {

    case "AMD":
      if (amdPassRef.current) {
        amdPassRef.current.enabled = true;
      }
      break;

    case "Pucker":
      if (puckerPassRef.current) {
        puckerPassRef.current.enabled = true;
      }
      break;

    case "Myopia":
      if (myopiaPassRef.current) {
        myopiaPassRef.current.enabled = true;
      }
      break;

    case "Nuclear":
      if (nuclearPassRef.current) {
        nuclearPassRef.current.enabled = true;
      }
      break;

    case "Traumatic":
      if (traumaticPassRef.current) {
        traumaticPassRef.current.enabled = true;
      }
      break;

    case "Posterior":
      if (posteriorPassRef.current) {
        posteriorPassRef.current.enabled = true;
      }
      break;

    case "RP":
      if (rpPassRef.current) {
        rpPassRef.current.enabled = true;
      }
      break;

    case "Stargardt":
      if (stargardtPassRef.current) {
        stargardtPassRef.current.enabled = true;
      }
      break;

    case "Choroideremia":
      if (choroideremiaPassRef.current) {
        choroideremiaPassRef.current.enabled = true;
      }
      break;

    case "CSCR":
      if (cscrPassRef.current) {
        cscrPassRef.current.enabled = true;
      }
      break;

    case "Hypertensive":
      if (hypertensivePassRef.current) {
        hypertensivePassRef.current.enabled = true;
      }
      break;

    case "Cortical":
      if (corticalPassRef.current) {
        corticalPassRef.current.enabled = true;
      }
      break;

    default:
      break;
  }
}