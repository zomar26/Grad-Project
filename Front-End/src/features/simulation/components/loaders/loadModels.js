export function loadModels({
  scene,
  modelCache,
  gameMode,
  extinguisherRef,
  clockRef,
  exitSignRef,
  roomNumberRef
}) {

  // Hallway
  const hallway =
    modelCache.Hallway.scene.clone(true);

  hallway.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });

  scene.add(hallway);
  if (!gameMode) return;

  // Fire Extinguisher
  const extinguisher =
    modelCache.FireExtinguisher.scene.clone(true);

  extinguisher.position.set(
    0.5,
    0,
    4.5
  );

  extinguisher.scale.set(
    1,
    1,
    1
  );

  extinguisherRef.current =
    extinguisher;

  scene.add(extinguisher);

  // Clock
  const clock =
    modelCache.Clock.scene.clone(true);

  clock.position.set(
    -0.7,
    1.9,
    -2.5
  );

  clock.scale.set(
    1,
    1,
    1
  );

  clockRef.current = clock;

  scene.add(clock);

  // Exit Sign
  const sign =
    modelCache.ExitSign.scene.clone(true);

  sign.position.set(
    -4.7,
    2.3,
    0.2
  );

  sign.scale.set(
    1,
    1,
    1
  );

  sign.rotation.y =
    Math.PI / 2;

  exitSignRef.current = sign;

  scene.add(sign);

  // Room Number
  const roomNumber =
    modelCache.RoomNumber.scene.clone(true);

  roomNumber.position.set(
    -0.1,
    -3.5,
    -3.8
  );

  roomNumber.scale.set(
    1,
    1,
    1
  );

  roomNumber.traverse((child) => {
    if (child.isMesh) {
      roomNumberRef.current =
        child;
    }
  });

  scene.add(roomNumber);
}