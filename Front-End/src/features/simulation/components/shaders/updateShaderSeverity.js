export function updateShaderSeverity({
  value,
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

  const updatePass = (passRef) => {

    if (!passRef.current) return;

    if (passRef.current.uniforms?.severity) {
      passRef.current.uniforms.severity.value = value;
    }

    if (passRef.current.material?.uniforms?.severity) {
      passRef.current.material.uniforms.severity.value = value;
    }
  };

  updatePass(amdPassRef);
  updatePass(puckerPassRef);
  updatePass(nuclearPassRef);
  updatePass(traumaticPassRef);
  updatePass(posteriorPassRef);
  updatePass(rpPassRef);
  updatePass(stargardtPassRef);
  updatePass(hypertensivePassRef);
  updatePass(corticalPassRef);

  if (myopiaPassRef.current) {

    if (myopiaPassRef.current.uniforms?.severity) {
      myopiaPassRef.current.uniforms.severity.value = value;
    }

    if (myopiaPassRef.current.uniforms?.time) {
      myopiaPassRef.current.uniforms.time.value += 0.01;
    }
  }

  if (choroideremiaPassRef.current?.uniforms?.strength) {
    choroideremiaPassRef.current.uniforms.strength.value = value;
  }

  if (cscrPassRef.current?.uniforms?.severity) {
    cscrPassRef.current.uniforms.severity.value = value;
  }
}