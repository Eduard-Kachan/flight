var camera, scene, renderer, windowWidth, windowHeight, geometry, material;
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

    camera = new THREE.PerspectiveCamera( 40, windowWidth / windowHeight, 1, 1000 );

    scene = new THREE.Scene();

    var size = 9;
    geometry = new THREE.BoxGeometry( size, size, size );
    material = new THREE.MeshBasicMaterial( { color: "red" } );
    createdebris(70);

    var planetGeo = new THREE.SphereGeometry(400, 400, 400);
    var planetmaterial = new THREE.MeshBasicMaterial({color:"green"});
    var planet = new THREE.Mesh(planetGeo, planetmaterial);
    planet.position.z = -1000;
    planet.position.x = -250;
    scene.add(planet);

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', onMouseMove, false );

}


function createdebris(amount) {
    var random;
    for(var i = 0; i < amount; i++){
        random = Math.floor(Math.random() * rockGeometrys.length);
        debris[i] = new THREE.Mesh( rockGeometrys[random], material );
        debris[i].scale.x = debris[i].scale.y = debris[i].scale.z = 400;
        randomPosition(debris[i]);
        scene.add(debris[i]);
    }
}

function randomPosition(debris) {
    debris.position.x = Math.random() * 250;
    debris.position.y = Math.random() * 200;
    debris.position.z = -400 - Math.floor(Math.random() * 400);

    if(Math.floor(Math.random() * 2) === 0){debris.position.x *= -1}
    if(Math.floor(Math.random() * 2) === 0){debris.position.y *= -1}

    debris.userData.finalPosition = {x:0,y:0,z:2};
    debris.userData.finalPosition.x = Math.random() * 80;
    debris.userData.finalPosition.y = Math.random() * 80;

    if(Math.floor(Math.random() * 2) === 0){debris.userData.finalPosition.x *= -1}
    if(Math.floor(Math.random() * 2) === 0){debris.userData.finalPosition.y *= -1}

    //speed
    debris.userData.speed = {x:0, y:0, z:Math.random() * 3 + 1};

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
    camera.position.x = horizontal * 40;
    camera.position.y = -vertical * 40;

    //rotate camera
    camera.rotation.y = -horizontal * 5 * Math.PI / 180;
    camera.rotation.x = -vertical * 5 * Math.PI / 180;
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

    for(var i = 0; i < debris.length; i++){
        debris[i].position.x += debris[i].userData.speed.x;
        debris[i].position.y += debris[i].userData.speed.y;
        debris[i].position.z += debris[i].userData.speed.z;

        debris[i].rotation.x += debris[i].userData.randomRotationSpeed.x;
        debris[i].rotation.y += debris[i].userData.randomRotationSpeed.y;
        debris[i].rotation.z += debris[i].userData.randomRotationSpeed.z;

        if(debris[i].position.z > 2){
            randomPosition(debris[i]);
        }
    }


    renderer.render( scene, camera );

}