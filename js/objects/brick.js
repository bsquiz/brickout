class Brick extends GameObject {
	constructor(x, y) {
		super();
		this.width = 50;
		this.height = 20;
		this.hp = 1;
		this.x = x;
		this.y = y;
		this.points = 10;
		this.powerup = null;
	}

	addPowerup(powerup) {
		this.powerup = powerup;
	}

	getPowerup() {
		return this.powerup;
	}
	
	getIsEmpty() {
		return this.isEmpty;
	}

	setPoints(points) {
		this.points = points;
	}

	getPoints() {
		return this.points;
	}

	takeDamage() {
		this.hp--;
	}

	draw(ctx) {
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.width, this.y);
		ctx.lineTo(this.x + this.width, this.y + this.height);
		ctx.lineTo(this.x, this.y + this.height);
		ctx.lineTo(this.x, this.y);
	}

	setHP(hp) {
		this.hp = hp;
	}
	
	getHP() {
		return this.hp;
	}
}
