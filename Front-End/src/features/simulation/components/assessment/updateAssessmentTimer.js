export function updateAssessmentTimer({
  gameModeRef,
  startTimeRef,
  completedRef,
  setElapsedTime
}) {

  if (gameModeRef.current && startTimeRef.current && !completedRef.current) {
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    if (setElapsedTime) {
      setElapsedTime(elapsed);
    }
  }
}