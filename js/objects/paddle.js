class Paddle extends GameObject {
	constructor() {
		super();	

		this.normalWidth = 80;
		this.maxXSpeed = 5;
		this.width = this.normalWidth;
		this.height = 20;
		this.autoPlay = false;
		this.targetX = 0;
		this.isShrunk = false;
		this.isExpanded = false;
	}

	shrink() {
		if (this.isExpanded) {
			this.normalSize();
			
			return;
		}

		if (!this.isShrunk) {
			this.width = this.normalWidth / 2;
			this.isShrunk = true;
		}
	}
	
	expand() {
		if (this.isShrunk) {
			this.normalSize();
			
			return;
		}

		if (!this.isExpanded) {
			this.width = this.normalWidth * 2;
			this.isExpanded = true;
		}
	}
	
	normalSize() {
		this.width = this.normalWidth;
		this.isShrunk = false;
		this.isExpanded = false;
	}

	setAutoPlay(autoPlay) {
		this.autoPlay = autoPlay;
	}

	setTargetX(targetX) {
		this.targetX = targetX;
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
		this.normalSize();
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
