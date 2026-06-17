export function setupKeyboard(keysRef) {
  function onKeyDown(event) {
    const key = event.key.toLowerCase();

    if (keysRef.current[key] !== undefined) {
      keysRef.current[key] = true;
    }
  }

  function onKeyUp(event) {
    const key = event.key.toLowerCase();

    if (keysRef.current[key] !== undefined) {
      keysRef.current[key] = false;
    }
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}