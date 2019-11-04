class Ball extends GameObject {
	constructor() {
		super();
		this.width = 10;
		this.height = 10;
		this.gameStartY = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.maxXSpeed = 4;
		this.maxYSpeed = 4;
		this.hasLaunched = false;
		this.isSuperBall = false;
	}

	reset() {
		this.isSuperBall = false;
	}

	setIsSuperBall(superball) {
		this.isSuperBall = superball;
	}
	
	getIsSuperBall() { return this.isSuperBall; }

	setGameStartY(y) {
		this.gameStartY = y;
	}

	getHasLaunched() {
		return this.hasLaunched;
	}

	clingToTarget(x, y) {
		this.x = x;
		this.y = y;
	}

	launch() {
		this.ySpeed = this.maxYSpeed * -1;
		this.hasLaunched = true;
	}

	move() {
		let reflected = false;

		if (!this.hasLaunched) {
			this.x = this.targetX;

			return reflected;
		}
			
		if (this.x > this.gameWidth || this.x < 0) {
			this.xSpeed *= -1;
			reflected = true;
		}
		if (this.y < this.gameStartY) {
			this.ySpeed *= -1;
			reflected = true;
		}

		this.x += this.xSpeed;
		this.y += this.ySpeed;

		return reflected;
	}
	
	reset(x, y) {
		this.x = x;
		this.y = y;
		this.xSpeed = 0;
		this.hasLaunched = false;
	}

	isOutOfBounds() {
		if (
			this.x < 0 ||
			this.x > this.gameWidth ||
			this.y < this.gameStartY 
		) {
			return true;
		}

		return false;
	}

	isPastPlayer() {
		if (this.y > this.gameHeight) {
			return true;
		}

		return false;
	}


	reflectOffBrick() {
		this.ySpeed *= -1;
	}

	reflectOffPaddle(paddleX, paddleWidth) {
		/*
			xSpeed = (
				(paddleWidth / 2 + paddleX - sx) /
				(paddleWidth / 2)
				* maxXSpeed
			) * -1
		*/
		const halfWidth = paddleWidth / 2;
		const strikeCenterOffset = halfWidth + paddleX - this.x;
		const angleSeverity = strikeCenterOffset / halfWidth;
		if (this.xSpeed === 0) {
			this.xSpeed = 1;
		}
		this.xSpeed = angleSeverity * this.maxXSpeed;
		this.xSpeed *= -1;
		this.ySpeed *= -1;
	}
}
