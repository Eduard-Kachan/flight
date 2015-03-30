var camera, scene, renderer, windowWidth, windowHeight, planet, geometry, material, materialOutline, verticalMovement, horizontalMovement, t;
var asteroidColor = 0xBFD7D9;
var fillLightColor = 0x000000;
var keyLightColor = 0xE4A268;

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
    finalRotation: {
        x:0,
        y:180 * Math.PI / 180,
        z:0
    },
    calculatePosition: function() {
        if(this.movement.right && !this.movement.left){
            this.finalSpeed.x = -1;
            this.finalRotation.z = 10 * Math.PI / 180;
            this.spaceship.rotation.z = 10 * Math.PI / 180;
        }
        if(this.movement.left && !this.movement.right){
            this.finalSpeed.x = 1;
            this.finalRotation.z = -10 * Math.PI / 180;
            this.spaceship.rotation.z = -10 * Math.PI / 180;
        }
        if(this.movement.left == this.movement.right){
            this.finalSpeed.x = 0;
            this.finalRotation.z = 0;
            this.spaceship.rotation.z = 0;
        }
        if(this.movement.up && !this.movement.down){
            this.finalSpeed.y = -1;
            this.finalRotation.x = 10 * Math.PI / 180;
            this.spaceship.rotation.x = 10 * Math.PI / 180;
        }
        if(this.movement.down && !this.movement.up){
            this.finalSpeed.y = 1;
            this.finalRotation.x = -10 * Math.PI / 180;
            this.spaceship.rotation.x = -10 * Math.PI / 180;
        }
        if(this.movement.down == this.movement.up){
            this.finalSpeed.y = 0;
            this.finalRotation.x = 0;
            this.spaceship.rotation.x = 0;
        }
    },
    t1:0,
    t2:0,
    update: function(){
        var int = 0.009;
        if(this.speed.x != this.finalSpeed.x * this.maxSpeed){
            if(this.speed.x > this.finalSpeed.x * this.maxSpeed){
                this.speed.x -= int;
            }else{
                this.speed.x += int;
            }
        }

        if(this.speed.y != this.finalSpeed.y * this.maxSpeed){
            if(this.speed.y > this.finalSpeed.y * this.maxSpeed){
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

function Debris(amount, area, scene){
    this.scene = scene;
    this.geometry = [];
    this.asteroidsAmount = amount;
    this.asteroidsArea = area;
    this.asteroids = [];
    this.outline = [];

    this.createDebris = function () {
        var random;
        for(var i = 0; i < this.asteroidsAmount; i++){
            var scale = 900;
            var outlineScale = scale + scale * 0.1;

            random = Math.floor(Math.random() * this.geometry.length);
            this.asteroids[i] = new THREE.Mesh( this.geometry[random].clone(), material );
            this.asteroids[i].scale.multiplyScalar(scale);
            this.randomPosition(this.asteroids[i], this.asteroidsArea);

            this.scene.add(this.asteroids[i]);
        }
    };

    this.randomPosition = function (debris) {
        debris.position.x = Math.random() * this.asteroidsArea;
        debris.position.y = Math.random() * this.asteroidsArea;
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
    };

    this.updatePosition= function (debri, debriOutline) {

        debri.position.x += debri.userData.speed.x/6; // + player.speed.x;
        debri.position.y += debri.userData.speed.y/6; // + player.speed.y;
        debri.position.z += debri.userData.speed.z/2; // + player.maxSpeed/2;

        debriOutline.position.x = debri.position.x;
        debriOutline.position.y = debri.position.y;
        debriOutline.position.z = debri.position.z;

        debri.rotation.x += debri.userData.randomRotationSpeed.x;
        debri.rotation.y += debri.userData.randomRotationSpeed.y;
        debri.rotation.z += debri.userData.randomRotationSpeed.z;

        debriOutline.rotation.x = debri.rotation.x;
        debriOutline.rotation.y = debri.rotation.y;
        debriOutline.rotation.z = debri.rotation.z;

        if(debri.position.z > -200){
            debriOutline.material.opacity = 1;
        }
    };
}

var debris = {
    geometry:[],
    outerAsteroidsAmount: 105,
    innerAsteroidsAmount: 90,
    outerAsteroidArea:800,
    innerAsteroidArea:400,
    outerAsteroids: [],
    innerAsteroids: [],
    outerOutline: [],
    innerOutline: [],
    createDebris: function (amount, asteroid, outline, area) {
        var random;
        for(var i = 0; i < amount; i++){
            var scale = 900;
            var outlineScale = scale + scale * 0.1;
            random = Math.floor(Math.random() * this.geometry.length);
            asteroid[i] = new THREE.Mesh( this.geometry[random].clone(), material );
            asteroid[i].scale.multiplyScalar(scale);
            this.randomPosition(asteroid[i], area);

            scene.add(asteroid[i]);

            outline[i] = new THREE.Mesh(
                this.geometry[random].clone(),
                new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.BackSide, transparent: true, opacity : 0} ));
            outline[i].scale.multiplyScalar(outlineScale);
            outline[i].material.opacity = 0;

            scene.add(outline[i]);
        }
    },
    randomPosition: function (debris, area) {
        debris.position.x = Math.random() * area;
        debris.position.y = Math.random() * area;
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
    },
    updatePosition: function (debri, debriOutline) {

        debri.position.x += debri.userData.speed.x/6; // + player.speed.x;
        debri.position.y += debri.userData.speed.y/6; // + player.speed.y;
        debri.position.z += debri.userData.speed.z/2; // + player.maxSpeed/2;

        debriOutline.position.x = debri.position.x;
        debriOutline.position.y = debri.position.y;
        debriOutline.position.z = debri.position.z;

        debri.rotation.x += debri.userData.randomRotationSpeed.x;
        debri.rotation.y += debri.userData.randomRotationSpeed.y;
        debri.rotation.z += debri.userData.randomRotationSpeed.z;

        debriOutline.rotation.x = debri.rotation.x;
        debriOutline.rotation.y = debri.rotation.y;
        debriOutline.rotation.z = debri.rotation.z;

        if(debri.position.z > -200){
            debriOutline.material.opacity = 1;
        }
    },
    updateDebris: function(asteroid, outline, area){
        for(var i = 0; i < asteroid.length; i++){

            this.updatePosition(asteroid[i], outline[i]);

            if(asteroid[i].position.z > 2){
                this.randomPosition(asteroid[i], area);
                outline[i].material.opacity = 0;
            }
        }
    },
    update: function () {
        this.updateDebris(this.outerAsteroids, this.outerOutline, this.outerAsteroidArea);
        this.updateDebris(this.innerAsteroids, this.innerOutline, this.innerAsteroidArea);
    }
};


// Load Collada objects
// All objects must be in the same file
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
            debris.geometry.push(geometry.children[0].geometry);
        }
    }
    init();
    animate();
});

