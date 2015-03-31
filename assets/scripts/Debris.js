(function(){
    function Debris (amount, area, THREE) {
        this.amount = amount;
        this.area = area;
        this.asteroids = [];
        this.outline =  [];
        this.material = new THREE.MeshLambertMaterial( { color: 0xBFD7D9 } );
    }
    Debris.prototype = {
        createDebris: function (geometries, scene) {
            var random;
            for(var i = 0; i < this.amount; i++){
                var scale = 900;
                var outlineScale = scale + scale * 0.1;

                random = Math.floor(Math.random() * geometries.length);
                this.asteroids[i] = new THREE.Mesh( this.geometry[random].clone(), this.material );
                this.asteroids[i].scale.multiplyScalar(scale);
                this.randomPosition(this.asteroids[i]);

                scene.add(this.asteroids[i]);

                this.outline[i] = new THREE.Mesh(
                    geometries[random].clone(),
                    new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.BackSide, transparent: true, opacity : 0} ));
                this.outline[i].scale.multiplyScalar(outlineScale);
                this.outline[i].material.opacity = 0;

                scene.add(this.outline[i]);
            }
        },
        randomPosition: function (asteroid) {
            asteroid.position.x = Math.random() * this.area;
            asteroid.position.y = Math.random() * this.area;
            asteroid.position.z = -1600;

            if(Math.floor(Math.random() * 2) === 0){asteroid.position.x *= -1}
            if(Math.floor(Math.random() * 2) === 0){asteroid.position.y *= -1}

            asteroid.userData.finalPosition = {x:0,y:0,z:2};
            asteroid.userData.finalPosition.x = Math.random() * 80;
            asteroid.userData.finalPosition.y = Math.random() * 80;

            if(Math.floor(Math.random() * 2) === 0){asteroid.userData.finalPosition.x *= -1}
            if(Math.floor(Math.random() * 2) === 0){asteroid.userData.finalPosition.y *= -1}

            //speed
            asteroid.userData.speed = {x:0, y:0, z:Math.random() * 10 + 1};

            //distance
            asteroid.userData.distanceZ = Math.abs(asteroid.userData.finalPosition.z) + Math.abs(asteroid.position.z);

            //time
            asteroid.userData.time = asteroid.userData.distanceZ / asteroid.userData.speed.z;

            //speed x
            asteroid.userData.speed.x = (asteroid.userData.finalPosition.x - asteroid.position.x) / asteroid.userData.time;

            //speed y
            asteroid.userData.speed.y = (asteroid.userData.finalPosition.y - asteroid.position.y) / asteroid.userData.time;

            //Random rotation
            asteroid.rotation.x = Math.random() * 360 * Math.PI / 180;
            asteroid.rotation.y = Math.random() * 360 * Math.PI / 180;
            asteroid.rotation.z = Math.random() * 360 * Math.PI / 180;

            //Random turn
            asteroid.userData.randomRotationSpeed = {x:0,y:0,z:0};
            asteroid.userData.randomRotationSpeed.x = Math.random() * 0.01;
            asteroid.userData.randomRotationSpeed.y = Math.random() * 0.01;
            asteroid.userData.randomRotationSpeed.z = Math.random() * 0.01;

            if(Math.floor(Math.random() * 2) === 0){asteroid.userData.randomRotationSpeed.x *= -1}
            if(Math.floor(Math.random() * 2) === 0){asteroid.userData.randomRotationSpeed.y *= -1}
            if(Math.floor(Math.random() * 2) === 0){asteroid.userData.randomRotationSpeed.z *= -1}
        },
        updatePosition: function (asteroid, outline) {
            asteroid.position.x += asteroid.userData.speed.x/6;
            asteroid.position.y += asteroid.userData.speed.y/6;
            asteroid.position.z += asteroid.userData.speed.z/2;

            outline.position.x = asteroid.position.x;
            outline.position.y = asteroid.position.y;
            outline.position.z = asteroid.position.z;

            asteroid.rotation.x += asteroid.userData.randomRotationSpeed.x;
            asteroid.rotation.y += asteroid.userData.randomRotationSpeed.y;
            asteroid.rotation.z += asteroid.userData.randomRotationSpeed.z;

            outline.rotation.x = asteroid.rotation.x;
            outline.rotation.y = asteroid.rotation.y;
            outline.rotation.z = asteroid.rotation.z;

            if(asteroid.position.z > -200){
                outline.material.opacity = 1;
            }
        },
        update: function () {
            for(var i = 0; i < this.asteroids.length; i++){

                this.updatePosition(this.asteroids[i], this.outline[i]);

                if(this.asteroids[i].position.z > 2){
                    this.randomPosition(this.asteroids[i]);
                    this.outline[i].material.opacity = 0;
                }
            }
        }
    };

    window.Debris = Debris;
})();