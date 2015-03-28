var camera, scene, renderer, windowWidth, windowHeight, geometry, material, verticalMovmet, horisontalMovmet;
var player = {
    speed: 2,
    left: false,
    top: false,
    right: false,
    down: false,
    verticalMovment: 0,
    horisontalMovment: 0,
    calculateDirection: function(){
        if(this.right && !this.left)this.horisontalMovment = -1;
        if(this.left && !this.right)this.horisontalMovment = 1;
        if(this.left == this.right)this.horisontalMovment = 0;
        if(this.up && !this.down)this.verticalMovment = -1;
        if(this.down && !this.up)this.verticalMovment = 1;
        if(this.down == this.up)this.verticalMovment = 0;
    }
};
var debris = [];
var rockGeometrys = [];

var dae;


var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'assets/objects/rocks.dae', function ( collada ) {

    for(var child in collada.dae.geometries){
        rockGeometrys.push(collada.dae.geometries[child].mesh.geometry3js);
    }

    init();
    animate();

});

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    camera = new THREE.PerspectiveCamera( 40, windowWidth / windowHeight, 1, 10000 );

    scene = new THREE.Scene();

    var size = 9;
    geometry = new THREE.BoxGeometry( size, size, size );
    material = new THREE.MeshLambertMaterial( { color: "red" } );
    createdebris(70);

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.9 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, -500, 500);
    scene.add( hemiLight );

    var planetGeo = new THREE.SphereGeometry(800, 15, 15);
    var planetmaterial = new THREE.MeshLambertMaterial({color:"green"});
    var planet = new THREE.Mesh(planetGeo, planetmaterial);
    planet.scale.z = 0.01;
    planet.position.z = -1800;
    planet.position.x = -250;
    scene.add(planet);

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', onMouseMove, false );

}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if(key == 37) player.left = true;
    if(key == 38) player.up = true;
    if(key == 39) player.right = true;
    if(key == 40) player.down = true;

    player.calculateDirection();
};

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if(key == 37) player.left = false;
    if(key == 38) player.up = false;
    if(key == 39) player.right = false;
    if(key == 40) player.down = false;

    player.calculateDirection();
};

function createdebris(amount) {
    var random;
    for(var i = 0; i < amount; i++){
        random = Math.floor(Math.random() * rockGeometrys.length);
        debris[i] = new THREE.Mesh( rockGeometrys[random], material );
        debris[i].scale.x = debris[i].scale.y = debris[i].scale.z = 500;
        randomPosition(debris[i]);
        scene.add(debris[i]);
    }
}

function randomPosition(debris) {
    debris.position.x = Math.random() * 400;
    debris.position.y = Math.random() * 400;
    debris.position.z = -600 - Math.floor(Math.random() * 600);

    if(Math.floor(Math.random() * 2) === 0){debris.position.x *= -1}
    if(Math.floor(Math.random() * 2) === 0){debris.position.y *= -1}

    debris.userData.finalPosition = {x:0,y:0,z:2};
    debris.userData.finalPosition.x = Math.random() * 80;
    debris.userData.finalPosition.y = Math.random() * 80;

    if(Math.floor(Math.random() * 2) === 0){debris.userData.finalPosition.x *= -1}
    if(Math.floor(Math.random() * 2) === 0){debris.userData.finalPosition.y *= -1}

    //speed
    debris.userData.speed = {x:0, y:0, z:Math.random() * 10 + 1};

    //distance
    debris.userData.distanceZ = Math.abs(debris.userData.finalPosition.z) + Math.abs(debris.position.z);

    //time
    debris.userData.time = debris.userData.distanceZ / debris.userData.speed.z;

    //speed x
    debris.userData.speed.x = (debris.userData.finalPosition.x - debris.position.x) / debris.userData.time;

    //speed y
    debris.userData.speed.y = (debris.userData.finalPosition.y - debris.position.y) / debris.userData.time;

    //Random rotation
    debris.rotation.x = Math.random() * 360 * Math.PI / 180;
    debris.rotation.y = Math.random() * 360 * Math.PI / 180;
    debris.rotation.z = Math.random() * 360 * Math.PI / 180;

    //Random turn
    debris.userData.randomRotationSpeed = {x:0,y:0,z:0};
    debris.userData.randomRotationSpeed.x = Math.random() * 0.01;
    debris.userData.randomRotationSpeed.y = Math.random() * 0.01;
    debris.userData.randomRotationSpeed.z = Math.random() * 0.01;

    if(Math.floor(Math.random() * 2) === 0){debris.userData.randomRotationSpeed.x *= -1}
    if(Math.floor(Math.random() * 2) === 0){debris.userData.randomRotationSpeed.y *= -1}
    if(Math.floor(Math.random() * 2) === 0){debris.userData.randomRotationSpeed.z *= -1}
}

function onMouseMove(e) {
    var halfWidth = windowWidth / 2;
    var halfHeight = windowHeight / 2;

    var horizontal = e.x / halfWidth;
    var vertical = e.y / halfHeight;

    if(horizontal >= 1){
        horizontal -= 1;
    }else{
        horizontal = (1-horizontal) * -1;
    }

    if(vertical >= 1){
        vertical -= 1;
    }else{
        vertical = (1-vertical) * -1;
    }

    //move camera
    //camera.position.x = horizontal * 40;
    //camera.position.y = -vertical * 40;
    verticalMovmet = vertical * 40;
    horisontalMovmet = -horizontal * 40;

    //rotate camera
    //camera.rotation.y = -horizontal * 5 * Math.PI / 180;
    //camera.rotation.x = -vertical * 5 * Math.PI / 180;
}

function onWindowResize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( windowWidth , windowHeight );
}

function animate() {



    requestAnimationFrame( animate );

    camera.rotation.y = player.horisontalMovment * 5 * Math.PI / 180;
    camera.rotation.x = -player.verticalMovment * 5 * Math.PI / 180;

    for(var i = 0; i < debris.length; i++){
        debris[i].position.x += debris[i].userData.speed.x + (player.horisontalMovment * player.speed);
        debris[i].position.y += debris[i].userData.speed.y + (player.verticalMovment * player.speed);
        debris[i].position.z += debris[i].userData.speed.z + 2;

        debris[i].rotation.x += debris[i].userData.randomRotationSpeed.x;
        debris[i].rotation.y += debris[i].userData.randomRotationSpeed.y;
        debris[i].rotation.z += debris[i].userData.randomRotationSpeed.z;

        if(debris[i].position.z > 2){
            randomPosition(debris[i]);
        }
    }

    renderer.render( scene, camera );
}