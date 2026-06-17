export function initializeAssessment({
  gameMode,
  gameModeRef,
  taskRef,
  completedRef,
  startTimeRef,
  setTask,
  setShowQuestion
}) {

  gameModeRef.current = gameMode;

  if (!gameMode) return;
  taskRef.current = 0;
  completedRef.current = false;
  startTimeRef.current = performance.now();

  if (setShowQuestion) {
    setShowQuestion(false);
  }

  if (setTask) {
    setTask("Locate the Exit Sign");
  }
}