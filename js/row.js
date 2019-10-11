class Row {
	constructor(bricks, color) {
		this.bricks = bricks;
		this.color = color;
		this.y = 0;
		if (this.bricks.length > 0) {
			this.y = this.bricks[0].getY();
		}
	}

	getBricks() { return this.bricks; }
	getColor() { return this.color; }
	
	removeBrick(index) {
		this.bricks.splice(index, 1);
	}

	isCleared() {
		return this.bricks.length === 0;
	}

	getY() {
		return this.y;
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		for (let i=0; i<this.bricks.length; i++) {
			this.bricks[i].draw(ctx);
		}
		ctx.fill();
	}
}
