import * as THREE from 'three';
import getStarfield from './starfield.js';
import Stats from 'three/addons/libs/stats.module.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';


// Template
const scene = new THREE.Scene()

const canvas = new THREE.WebGLRenderer({ antialias: true })
// canvas.setAnimationLoop(animate)
canvas.setSize(window.innerWidth, window.innerHeight)
canvas.setPixelRatio(window.devicePixelRatio)
canvas.toneMapping = THREE.ACESFilmicToneMapping
canvas.toneMappingExposure = 0.5
scene.background = new THREE.Color("gray")
document.body.appendChild(canvas.domElement)

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.set(-100, 10, 100)


const controls = new OrbitControls(camera, canvas.domElement) 

controls.update();




// Water 
const waterGeometry = new THREE.PlaneGeometry(5000, 5000)

const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  waterNormals: new THREE.TextureLoader().load("./images/waterdudv.jpg", function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }), 
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 1.8,
  fog: scene.fog !== undefined
})


water.rotation.x = - Math.PI / 2;
water.material.uniforms[ 'size' ].value += 15;
scene.add(water)





// Shapes
const donut = new THREE.Mesh(
  new THREE.TorusGeometry(50, 2),
  new THREE.MeshBasicMaterial({
    color: 0xffffff
  })
)
donut.position.y = 70
scene.add(donut)





// Lights





// Stars
const stars = getStarfield({numStars: 2000});
scene.add(stars);






//Bloom
const BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();

const params = {
  threshold:0 ,
  strength: 0,
  radius: 0.5,
  exposure: 1
}

const renderScene = new RenderPass(scene, camera)

const bloomPass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.4, 0.85)

const bloomComposer = new EffectComposer(canvas)
bloomComposer.addPass(renderScene)
bloomComposer.addPass(bloomPass)





// Sizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  canvas.setSize(window.innerWidth, window.innerHeight)
})



function animate (t = 0) {
  requestAnimationFrame(animate)
  const time = performance.now() * 0.001;


  water.material.uniforms[ 'time' ].value += 1.0 / 120.0;

  // canvas.render(scene, camera)
  bloomComposer.render()
}

animate()