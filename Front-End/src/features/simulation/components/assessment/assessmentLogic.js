import * as THREE from "three";

export function assessmentLogic({
  camera,
  taskRef,
  exitSignRef,
  extinguisherRef,
  clockRef,
  roomNumberRef,
  completedRef,
  setTask,
  setShowQuestion
}) {

  if (taskRef.current === 0 && exitSignRef.current) {
    const distance = camera.position.distanceTo( exitSignRef.current.position);

    if (distance < 2) {
      taskRef.current = 1;

      if (setTask) {
        setTask("Find the Fire Extinguisher");
      }
    }
  }

  else if (taskRef.current === 1 && extinguisherRef.current) {
    const distance = camera.position.distanceTo( extinguisherRef.current.position);

    if (distance < 2) {
      taskRef.current = 2;

      if (setTask) {
        setTask("Check the Wall Clock");
      }
    }
  }

  else if (taskRef.current === 2 && clockRef.current) {
  
    const distance = camera.position.distanceTo(clockRef.current.position);
     
    if (distance < 2) {
      taskRef.current = 3;

      if (setTask) {
        setTask("Read the Room Number");
      }
    }
  }

  else if (taskRef.current === 3 && roomNumberRef.current) {
    const roomWorldPos = new THREE.Vector3();
    roomNumberRef.current.getWorldPosition(roomWorldPos);
    const distance = camera.position.distanceTo(roomWorldPos);
        
    if (distance < 2) {
      taskRef.current = 4;
      completedRef.current = true;

      if (setTask) {
        setTask("You have completed the assessment. Now please answer the Room Number Question");  
      }

      if (setShowQuestion) {
        setShowQuestion(true);
      }
    }
  }
}