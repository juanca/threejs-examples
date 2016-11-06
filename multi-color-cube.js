var THREE = require('three');
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);

var geometry = new THREE.BoxGeometry(1, 1, 1);

for (var i = 0; i < geometry.faces.length; i += 1) {
  var hex = Math.random() * 0xffffff;
  geometry.faces[i].color.setHex(hex);
}

var material = new THREE.MeshBasicMaterial({
  vertexColors: THREE.FaceColors,
  overdraw: 0.5,
});

cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

(function render() {
	requestAnimationFrame(render);

  cube.translateX(0);
  cube.rotateX(0.01);
  cube.rotateY(0.02);

	renderer.render(scene, camera);
}())

document.addEventListener('DOMContentLoaded', function(event) {
  document.body.appendChild(renderer.domElement);
});
