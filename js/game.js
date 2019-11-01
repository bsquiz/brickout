const Brickout = {
	$canvas: null,
	gameWidth: 0,
	gameHeight: 0,
	hudYOffset: 50,
	maxBrickY: 0,
	brickHeight: 20,
	rows: [],
	powerups: [],
	ball: null,
	paddle: null,
	isRunning: false,
	score: 0,
	lives: 3,
	level: 1,
	lastScore: 0,
	lastLives: 3,
	currentHitTestRow: 0,
	clearedRows: 0,
	sine: BAudio.createOscillator(BAudio.Oscillators.SINE),
	square: BAudio.createOscillator(BAudio.Oscillators.SQUARE),
	wallBounceF: 300,
	paddleBounceF: 600,
	brickBounceF: 900,

	looseALife() {
		this.lives--;
		BrickoutGraphics.setLives(this.lives);
		this.resetBall();

		if (this.lives === 0) {
			this.gameOver();
		}
	},

	clearBrick(brick, row, index) {
		const powerup = brick.getPowerup();

		this.score += brick.getPoints(); 
		BrickoutGraphics.setScore(this.score);
		row.removeBrick(index);	
		if (powerup !== null) {
			this.powerups.push(powerup);
	BAudio.playOscillator(this.square, 300);

		window.setTimeout(() => {
			BAudio.playOscillator(this.square, 400);	
		}, 200);

		}
	},

	hitTestBallWithBricks() {
		const row = this.rows[this.currentHitTestRow];
		const bricks = row.getBricks();

		for (let i=0; i<bricks.length; i++) {
			if (this.ball.hitTest(bricks[i])) {
				bricks[i].takeDamage();
			
				this.ball.reflectOffBrick();
				BAudio.playOscillator(this.sine, this.brickBounceF, 25);
				if (bricks[i].getHP() === 0) {
					this.clearBrick(bricks[i], row, i);

					if (row.isCleared()) {
						this.clearedRows++;
						if (this.clearedRows === this.rows.length) {
							this.winLevel();
						}
					}

					break;
				}
			}
		}
	},

	resetBall() {
		this.ball.reset(
			this.paddle.getX() + this.paddle.getWidth() / 2,
			this.paddle.getY() - this.paddle.getHeight()
		);
	},

	hitTestBallWithPlayer() {
		if (this.ball.hitTest(this.paddle)) {
			this.ball.reflectOffPaddle(this.paddle.getX(), this.paddle.getWidth());
			BAudio.playOscillator(this.sine, this.paddleBounceF, 25);

			return;
		}

		if (this.ball.isPastPlayer()) {
			this.looseALife();
			
		}
	},
	
	hudNeedsUpdate() {
		return (this.score !== this.oldScore || 
			this.lives !== this.oldLives);
	},

	rowsNeedUpdate() {
		return this.ball.getY() < this.maxBrickY;
	},

	updateBall() {
		if (!this.ball.getHasLaunched()) {
			this.ball.clingToTarget(
				this.paddle.getX() + this.paddle.getWidth() / 2,
				this.paddle.getY() - this.paddle.getHeight()
			);
		
			if (BrickoutInput.getMouseClicked()) {
				this.ball.launch();
			}
	
			return;
		}

		const bY = this.ball.getY();
		// Gives check a little bit of padding to avoid ball getting
		// stuck in paddle.
		const paddleCheckYThreshold = this.paddle.getY() - 25;

		let currentRowIndex = (bY - this.hudYOffset) / this.brickHeight;
		
		currentRowIndex = parseInt(currentRowIndex);
		currentRowIndex = Math.max(currentRowIndex, 0);

		if (this.ball.move()) {
			// has bounced off wall
			BAudio.playOscillator(this.sine, this.wallBounceF, 25);	
		}

		if (bY < this.maxBrickY) {
			this.currentHitTestRow = currentRowIndex; 
			this.hitTestBallWithBricks();
		} else if (bY >= paddleCheckYThreshold){
			this.hitTestBallWithPlayer();
		}
	},

	updatePowerups() {
		for (let i=0; i<this.powerups.length; i++) {
			const powerup = this.powerups[i];

			powerup.move();

			if (powerup.getY() > this.gameHeight) {
				this.powerups.splice(i, 1);
				continue;
			}
			if (powerup.hitTest(this.paddle)) {
				const type = powerup.getType();

				BAudio.playOscillator(this.square, 300);

		window.setTimeout(() => {
			BAudio.playOscillator(this.square, 400);	
		}, 200);

				if (type === powerup.Types.SHRINK) {
					this.paddle.shrink();
				} else if(type === powerup.Types.EXPAND) {
					this.paddle.expand();
				}
				this.powerups.splice(i, 1);
			}
		}
	},
	
	update() {
		let updateHUD = false;
		let drawStartY = this.hudYOffset;

		if (!this.isRunning) {
			return;
		}

		this.oldScore = this.score;
		this.oldLives = this.lives;

		this.paddle.setTargetX(this.ball.getX());
		this.paddle.moveWithMouse(BrickoutInput.getMouseX());
		this.updateBall();
		this.updatePowerups();

		if (this.hudNeedsUpdate()) {
			drawStartY = 0;
		}

		BrickoutGraphics.draw(
			drawStartY,
			this.gameWidth,
			this.gameHeight
		);
	},

	loadLevel(level = []) {
		this.rows = BrickoutLevels.parseLevel(level, this.hudYOffset);	
		this.maxBrickY = (this.rows.length * this.brickHeight) + this.hudYOffset; 
		this.paddle.reset();
		this.resetBall();
		BrickoutGraphics.setRows(this.rows);
	},

	init() {
		this.$canvas = document.getElementById('canvas');
		this.gameWidth = this.$canvas.width;
		this.gameHeight = this.$canvas.height;
		this.paddle = new Paddle();
		this.ball = new Ball();
		this.paddle.setGameWidth(this.gameWidth);
		this.paddle.setGameHeight(this.gameHeight);
		this.ball.setGameStartY(this.hudYOffset);
		this.ball.setGameWidth(this.gameWidth);
		this.ball.setGameHeight(this.gameHeight);
		BrickoutGraphics.init(
			this.$canvas,
			this.hudYOffset,
			this.paddle,
			this.ball,
			this.powerups
		);
	},

	gameOver() {
		this.stopGame();
		BrickoutGraphics.forceDraw();
		BrickoutGraphics.drawString(
			'game over',
			0,
			this.gameHeight / 2,
			5
		);	
	},

	winGame() {
		this.stopGame();
		BrickoutGraphics.forceDraw();
		BrickoutGraphics.drawString(
			'game win',
			0,
			this.gameHeight / 2,
			5
		);
	},

	nextLevel() {
		this.level++;
		BrickoutGraphics.setLevel(this.level);
		const levelIndex = this.level - 1;
		if (levelIndex > BrickoutLevels.levels.length) {
			this.winGame();
			return;
		}
		this.startGame();
		BrickoutGraphics.forceDraw();
		this.loadLevel(BrickoutLevels.levels[levelIndex]);
	},
	
	winLevel() {
		this.stopGame();
		BrickoutGraphics.forceDraw();
		BrickoutGraphics.drawString(
			'level win',
			0,
			this.gameHeight / 2,
			5
		)
		BAudio.playOscillator(this.square, 300);

		window.setTimeout(() => {
			BAudio.playOscillator(this.square, 400);	
		}, 200);
		window.setTimeout(() => {
			BAudio.playOscillator(this.square, 500);	
		}, 400);

		window.setTimeout(() => this.nextLevel(), 1000);
	},
	
	startGame() {
		this.isRunning = true;
	},
	
	stopGame() {
		this.isRunning = false;
	},
	
	getIsRunning() {
		return this.isRunning;
	}
};
