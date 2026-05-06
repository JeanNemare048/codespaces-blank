var water;
var fire;
var firetruck;
var cursor;
var cursors;
var platforms;
var mouseX = 400;
var mouseY = 300;
var controlMode = 'mouse'; // 'mouse' or 'arrows'
var MKey; // For M key detection
var waterGroup;
var fireGroup;

class Game3 extends Phaser.Scene {
    constructor() {
        super({ key: 'game_scene_3' });
    }

    preload() {
        this.load.image('water', 'assets/water.png');
        this.load.image('fire', 'assets/fire.png');
        this.load.image('cursor', 'assets/cursor.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('firetruck', 'assets/firetruck.png');
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
        this.nextPrintTime = 0;

        MKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        firetruck = this.add.sprite(30, 475, 'firetruck');
        firetruck.setScale(0.5);

        water = this.physics.add.sprite(-50, 480, 'water');
        water.setScale(0.5);
        water.hasBeenShot = false;

        waterGroup = this.physics.add.group();
        waterGroup.add(water);

        fire = this.physics.add.sprite(700, 500, 'fire');
        fire.setScale(0.5);
        fire.body.allowGravity = false;

        fireGroup = this.physics.add.staticGroup({
            key: 'fire',
            repeat: 9,
            setXY: { x: 700, y: 50, stepY: 50 }
        });
        fire.destroy();

        fireGroup.children.iterate(function (child) {
            child.setScale(0.5);
            child.body.allowGravity = false;
            child.refreshBody();
        });

        this.physics.add.overlap(fireGroup, waterGroup, function (fireCollide, waterCollide) {
            fireCollide.destroy();
            this.respawnFire(fireCollide);
        }.bind(this));

        cursor = this.physics.add.sprite(mouseX, mouseY, 'cursor');
        cursor.setScale(1);
        cursor.body.allowGravity = false;

        water.setBounce(0.1);
        this.physics.add.collider(water, platforms);

        this.input.on('pointermove', function (pointer) {
            mouseX = pointer.x;
            mouseY = pointer.y;
        }, this);

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // updateModeDisplay();
    }

    update() {
        waterGroup.getChildren().forEach(function (waterSprite) {
            const padding = 50;
            if (waterSprite.x < -padding ||
                waterSprite.x > 800 + padding ||
                waterSprite.y < -padding ||
                waterSprite.y > 600 + padding) {
                waterSprite.destroy();
            }
        });

        if (Phaser.Input.Keyboard.JustDown(MKey)) {
            this.toggleControlMode();
        }

        if (controlMode === 'mouse') {
            this.handleMouseMode();
        } else {
            this.handleArrowMode();
        }

        this.updateAimingBar();

        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            waterGroup.getChildren().forEach(function (waterSprite) {
                if (!waterSprite.hasBeenShot) {
                    this.shootWater(waterSprite);
                }
            }, this);
        }

        if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 100)) {
            var newWater = this.physics.add.sprite(40, 480, 'water');
            newWater.setScale(0.5);
            newWater.setBounce(0.1);
            newWater.setCollideWorldBounds(true);
            newWater.hasBeenShot = false;

            this.physics.add.collider(newWater, platforms);
            waterGroup.add(newWater);

            this.shootWater(newWater);

            this.physics.add.collider(fireGroup, newWater, function (fireCollide, waterCollide) {
                fireCollide.destroy();
                this.respawnFire(fireCollide);
            }.bind(this));
        }
    }

    updateAimingBar() {
        const aimingBar = document.getElementById('aimingBar');
        const angleDisplay = document.getElementById('angleDisplay');
        const barX = 50;
        const barY = 600 - 125;
        let targetX = cursor.x;
        let targetY = cursor.y;
        const deltaX = targetX - barX;
        const deltaY = targetY - barY;
        const angleRad = Math.atan2(deltaY, deltaX);
        const angleDeg = angleRad * (180 / Math.PI);
        aimingBar.style.transform = `rotate(${angleDeg}deg)`;
        if (angleDisplay) {
            angleDisplay.textContent = `Angle: ${angleDeg.toFixed(1)}°`;
        }
    }

    shootWater(waterSprite) {
        if (waterSprite.hasBeenShot) {
            return;
        }

        const barX = 50;
        const barY = 600 - 125;
        let targetX = cursor.x;
        let targetY = cursor.y;
        const dx = targetX - barX;
        const dy = targetY - barY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 2000;
        if (distance > 0) {
            waterSprite.setVelocity(
                (dx / distance) * speed,
                (dy / distance) * speed
            );
            waterSprite.hasBeenShot = true;
        }
    }

    respawnFire(fireSprite) {
        if (fireGroup.countActive(true) === 0) {
            console.log('All fires extinguished!');
        }
    }

    toggleControlMode() {
        if (controlMode === 'mouse') {
            controlMode = 'arrows';
            cursor.setVelocity(0, 0);
        } else {
            controlMode = 'mouse';
            cursor.x = mouseX;
            cursor.y = mouseY;
            cursor.setVelocity(0, 0);
        }
        this.updateModeDisplay();
    }

    handleArrowMode() {
        var speed = 200;
        cursor.setVelocity(0, 0);
        if (cursors.left.isDown) {
            cursor.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            cursor.setVelocityX(speed);
        }
        if (cursors.up.isDown) {
            cursor.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            cursor.setVelocityY(speed);
        }
    }

    updateModeDisplay() {
        var display = document.getElementById('modeDisplay');
        var modeText = controlMode === 'mouse' ? 'Mouse Follow' : 'Arrow Keys';
        var color = controlMode === 'mouse' ? '#4CAF50' : '#2196F3';
        display.innerHTML = `Mode: <span style="color: ${color}; font-weight: bold;">${modeText}</span><br>Press M to toggle`;
    }

    handleMouseMode() {
        cursor.x = mouseX;
        cursor.y = mouseY;
        cursor.setVelocity(0, 0);
    }
}

export default Game3;