function init() {

    // creating Renderer, Camera and Scene
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    camera = new THREE.PerspectiveCamera( 74, windowWidth / windowHeight, 1, 10000 );

    scene = new THREE.Scene();

    // Material for the asteroids
    material = new THREE.MeshLambertMaterial( { color: asteroidColor } );

    // Creating asteroids
    debris.createDebris(debris.outerAsteroidsAmount, debris.outerAsteroids, debris.outerOutline, debris.outerAsteroidArea);
    debris.createDebris(debris.innerAsteroidsAmount, debris.innerAsteroids, debris.innerOutline, debris.innerAsteroidArea);

    // Creating lights
    var hemiLight = new THREE.HemisphereLight( 0xC75145, 0xC75145, 0.1);
    hemiLight.position.set( -3, -3, 0);
    scene.add( hemiLight );

    var keyLight = new THREE.DirectionalLight(keyLightColor);
    keyLight.position.set(1, 1, 1);
    scene.add(keyLight);

    var fillLight = new THREE.DirectionalLight(fillLightColor);
    fillLight.position.set(-1, -1, 1);
    scene.add(fillLight);

    // Creating the planet
    // Adding a texture to the Sphere Geometry
    var diamitor = 1000;
    var planetGeo = new THREE.SphereGeometry(diamitor, 15, 15);
    var plannetTexture = THREE.ImageUtils.loadTexture('assets/images/trova.jpg');
    var planetmaterial = new THREE.MeshLambertMaterial({map:plannetTexture});
    planet = new THREE.Mesh(planetGeo, planetmaterial);
    planet.position.z = -1600 - diamitor;
    planet.position.x = -500;
    scene.add(planet);

    scene.add(player.spaceship);

    // Scaling the renderer to the screen dimentions
    window.addEventListener( 'resize', onWindowResize, false );

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

// Unused
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


// Animate function that renders the scene
function animate() {
    renderer.render( scene, camera );

    planet.rotation.y += 0.00009;

    player.update();
    debris.update();

    requestAnimationFrame( animate );
}

