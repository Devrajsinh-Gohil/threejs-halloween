import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837',2,9);
scene.fog=fog;

const main = new THREE.Group()
scene.add(main)

//models
const loader = new GLTFLoader();
loader.load('./model/house.gltf', function(gltf) {
    const model = gltf.scene;
    model.scale.set(1,1,1);
    model.traverse(function(node){
        if(node.isMesh)
            node.castShadow=true;
            node.receiveShadow=true;
    })
    main.add(model);
})

let ghost

loader.load('./model/Ghost.gltf', function(gltf) {
    ghost = gltf.scene;
    ghost.scale.set(0.3,0.3,0.3);
    ghost.position.y=0.5;
    ghost.traverse(function(node){
        if(node.isMesh)
            node.castShadow=true;
            node.receiveShadow=true;
    })
    main.add(ghost);
})

loader.load('./model/gravestone.glb', function(gltf) {
    const stone = gltf.scene;
    stone.scale.set(1,1,1);
    stone.traverse(function(node){
        if(node.isMesh)
            node.castShadow=true;
            node.receiveShadow=true;
    })
    stone.position.set(4,0,2);
    main.add(stone);
})

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

//grass textures
const grassColorTexture = textureLoader.load('/textures/ground/color.jpg');
const grassNormalTexture = textureLoader.load('/textures/ground/normal.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/ground/ambientOcclusion.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/ground/rough2.jpg');

grassColorTexture.repeat.set(10,10);
grassNormalTexture.repeat.set(10,10);
grassAmbientOcclusionTexture.repeat.set(10,10);
grassRoughnessTexture.repeat.set(10,10);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;


/**
 * Graves
 */

const graves = new THREE.Group();
main.add(graves);

for(let i=0; i < 50; i++){
loader.load('./model/gravestone.glb', function(gltf) {
    const grave = gltf.scene;
        const angle = Math.random()*Math.PI*2;
        const radius = 4 +Math.random()*6;
        const x = Math.sin(angle)*radius;
        const z = Math.cos(angle)*radius;
        grave.position.set(x,-0.01,z);
        grave.rotation.y=(Math.random()-0.5)*0.5;
        grave.rotation.z=(Math.random()-0.5)*0.3;
        grave.castShadow=true
        graves.add(grave);
    })
}




// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow=true
main.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.05)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambientLightIntensity')
main.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.05)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name('moonLightIntensity')
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001).name('moonLightX')
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001).name('moonLightY')
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001).name('moonLightZ')
main.add(moonLight)

//Door light
const doorlight = new THREE.PointLight('#ff0000',5,4);
doorlight.position.y= 2;
main.add(doorlight);

//ghosts
const ghost1 = new THREE.PointLight('#ff00ff',1,5);
main.add(ghost1);

const ghost2 = new THREE.PointLight('#00ffff',1,5);
main.add(ghost2);

const ghost3 = new THREE.PointLight('#ffff00',1,5);
main.add(ghost3);

const ghost4 = new THREE.PointLight('#f0000f',1,5);
main.add(ghost4);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
moonLight.castShadow=true
doorlight.castShadow=true
ghost1.castShadow=true
ghost2.castShadow=true
ghost3.castShadow=true
ghost4.castShadow=true

ghost1.shadow.mapSize.width=256
ghost1.shadow.mapSize.height=256
ghost1.shadow.camera.far=7

ghost2.shadow.mapSize.width=256
ghost2.shadow.mapSize.height=256
ghost2.shadow.camera.far=7

ghost3.shadow.mapSize.width=256
ghost3.shadow.mapSize.height=256
ghost3.shadow.camera.far=7

ghost4.shadow.mapSize.width=256
ghost4.shadow.mapSize.height=256
ghost4.shadow.camera.far=7

doorlight.shadow.mapSize.width=256
doorlight.shadow.mapSize.height=256
doorlight.shadow.camera.far=7

renderer.shadowMap.type=THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update ghosts
    const ghost1Angle = elapsedTime*0.5;
    ghost1.position.x = Math.cos(ghost1Angle)*4;
    ghost1.position.z = Math.sin(ghost1Angle)*4;
    ghost1.position.y = Math.sin(ghost1Angle*3);
    const ghost2Angle = -elapsedTime*0.31;
    ghost2.position.x = Math.cos(ghost2Angle)*5;
    ghost2.position.z = Math.sin(ghost2Angle)*6;
    ghost2.position.y = Math.sin(elapsedTime*3)+Math.cos(elapsedTime*3);
    const ghost3Angle = -elapsedTime*0.2;
    ghost3.position.x = Math.cos(ghost3Angle)*(6+Math.sin(elapsedTime)*0.32);
    ghost3.position.z = Math.sin(ghost3Angle)*8;
    ghost3.position.y = Math.cos(elapsedTime*3)+Math.sin(elapsedTime);
    const ghos4Angle = elapsedTime*0.15;
    ghost4.position.x = Math.sin(ghos4Angle)*(7+Math.sin(elapsedTime)*0.32);
    ghost4.position.z = Math.cos(ghos4Angle)*(7+Math.sin(elapsedTime)*0.5);
    ghost4.position.y = Math.sin(elapsedTime *6)+1;


    main.rotation.y+=0.003


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()