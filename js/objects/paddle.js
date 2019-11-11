class Paddle extends GameObject {
	constructor() {
		super();	

		this.normalWidth = 80;
		this.maxXSpeed = 5;
		this.width = this.normalWidth;
		this.height = 20;
		this.autoPlay = false;
		this.targetX = 0;
	}

	startMoveRight() {
		this.xSpeed = this.maxXSpeed;
	}
	
	startMoveLeft() {
		this.xSpeed = this.maxXSpeed * -1;
	}

	shrink() {
		this.width = this.normalWidth / 2;
	}
	
	expand() {
		this.width = this.normalWidth * 2;
	}

	recievePowerup(type) {
		if (type === BrickoutPowerup.Types.SHRINK) {
			this.shrink();
		} else {
			this.expand();
		}
	}

	setAutoPlay(autoPlay) {
		this.autoPlay = autoPlay;
	}

	setTargetX(targetX) {
		this.targetX = targetX;
	}
	
	normalSize() {
		this.width = this.normalWidth;
	}

	getMaxXSpeed() {
		return this.maxXSpeed;
	}

	easyMode() {
		this.x = 0;
		this.width = this.gameWidth - 10;
	}

	reset() {
		this.x = this.gameWidth / 2 - this.width / 2;
		this.y = this.gameHeight - this.height;
	}

	moveWithMouse(x) {
		this.x = x - (this.width / 2);
	}

        move() {
                let tempX = this.x + this.xSpeed;

		if (this.autoPlay) {
			// get difference to center of paddle and targetX
			const centerX = this.x + (this.width / 2);
			const offset = centerX - this.targetX;
			const preferSide = Math.ceil(Math.random() * 2);
			
			this.isMoving = true;
			if (offset > 0) {
				tempX = this.x - this.xSpeed;
			} else {
				tempX = this.x + this.xSpeed;
			}
			
			if (preferSide) {
				if (Math.abs(offset) < this.width - 25) {
					this.isMoving = false;
				}
			}
		}			

                if (!this.isMoving) {
                        return;
                }

                if ( 
                        (tempX + this.width) > this.gameWidth ||
                        tempX < 0
                ) {     
                        return;
                }
                
                this.x = tempX;
        }
}
