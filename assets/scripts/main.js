var camera, scene, renderer, windowWidth, windowHeight, geometry, material;
var debri = [];

init();
animate();

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
    createDebri(70);

    var planetGeo = new THREE.SphereGeometry(400, 400, 400);
    var planetmaterial = new THREE.MeshBasicMaterial({color:"green"});
    var planet = new THREE.Mesh(planetGeo, planetmaterial);
    planet.position.z = -1000;
    planet.position.x = -250;
    scene.add(planet);

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', onMouseMove, false );

}

function createDebri(amount) {
    for(var i = 0; i < amount; i++){
        debri[i] = new THREE.Mesh( geometry, material );
        randomPosition(debri[i]);
        scene.add(debri[i]);
        //console.log(debri[i]);
    }

}

function randomPosition(debri) {
    debri.position.x = Math.random() * 250;
    debri.position.y = Math.random() * 200;
    debri.position.z = -400 - Math.floor(Math.random() * 400);

    if(Math.floor(Math.random() * 2) === 0){debri.position.x *= -1}
    if(Math.floor(Math.random() * 2) === 0){debri.position.y *= -1}

    debri.userData.finalPosition = {x:0,y:0,z:2};
    debri.userData.finalPosition.x = Math.random() * 80;
    debri.userData.finalPosition.y = Math.random() * 80;

    if(Math.floor(Math.random() * 2) === 0){debri.userData.finalPosition.x *= -1}
    if(Math.floor(Math.random() * 2) === 0){debri.userData.finalPosition.y *= -1}

    //speed
    debri.userData.speed = {x:0, y:0, z:Math.random() * 3 + 1};

    //distance
    debri.userData.distanceZ = Math.abs(debri.userData.finalPosition.z) + Math.abs(debri.position.z);

    //time
    debri.userData.time = debri.userData.distanceZ / debri.userData.speed.z;

    //speed x
    debri.userData.speed.x = (debri.userData.finalPosition.x - debri.position.x) / debri.userData.time;

    //speed y
    debri.userData.speed.y = (debri.userData.finalPosition.y - debri.position.y) / debri.userData.time;

    //console.log(debri.userData.speed.x, debri.userData.speed.y)
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

    for(var i = 0; i < debri.length; i++){
        debri[i].position.x += debri[i].userData.speed.x;
        debri[i].position.y += debri[i].userData.speed.y;
        debri[i].position.z += debri[i].userData.speed.z;

        if(debri[i].position.z > 2){
            randomPosition(debri[i]);
        }
    }


    renderer.render( scene, camera );

}