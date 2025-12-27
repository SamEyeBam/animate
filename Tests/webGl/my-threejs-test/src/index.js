import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

// Now you can use `vertexShader` and `fragmentShader` as strings in your Three.js material
// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0); // Transparent background color
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// scene.add(renderer.domElement);


// Phyllotaxis setup
const pointsGeometry = new THREE.BufferGeometry();
const n_points = 5000;
const positions = new Float32Array(n_points * 3);
const goldenAngle = Math.PI * (3 - Math.sqrt(5));
// const goldenAngle = 0;

for (let i = 0; i < n_points; i++) {
    const angle = i * goldenAngle;
    const r = Math.sqrt(i) * 5;
    positions[i * 3] = r * Math.cos(angle);     // x
    positions[i * 3 + 1] = r * Math.sin(angle); // y
    positions[i * 3 + 2] = 0;                   // z
}

pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// ShaderMaterial
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 },
        color1: { value: new THREE.Color(0x2D81FC) }, // Blue
        color2: { value: new THREE.Color(0xFC0362) }, // Pink
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
});

const points = new THREE.Points(pointsGeometry, shaderMaterial);
// Assign the points mesh to the bloom layer
scene.add(points);
points.layers.enable(1);

camera.position.z = 200;

// Compile the shader and catch any errors
renderer.compile(scene, camera);

// Create layers
const bloomLayer = new THREE.Layers();
bloomLayer.set(1); // Setting the bloom layer to layer 1

// Set up the bloom pass
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.4, 0.85);
bloomPass.threshold = 0.1
bloomPass.strength = 2.5
bloomPass.radius = 0.55
bloomPass.renderToScreen = true
// Create a render scene pass
const renderScene = new RenderPass(scene, camera);

// Set up the effect composer
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(bloomPass);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = Math.pow( 0.9, 4.0 ) 
renderer.toneMappingExposure = 1.0 


renderer.autoClear = false;
points.layers.set(1);
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    shaderMaterial.uniforms.time.value = performance.now() / 5000;
    
    renderer.clear();

    camera.layers.set(1);
    composer.render();

    renderer.clearDepth();
    camera.layers.set(0);
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}