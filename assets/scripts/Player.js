(function(){
    function Player (spaceshipObj) {
        this.spaceship = spaceshipObj;
        this.maxSpeed = 0.4;
        this.movement =  {
            left: false,
            top: false,
            right: false,
            down: false
        };
        this.speed = {
            x:0,
            y:0
        };
        this.finalSpeed = {
            x:0,
            y: 0
        };
        this.finalRotation = {
            x:0,
            y:180 * Math.PI / 180,
            z:0
        };
    }

    Player.prototype = {
        calculatePosition: function() {
            if(this.movement.right && !this.movement.left){
                this.finalSpeed.x = -1;
                this.finalRotation.z = -10 * Math.PI / 180;
                this.spaceship.rotation.z = -10 * Math.PI / 180;
            }
            if(this.movement.left && !this.movement.right){
                this.finalSpeed.x = 1;
                this.finalRotation.z = 10 * Math.PI / 180;
                this.spaceship.rotation.z = 10 * Math.PI / 180;
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

    window.Player = Player;
})();