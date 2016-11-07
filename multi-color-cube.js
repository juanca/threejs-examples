var THREE = require('three');
var REDUX = require('redux');


/*
 * Scene
 */

var scene = new THREE.Scene();

function translate(position, payload) {
  return {
    x: position.x + payload.x,
    y: position.y + payload.y,
    z: position.z + payload.z,
  };
}

function rotate(rotation, payload) {
  return {
    x: rotation.x + payload.x,
    y: rotation.y + payload.y,
    z: rotation.z + payload.z,
  };
}

store = REDUX.createStore(function storeReducer(state, action) {
  switch(action.type) {
    case '@@redux/INIT':
      return {
        camera: {
          position: { x: 0, y: 150, z: 500, },
          rotation: { x: 0, y: 0, z: 0, },
        },
        cube: {
          position: { x: 0, y: 150, z: 0, },
          rotation: { x: 0, y: 0, z: 0, },
        },
        keys: {},
      };
    case 'TRANSLATE_CUBE':
      return Object.assign({}, state, {
        cube: {
          position: translate(state.cube.position, action.payload),
          rotation: state.cube.rotation,
        }
      });
    case 'ROTATE_CUBE':
      return Object.assign({}, state, {
        cube: {
          position: state.cube.position,
          rotation: rotate(state.cube.rotation, action.payload),
        }
      });
    case 'TRANSLATE_CAMERA':
      return Object.assign({}, state, {
        cube: {
          position: translate(state.camera.position, action.payload),
          rotation: state.camera.rotation,
        }
      });
    case 'ROTATE_CAMERA':
      return Object.assign({}, state, {
        cube: {
          position: state.camera.position,
          rotation: rotate(state.camera.rotation, action.payload),
        }
      });
    case 'KEY_DOWN':
      return Object.assign({}, state, {
        keys: Object.assign({}, state.keys, { [action.payload]: true, }),
      });
    case 'KEY_UP':
      var keys = Object.assign({}, state.keys);
      delete keys[action.payload];
      return Object.assign({}, state, { keys: keys });
    default:
      return state;
  }
});

/*
 * Camera
 */

var displayRatio = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera(75, displayRatio, 1, 1000);
scene.add(camera);


/*
 * Cube
 */

var geometry = new THREE.BoxGeometry(200, 200, 200);

for (var i = 0; i < geometry.faces.length; i += 2) {
  var hex = Math.random() * 0xffffff;
  geometry.faces[i].color.setHex(hex);
}

var material = new THREE.MeshBasicMaterial({
  vertexColors: THREE.FaceColors,
  overdraw: 0.5,
});

cube = new THREE.Mesh(geometry, material);
scene.add(cube);


/*
 * Plane
 */

var geometry = new THREE.PlaneBufferGeometry(200, 200);
geometry.rotateX(-1 * (Math.PI / 2));

var material = new THREE.MeshBasicMaterial({
  color: 0xe0e0e0,
  overdraw: 0.5,
});

plane = new THREE.Mesh(geometry, material);
scene.add(plane);


/*
 * Renderer
 */

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);


/*
 * Animation loop
 */

function updateCube() {
  var keys = store.getState().keys;
  var dx, dy, dz;

  if (keys.a && !keys.d) {
    dx = -0.01;
  } else if (!keys.a && keys.d) {
    dx = +0.01;
  } else {
    dx = 0;
  }

  if (keys.w && !keys.s) {
    dy = +0.01;
  } else if (!keys.w && keys.s) {
    dy = -0.01;
  } else {
    dy = 0;
  }

  if (keys.r && !keys.f) {
    dz = +0.01;
  } else if (!keys.r && keys.f) {
    dz = -0.01;
  } else {
    dz = 0;
  }

  if (!dx && !dy && !dz) return;

  store.dispatch({
    type: 'ROTATE_CUBE',
    payload: {
      x: dx,
      y: dy,
      z: dz,
    },
  });
}

(function render() {
  updateCube();
  requestAnimationFrame(render);

  var sceneState = store.getState();

  camera.position.x = sceneState.camera.position.x;
  camera.position.y = sceneState.camera.position.y;
  camera.position.z = sceneState.camera.position.z;
  camera.rotation.x = sceneState.camera.rotation.x;
  camera.rotation.y = sceneState.camera.rotation.y;
  camera.rotation.z = sceneState.camera.rotation.z;

  cube.position.x = sceneState.cube.position.x;
  cube.position.y = sceneState.cube.position.y;
  cube.position.z = sceneState.cube.position.z;
  cube.rotation.x = sceneState.cube.rotation.x;
  cube.rotation.y = sceneState.cube.rotation.y;
  cube.rotation.z = sceneState.cube.rotation.z;

	renderer.render(scene, camera);
}())


/*
 * Document Event Handlers
 */

function onDocumentKeyDown(event) {
  var key = event.key;

  if (store.getState().keys[key]) return;

  function onDocumentKeyUp(event) {
    if (event.key !== key) return;

    store.dispatch({ type: 'KEY_UP', payload: key })
    document.removeEventListener('keyup', onDocumentKeyUp, false)
  }

  store.dispatch({ type: 'KEY_DOWN', payload: key })
  document.addEventListener('keyup', onDocumentKeyUp, false);
}


/*
 * Document hook
 */

document.addEventListener('DOMContentLoaded', function(event) {
  document.body.appendChild(renderer.domElement);

  document.addEventListener('keydown', onDocumentKeyDown, false);
});
