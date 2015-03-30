var camera, scene, renderer, windowWidth, windowHeight, planet, geometry, material, verticalMovement, horizontalMovement, t;
var asteroidColor = 0xBFD7D9;
var fillLightColor = 0x000000;
var keyLightColor = 0xE4A268;
var asteroids = 120;
var player = {
    spaceship: null,
    maxSpeed: 0.4,
    movement: {
        left: false,
        top: false,
        right: false,
        down: false
    },
    speed: {
        x:0,
        y:0
    },
    finalSpeed: {
        x:0,
        y: 0
    },
    calculatePosition: function() {
        if(this.movement.right && !this.movement.left)this.finalSpeed.x = this.maxSpeed * -1;
        if(this.movement.left && !this.movement.right)this.finalSpeed.x = this.maxSpeed;
        if(this.movement.left == this.movement.right)this.finalSpeed.x = 0;
        if(this.movement.up && !this.movement.down)this.finalSpeed.y = this.maxSpeed * -1;
        if(this.movement.down && !this.movement.up)this.finalSpeed.y = this.maxSpeed;
        if(this.movement.down == this.movement.up)this.finalSpeed.y = 0;
    },
    t1:0,
    t2:0,
    update: function(){
        var int = 0.009;
        if(this.speed.x != this.finalSpeed.x){
            if(this.speed.x > this.finalSpeed.x){
                this.speed.x -= int;
            }else{
                this.speed.x += int;
            }
        }

        if(this.speed.y != this.finalSpeed.y){
            if(this.speed.y > this.finalSpeed.y){
                this.speed.y -= int;
            }else{
                this.speed.y += int;
            }
        }

        this.spaceship.position.x -= this.speed.x;
        this.spaceship.position.y -= this.speed.y;
    },
    ease: function (time, multiplicator) {
        return (1 - Math.cos(time * Math.PI))/2 * multiplicator;
    }
};

var debris = [];
var rockGeometrys = [];


var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'assets/objects/AsteroidDodge.dae', function ( collada ) {

    for(var i = 0; i < collada.scene.children.length; i++){
        var geometry = collada.scene.children[i];

        if(geometry.colladaId == 'Spaceship'){
            player.spaceship = geometry;
            player.spaceship.position.z = -25;
            player.spaceship.rotation.y = 180 * Math.PI / 180;
        }else if(geometry.colladaId.search('rock') > -1){
            rockGeometrys.push(geometry.children[0].geometry);
        }
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

    camera = new THREE.PerspectiveCamera( 74, windowWidth / windowHeight, 1, 10000 );

    scene = new THREE.Scene();

    var size = 9;
    geometry = new THREE.BoxGeometry( size, size, size );
    material = new THREE.MeshLambertMaterial( { color: asteroidColor } );
    createDebris(asteroids);

    var hemiLight = new THREE.HemisphereLight( 0xC75145, 0xC75145, 0.1);
    hemiLight.position.set( -3, -3, 0);
    scene.add( hemiLight );

    var keyLight = new THREE.DirectionalLight(keyLightColor);
    keyLight.position.set(1, 1, 1);
    scene.add(keyLight);

    var fillLight = new THREE.DirectionalLight(fillLightColor);
    fillLight.position.set(-1, -1, 1);
    scene.add(fillLight);

    var diamitor = 1000;
    var planetGeo = new THREE.SphereGeometry(diamitor, 15, 15);
    var plannetTexture = THREE.ImageUtils.loadTexture('assets/images/trova.jpg');
    var planetmaterial = new THREE.MeshLambertMaterial({map:plannetTexture});
    planet = new THREE.Mesh(planetGeo, planetmaterial);
    //planet.scale.z = 0.01;
    planet.position.z = -1600 - diamitor;
    planet.position.x = -500;
    scene.add(planet);

    scene.add(player.spaceship);


    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', onMouseMove, false );

}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if(key == 37) player.movement.left = true;
    if(key == 38) player.movement.up = true;
    if(key == 39) player.movement.right = true;
    if(key == 40) player.movement.down = true;

    player.calculatePosition();
};

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if(key == 37) player.movement.left = false;
    if(key == 38) player.movement.up = false;
    if(key == 39) player.movement.right = false;
    if(key == 40) player.movement.down = false;

    player.calculatePosition();
};

function createDebris(amount) {
    var random;
    for(var i = 0; i < amount; i++){
        random = Math.floor(Math.random() * rockGeometrys.length);
        debris[i] = new THREE.Mesh( rockGeometrys[random], material );
        debris[i].scale.x = debris[i].scale.y = debris[i].scale.z = 800;
        randomPosition(debris[i]);
        scene.add(debris[i]);
    }
}

function randomPosition(debris) {
    debris.position.x = Math.random() * 800;
    debris.position.y = Math.random() * 800;
    debris.position.z = -1600;//-600 - Math.floor(Math.random() * 600);

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


var t1 = 0;
var t2 = 1;



function animate() {

    planet.rotation.y += 0.00009;

    player.update();

    requestAnimationFrame( animate );

    //camera.rotation.y = player.horisontalMovment * 5 * Math.PI / 180;
    //camera.rotation.x = -player.verticalMovment * 5 * Math.PI / 180;

    for(var i = 0; i < debris.length; i++){
        debris[i].position.x += debris[i].userData.speed.x/6; // + player.speed.x;
        debris[i].position.y += debris[i].userData.speed.y/6; // + player.speed.y;
        debris[i].position.z += debris[i].userData.speed.z/2; // + player.maxSpeed/2;


        debris[i].rotation.x += debris[i].userData.randomRotationSpeed.x;
        debris[i].rotation.y += debris[i].userData.randomRotationSpeed.y;
        debris[i].rotation.z += debris[i].userData.randomRotationSpeed.z;

        if(debris[i].position.z > 2){
            randomPosition(debris[i]);
        }
    }

    renderer.render( scene, camera );

}