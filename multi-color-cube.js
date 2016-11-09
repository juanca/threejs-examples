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
    x: rotation.x + (payload.x / 100 ),
    y: rotation.y + (payload.y / 100 ),
    z: rotation.z + (payload.z / 100 ),
  };
}

store = REDUX.createStore(function storeReducer(state, action) {
  switch(action.type) {
    case '@@redux/INIT':
      return {
        camera: {
          position: { x: 0, y: 150, z: 600, },
          rotation: { x: 0, y: 0, z: 0, },
        },
        cube: {
          position: { x: 0, y: 150, z: 0, },
          rotation: { x: 0, y: 0, z: 0, },
        },
        keys: {},
      };
    case 'TRANSLATE_CAMERA':
      return Object.assign({}, state, {
        camera: {
          position: translate(state.camera.position, action.payload),
          rotation: state.camera.rotation,
        }
      });
    case 'ROTATE_CAMERA':
      return Object.assign({}, state, {
        camera: {
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

function updateCamera() {
  var keys = store.getState().keys;
  var dx, dy, dz, dx0, dy0, dz0;

  if (keys.a && !keys.d) {
    dx = -1;
  } else if (!keys.a && keys.d) {
    dx = +1;
  } else {
    dx = 0;
  }

  if (keys.w && !keys.s) {
    dy = +1;
  } else if (!keys.w && keys.s) {
    dy = -1;
  } else {
    dy = 0;
  }

  if (keys.r && !keys.f) {
    dz = +1;
  } else if (!keys.r && keys.f) {
    dz = -1;
  } else {
    dz = 0;
  }

  if (dx || dy || dz) {
    store.dispatch({
      type: 'TRANSLATE_CAMERA',
      payload: {
        x: dx,
        y: dy,
        z: dz,
      },
    });
  }

  if (keys.j && !keys.l) {
    dx0 = -1;
  } else if (!keys.j && keys.l) {
    dx0 = +1;
  } else {
    dx0 = 0;
  }

  if (keys.i && !keys.k) {
    dy0 = +1;
  } else if (!keys.i && keys.k) {
    dy0 = -1;
  } else {
    dy0 = 0;
  }

  if (keys.y && !keys.h) {
    dz0 = +1;
  } else if (!keys.y && keys.h) {
    dz0 = -1;
  } else {
    dz0 = 0;
  }

  if (dx0 || dy0 || dz0) {
    store.dispatch({
      type: 'ROTATE_CAMERA',
      payload: {
        x: dx0,
        y: dy0,
        z: dz0,
      },
    });
  }
}

(function render() {
  updateCamera();
  requestAnimationFrame(render);

  var sceneState = store.getState();

  camera.position.x = sceneState.camera.position.x;
  camera.position.y = sceneState.camera.position.y;
  camera.position.z = sceneState.camera.position.z;
  camera.rotation.x = sceneState.camera.rotation.x;
  camera.rotation.y = sceneState.camera.rotation.y;
  camera.rotation.z = sceneState.camera.rotation.z;

  renderer.render(scene, camera);
}())


/*
 * Document event handlers
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
