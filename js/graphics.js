const BrickoutGraphics = {
	ctx: null,
	ball: null,
	paddle: null,
	rows: [],
	powerups: [],
	hudYOffset: 0,
	lives: 0,
	level: 1,
	score: 0,

	setPowerup(powerups) {
		this.powerups = powerups;
	},
	
	setRows(rows) {
		this.rows = rows;
	},
	
	setLives(lives) {
		this.lives = lives;
	},

	setLevel(level) {
		this.level = level;
	},
	
	setScore(score) {
		this.score = score;
	},

        draw(drawStartY, width, height) {
                this.ctx.clearRect(0, drawStartY, width, height);
                this.paddle.draw(this.ctx);
                this.ball.draw(this.ctx);

                for (let i=0; i<this.powerups.length; i++) {
                        this.powerups[i].draw(this.ctx);
                }

                for (let i=0; i<this.rows.length; i++) {
                        this.rows[i].draw(this.ctx);
                }

		if (drawStartY < this.hudYOffset) {
			BrickoutHUD.draw(this.ctx, this.score, this.lives, this.level);
		}
        },

        forceDraw() {
                this.draw(0, true);
        },

	drawString(string, x, y, size) {
		BrickoutFont.drawString(string, x, y, size, this.ctx);
	},
	
	init(canvas, hudYOffset, paddle, ball, powerups) {
		this.ctx = canvas.getContext('2d');
		this.ctx.strokeStyle = 'white';
		this.ctx.fillStyle = 'white';
		this.hudYOffset = hudYOffset;
		this.paddle = paddle;
		this.ball = ball;
		this.powerups = powerups;
	}
};
