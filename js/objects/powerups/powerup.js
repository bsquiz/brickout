class BrickoutPowerup extends GameObject {
	constructor (type) {
		super();
		
		this.Types = {
			SHRINK: 0,
			EXPAND: 1
		};

		this.width = 20;
		this.height = 10;
		this.type = type;
		this.ySpeed = 2;
	}

	getType() {
		return this.type;
	}

	move() {
		this.y += this.ySpeed;
	}

	draw(ctx) {
		if (this.type === this.Types.SHRINK) {
			ctx.fillStyle = 'orange';
		} else {
			ctx.fillStype = 'green';
		}
	
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}
