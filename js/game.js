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
	sine: null,
	square: null,
	wallBounceF: 300,
	paddleBounceF: 600,
	brickBounceF: 900,
	totalBrickRows: 0,
	audioInitialized: false,
	GameStates: {
		MENU: 0,
		GAME: 1
	},
	gameState: 0,
	
	playAudio(oscillator, freq, duration = 100, vol = 0.1) {
		if (!this.audioInitialized) return;

		BAudio.playOscillator(oscillator, freq, duration, vol);
	},

	looseALife() {
		this.lives--;
		BrickoutGraphics.setLives(this.lives);
		this.resetBall();
		this.paddle.normalSize();

		if (this.lives === 0) {
			this.gameOver();
		} else {
			this.playAudio(this.square, 300);
			window.setTimeout(() => {
				this.playAudio(this.square, 300);
			}, 300);
		}
	},

	clearBrick(brick, row, index) {
		const powerup = brick.getPowerup();

		this.score += brick.getPoints(); 
		BrickoutGraphics.setScore(this.score);
		row.removeBrick(index);	
		if (powerup !== null) {
			this.powerups.push(powerup);
			this.playAudio(this.square, 300);

			window.setTimeout(() => {
				this.playAudio(this.square, 400);	
			}, 200);

		}
	},

	hitTestBallWithBricks() {
		const row = this.rows[this.currentHitTestRow];
		const bricks = row.getBricks();

		for (let i=0; i<bricks.length; i++) {
			if (this.ball.hitTest(bricks[i])) {
				bricks[i].takeDamage();
		
				if (!this.ball.getIsSuperBall()) {	
					this.ball.reflectOffBrick();
				}
				this.playAudio(this.sine, this.brickBounceF, 25);
				if (bricks[i].getHP() === 0) {
					this.clearBrick(bricks[i], row, i);

					if (row.isCleared()) {
						this.clearedRows++;
						if (this.clearedRows === this.totalBrickRows) {
							this.clearedRows = 0;
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
		this.ball.setIsSuperBall(false);
	},

	hitTestBallWithPlayer() {
		if (this.ball.hitTest(this.paddle)) {
			this.ball.reflectOffPaddle(this.paddle.getX(), this.paddle.getWidth());
			this.playAudio(this.sine, this.paddleBounceF, 25);

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
	
			if (BrickoutInput.keyIsDown(BrickoutInput.Keys.SPACE)) {
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
			this.playAudio(this.sine, this.wallBounceF, 25);	
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

				this.playAudio(this.square, 300);

				window.setTimeout(() => {
					this.playAudio(this.square, 400);	
				}, 200);

				switch (type) {
					case powerup.Types.SHRINK:
					this.paddle.shrink();
					break;
				
					case powerup.Types.EXPAND:
					this.paddle.expand();
					break;

					case powerup.Types.SUPERBALL:
					this.ball.setIsSuperBall(true);
					break;

					default: break;
				}

				this.powerups.splice(i, 1);
			}
		}
	},

	movePaddleWithKeys() {
		this.paddle.setIsMoving(false);

		if (BrickoutInput.keyIsDown(BrickoutInput.Keys.LEFT)) {
			this.paddle.startMoveLeft();
			this.paddle.setIsMoving(true);
		} else if (BrickoutInput.keyIsDown(BrickoutInput.Keys.RIGHT)) {
			this.paddle.startMoveRight();
			this.paddle.setIsMoving(true);	
		}
	},
	
	update() {
		let updateHUD = false;
		let drawStartY = this.hudYOffset;

		if (!this.isRunning) {
			return;
		}

		if (this.gameState === this.GameStates.MENU) {
			return;
		}

		this.oldScore = this.score;
		this.oldLives = this.lives;

		this.movePaddleWithKeys();
		this.paddle.move();
		//this.paddle.moveWithMouse(BrickoutInput.getMouseX());
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
		this.totalBrickRows = 0;
		this.rows = BrickoutLevels.parseLevel(level, this.hudYOffset);	
		this.rows.forEach(row => {
			for (let i=0; i<row.bricks.length; i++) {
				if (row.bricks[i] !== ' ') {
					this.totalBrickRows++;

					return;
				}
			}
		});

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
		this.playAudio(this.square, 300);

		window.setTimeout(() => {
			this.playAudio(this.square, 400);	
		}, 200);
		window.setTimeout(() => {
			this.playAudio(this.square, 500);	
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
	},
	
	allowAudio() {
		this.audioInitialized = true;

		if (this.sine === null) {
			this.sine = BAudio.createOscillator(BAudio.Oscillators.SINE);
			this.square = BAudio.createOscillator(BAudio.Oscillators.SQUARE);
			alert('Audio Enabled');
		}
	},
	
	startGameplay() {
		this.gameState = this.GameStates.GAME;
		document.getElementsByClassName('menu')[0].className = 'menu hide';
	}
};
