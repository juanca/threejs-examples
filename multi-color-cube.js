var THREE = require('three');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

var geometry = new THREE.BoxGeometry( 2, 1, 1 );
var material = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
scene.add( camera );

camera.position.z = 5;

(function render() {
	requestAnimationFrame( render );

  cube.translateX(0.001)
  cube.rotateX(0)
  cube.rotateY(0)

	renderer.render( scene, camera );
}())

document.addEventListener('DOMContentLoaded', function(event) {
  document.body.appendChild( renderer.domElement );
});