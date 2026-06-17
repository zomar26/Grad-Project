export function applySeverity({
  severity,
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

  const passes = [
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

  passes.forEach((passRef) => {

    const pass = passRef.current;

    if (!pass) return;

    if (pass.uniforms?.severity) {
      pass.uniforms.severity.value = severity;
    }

    if (pass.uniforms?.strength) {
      pass.uniforms.strength.value = severity;
    }

    if (pass.material?.uniforms?.severity) {
      pass.material.uniforms.severity.value = severity;
    }

    if (pass.material?.uniforms?.strength) {
      pass.material.uniforms.strength.value = severity;
    }
  });
}