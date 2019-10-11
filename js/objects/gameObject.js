class GameObject {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 50;
		this.height = 50;
		this.xSpeed = 5;
		this.ySpeed = 5;
		this.isMoving = false;
		this.gameWidth = 0;
		this.gameHeight = 0;
		this.gameYStart = 0;
	}

	setGameYStart(y) {
		this.gameYStart = y;
	}

	setXSpeed(val) {
		this.xSpeed = val;
	}

	setYSpeed(val) {
		this.ySpeed = val;
	}

	getXSpeed() {
		return this.xSpeed;
	}
	
	getYSpeed() {
		return this.ySpeed;
	}

	setIsMoving(isMoving) {
		this.isMoving = isMoving;
	}

	setGameWidth(width) {
		this.gameWidth = width;
	}

	setGameHeight(height) {
		this.gameHeight = height;
	}
	
	getX() {
		return this.x;
	}
	
	getY() {
		return this.y;
	}

	setX(x) {
		this.x = x;
	}

	setY(y) {
		this.y = y;
	}

	getWidth() {
		return this.width;
	}
	
	getHeight() {
		return this.height;
	}

	reflectDX() {
		this.dx *= -1;
	}

	reflectDY() {
		this.dy *= -1;
	}

	reset() {}

	hitTest(testObject) {
		// check intersection with center of object
		let checkX = this.x + (this.width / 2);
		let checkY = this.y + (this.height / 2);

		// Check intersection in place where object will be,
		// this is to avoid object getting stuck in a hitTest
		// loop inside of the other object.
		checkX += this.xSpeed;
		checkY += this.ySpeed;

		if (
			checkX >= testObject.x &&
			checkX < (testObject.x + testObject.width) &&
			checkY > testObject.y &&
			checkY < (testObject.y + testObject.height)
		) {
			return true;
		} 

		return false;
	}

	move() {}
	
	draw(ctx) {
		ctx.fillRect(this.x, this.y, this.width, this.height);	
	}
}
