export function startAnimationLoop({
  rafRef,
  renderer,
  composer,
  camera,
  controls,
  keysRef,
  currentSeverityRef,
  targetSeverityRef,
  gameModeRef,
  startTimeRef,
  completedRef,
  taskRef,
  exitSignRef,
  extinguisherRef,
  clockRef,
  roomNumberRef,
  setTask,
  setElapsedTime,
  setShowQuestion,
  updateShaderSeverity,
  movementController,
  updateAssessmentTimer,
  assessmentLogic,
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

  function animate() {

    const cur = currentSeverityRef.current;
    const tgt = targetSeverityRef.current;
    
    currentSeverityRef.current += (tgt - cur) * 0.12;

    const v = currentSeverityRef.current;
     
    updateShaderSeverity({
      value: v,
      nuclearPassRef,
      myopiaPassRef,
      puckerPassRef,
      amdPassRef,
      traumaticPassRef,
      posteriorPassRef,
      rpPassRef,
      stargardtPassRef,
      choroideremiaPassRef,
      cscrPassRef,
      hypertensivePassRef,
      corticalPassRef
    });

    if (!renderer.xr.isPresenting) {
      movementController({
        controls,
        keysRef
      });
    }

    updateAssessmentTimer({
      gameModeRef,
      startTimeRef,
      completedRef,
      setElapsedTime
    });

    composer.render();

    if (gameModeRef.current) {
      assessmentLogic({
        camera,
        taskRef,
        exitSignRef,
        extinguisherRef,
        clockRef,
        roomNumberRef,
        completedRef,
        setTask,
        setShowQuestion
      });
    }
  }
  renderer.setAnimationLoop(animate);
}