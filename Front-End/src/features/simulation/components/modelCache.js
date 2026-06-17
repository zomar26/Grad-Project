import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
export const modelCache = {};
let preloadPromise = null;
export let modelsReady = false;

export function preloadModels() {
  if (preloadPromise) return preloadPromise;

  const models = [
    "Hallway",
    "FireExtinguisher",
    "Clock",
    "ExitSign",
    "RoomNumber"
  ];

  preloadPromise = Promise.all(
    models.map(
      (name) =>
        new Promise((resolve, reject) => {
          loader.load(
            `/models/${name}.glb`,
            (gltf) => {
              modelCache[name] = gltf;
              resolve();
            },
            undefined,
            reject
          );
        })
    )
  ).then(() => {
    modelsReady = true;
  });

  return preloadPromise;
}