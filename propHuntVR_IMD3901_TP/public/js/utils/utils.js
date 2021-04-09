// Used for switching between different levels of console logging
export const LogLevel =
{
  None: 1,
  Some: 2,
  Verbose: 3
};

export function TestFunction () {
  console.log("TEST FUNCTION IS WORKING");
};

// allows for easily getting position as a THREE vector3
export function getPosition (element) {
  return element.object3D.getWorldPosition(new THREE.Vector3())
    .clone();
};

export function getRotation (element) {
// allows for easily getting a rotation as a THREE quat
  return element.object3D.getWorldQuaternion(new THREE.Quaternion())
    .clone();
};

export function getRotationEuler (element) {
  return element.object3D.rotation.clone();
};
