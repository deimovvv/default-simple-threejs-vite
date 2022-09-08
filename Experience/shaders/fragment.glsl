uniform float time;
uniform sampler2D uTexture;
uniform float uProgress;


varying vec2 vUv;
varying vec3 vNormal;

void main() {
    // gl_FragColor = vec4(0.,0.,1., 1.);

    vec4 myimage = texture(
        uTexture,
        vUv + 0.01*sin(vUv*20. + time) 
    );

    gl_FragColor = vec4( vUv,0.,1.);
    gl_FragColor = myimage;

    
}