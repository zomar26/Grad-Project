export function movementController({
  controls,
  keysRef
}) {

  const speed = 0.05;

  if (keysRef.current.w) {
    controls.moveForward(speed);
  }

  if (keysRef.current.s) {
    controls.moveForward(-speed);
  }

  if (keysRef.current.a) {
    controls.moveRight(-speed);
  }

  if (keysRef.current.d) {
    controls.moveRight(speed);
  }
}