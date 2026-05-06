  var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                    gravity: { y: 300 },
                    debug: true
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    
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

    var game = new Phaser.Game(config);

    function preload ()
    {
        this.load.image('water', 'assets/water.png');
        this.load.image('fire', 'assets/fire.png');
        this.load.image('cursor', 'assets/cursor.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('firetruck', 'assets/firetruck.png');
    }

    function create ()
    {
        cursors = this.input.keyboard.createCursorKeys();
        this.nextPrintTime = 0;
        
        // Create M key object
        MKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        
        // Create platforms
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        
        // Create firetruck sprite
        firetruck = this.add.sprite(30, 475, 'firetruck');
        firetruck.setScale(0.5);
        
        // Create sprites
        water = this.physics.add.sprite(-50, 480, 'water');
        water.setScale(0.5);
        water.hasBeenShot = false; // Track if water has been shot

        waterGroup = this.physics.add.group();
        waterGroup.add(water);

        fire = this.physics.add.sprite(700, 500, 'fire');
        fire.setScale(0.5);
        fire.body.allowGravity = false;

        fireGroup = this.physics.add.staticGroup(
            {key: 'fire', repeat: 3, setXY: { x: 700, y: 100, stepY: 120 }}
        );
        fire.destroy();

        fireGroup.children.iterate(function (child) {
            child.setScale(0.5);
            child.body.allowGravity = false;
            child.refreshBody();
        });

        this.physics.add.overlap(fireGroup, waterGroup, function(fireCollide, waterCollide){
            fireCollide.destroy();
            respawnFire(fireCollide);
        }.bind(this));

        // Create cursor sprite
        cursor = this.physics.add.sprite(mouseX, mouseY, 'cursor');
        cursor.setScale(1);
        cursor.body.allowGravity = false;
        
        // Set up water physics
        water.setBounce(0.1);
        this.physics.add.collider(water, platforms);
        
        // Set up mouse input
        this.input.on('pointermove', function (pointer) {
            mouseX = pointer.x;
            mouseY = pointer.y;
        }, this);

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Update mode display
        updateModeDisplay();
    }

    function update ()
    {
        // In the update function, add boundary checking:
        waterGroup.getChildren().forEach(function(waterSprite) {
            // Check if sprite is completely outside screen boundaries
            // Add some padding to ensure it's fully out
            const padding = 50; // Extra margin to ensure it's fully out
            
            if (waterSprite.x < -padding || 
                waterSprite.x > 800 + padding ||
                waterSprite.y < -padding ||
                waterSprite.y > 600 + padding) {
                waterSprite.destroy();
            }
        });
        
        // Check for M key press to toggle mode
        if (Phaser.Input.Keyboard.JustDown(MKey)) {
            toggleControlMode();
        }
        
        // Handle controls based on current mode
        if (controlMode === 'mouse') {
            handleMouseMode();
        } else {
            handleArrowMode();
        }

        // NEW: Update aiming bar every frame
        updateAimingBar();

        // Fix: Use Phaser.Input.Keyboard.JustDown for single press detection
        if (Phaser.Input.Keyboard.JustDown(this.keyE))
        {
            // Shoot all water sprites in the group that haven't been shot yet
            waterGroup.getChildren().forEach(function(waterSprite) {
                // Only shoot water sprites that haven't been shot yet
                if (!waterSprite.hasBeenShot) {
                    shootWater(waterSprite);
                }
            });
        }

        // Use checkDown for automatic spawning with 100ms delay
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 100)) {
            // Create new water sprite
            var newWater = this.physics.add.sprite(40, 480, 'water');
            newWater.setScale(0.5);
            newWater.setBounce(0.1);
            newWater.setCollideWorldBounds(true);
            newWater.hasBeenShot = false; // Initialize shot tracking
            
            this.physics.add.collider(newWater, platforms);
            waterGroup.add(newWater);
            
            // Immediately shoot the new water sprite toward cursor sprite
            shootWater(newWater);
            
            // Update collision for the new water sprite
            this.physics.add.collider(fireGroup, newWater, function(fireCollide, waterCollide){
                fireCollide.destroy();
                respawnFire(fireCollide);
            }.bind(this));
        }
    }
    
    // NEW: Function to update aiming bar to aim at cursor sprite
    function updateAimingBar() {
        const aimingBar = document.getElementById('aimingBar');
        const angleDisplay = document.getElementById('angleDisplay');
        
        // Bar position (aligned with firetruck)
        const barX = 50; // left position (firetruck position)
        const barY = 600 - 125; // bottom position (aligned with firetruck height)
        
        // Target position (cursor sprite position)
        let targetX = cursor.x;
        let targetY = cursor.y;
        
        // Calculate angle
        const deltaX = targetX - barX;
        const deltaY = targetY - barY;
        
        // Calculate angle in degrees
        const angleRad = Math.atan2(deltaY, deltaX);
        const angleDeg = angleRad * (180 / Math.PI);
        
        // Rotate the bar
        aimingBar.style.transform = `rotate(${angleDeg}deg)`;
        
        // Update display
        
    }
    
    // NEW: Modified shootWater function to use aiming bar angle
    function shootWater(waterSprite){
        // Check if water sprite has already been shot
        if (waterSprite.hasBeenShot) {
            return;
        }
        
        // Get aiming bar position (firetruck position)
        const barX = 50; // left position
        const barY = 600 - 125; // bottom position
        
        // Target position (cursor sprite position)
        let targetX = cursor.x;
        let targetY = cursor.y;
        
        // Calculate direction from firetruck to cursor sprite
        const dx = targetX - barX;
        const dy = targetY - barY;
        
        // Calculate distance
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize direction and apply speed
        const speed = 2000; // Adjust this value as needed
        if (distance > 0) {
            waterSprite.setVelocity(
                (dx / distance) * speed,
                (dy / distance) * speed
            );
            // Mark as shot so it won't be shot again
            waterSprite.hasBeenShot = true;
        }
    }
    
    function respawnFire (fireSprite){
        if (fireGroup.countActive(true) === 0) {
            console.log("All fires extinguished!");
        }
    }
    
    function toggleControlMode()
    {
        if (controlMode === 'mouse') {
            controlMode = 'arrows';
            // Stop cursor movement when switching to arrow mode
            cursor.setVelocity(0, 0);
        } else {
            controlMode = 'mouse';
            // Snap cursor to mouse position when switching to mouse mode
            cursor.x = mouseX;
            cursor.y = mouseY;
            cursor.setVelocity(0, 0);
        }
        updateModeDisplay();
    }
    
    function handleArrowMode()
    {
        // Cursor controlled by arrow keys
        var speed = 200;
        
        // Reset velocity
        cursor.setVelocity(0, 0);
        
        // Apply arrow key movements
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
    
    function updateModeDisplay()
    {
        var display = document.getElementById('modeDisplay');
        var modeText = controlMode === 'mouse' ? 'Mouse Follow' : 'Arrow Keys';
        var color = controlMode === 'mouse' ? '#4CAF50' : '#2196F3';
        
        display.innerHTML = `Mode: <span style="color: ${color}; font-weight: bold;">${modeText}</span><br>Press M to toggle`;
    }
    
    function handleMouseMode()
    {
        // Cursor follows mouse directly
        cursor.x = mouseX;
        cursor.y = mouseY;
        cursor.setVelocity(0, 0); // Ensure no leftover velocity
    }