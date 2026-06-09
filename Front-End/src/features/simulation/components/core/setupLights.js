import * as THREE from "three";

export function setupLights(scene) {

  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      0.5
    );

  scene.add(ambient);

  const point =
    new THREE.PointLight(
      0xfff4e0,
      1,
      10
    );

  point.position.set(
    0,
    2.5,
    0
  );

  scene.add(point);

  return {
    ambient,
    point
  };
}