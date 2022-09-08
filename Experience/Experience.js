import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fragment from "../Experience/shaders/fragment.glsl";
import vertex from '../Experience/shaders/vertex.glsl'
import testTexture from '/textures/5.png';
import gsap from 'gsap'
import dat from 'dat-gui'


export default class Experience {
  constructor(options) {
    this.scene = new THREE.Scene();

    // Sizes
    this.container = options.domElement;
    this.width = this.container.offsetWidth;
    this.heigth = this.container.offsetHeight;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.container.appendChild(this.renderer.domElement);

    // Cameras
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
    this.camera.position.z = 2;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    

    this.time = 0;
    this.resize();
    this.addObjects();
    this.addLights()
    this.settings()
    this.render();
    this.setupResize();

    // Add Model

   /*  this.loader = new GLTFLoader()
        this.loader.load(
            '/models/organicSpot.glb', 
            (gltf) => {
                this.scene.add(gltf.scene);
                gltf.scene.traverse(o => {
                    if(o.isMesh){
                        o.rotation.z = 2
                        o.position.z = -0.5
                        o.position.y = -0.8
                        //o.geometry.center()
                        
                        // always check the scale of the 3D model
                        o.scale.set(.04,.04,.04)
                        //o.material = this.material
                    }
                })
        })  */

      
  }

  settings(){
    this.settings = {
      progress: 0
    }
    this.gui = new dat.GUI()
    this.gui.add(this.settings, 'progress',0,1,0.002)
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  addObjects() {
   
    
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        time: { value: 1.0 },
        uProgress: {value: 0},
        uTexture: { value: new THREE.TextureLoader().load(testTexture) },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

   
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  addLights(){
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        this.scene.add(directionalLight)
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.mesh.rotation.x = this.time / 2000;
    this.mesh.rotation.y = this.time / 1000;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}
