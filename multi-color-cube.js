var THREE = require('three');


/*
 * Scene
 */

var scene = new THREE.Scene();


/*
 * Camera
 */

var displayRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, displayRatio, 1, 1000);
camera.position.y = 150;
camera.position.z = 500;
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
cube.position.y = 150;
scene.add(cube);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);


/*
 * Animation loop
 */

(function render() {
	requestAnimationFrame(render);

  cube.translateX(0);
  cube.rotateX(0.01);
  cube.rotateY(0.02);

	renderer.render(scene, camera);
}())


/*
 * Document hook
 */

document.addEventListener('DOMContentLoaded', function(event) {
  document.body.appendChild(renderer.domElement);
});
