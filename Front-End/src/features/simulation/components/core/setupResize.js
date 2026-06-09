export function setupResize({
  renderer,
  composer,
  camera,

  amdPassRef,
  puckerPassRef,
  rpPassRef,
  stargardtPassRef,
  corticalPassRef,
  posteriorPassRef
}) {

  function onResize() {

    const w = window.innerWidth;
    const h = window.innerHeight;

    renderer.setSize(w, h);

    composer.setSize(w, h);

    camera.aspect = w / h;

    camera.updateProjectionMatrix();

    const updateResolution = (passRef) => {

      if (
        passRef.current?.uniforms?.resolution
      ) {
        passRef.current.uniforms.resolution.value.set(
          w,
          h
        );
      }

      if (
        passRef.current?.material?.uniforms?.resolution
      ) {
        passRef.current.material.uniforms.resolution.value.set(
          w,
          h
        );
      }
    };

    updateResolution(amdPassRef);
    updateResolution(puckerPassRef);
    updateResolution(rpPassRef);
    updateResolution(stargardtPassRef);
    updateResolution(corticalPassRef);
    updateResolution(posteriorPassRef);
  }

  window.addEventListener(
    "resize",
    onResize
  );

  return () => {
    window.removeEventListener(
      "resize",
      onResize
    );
  };
}