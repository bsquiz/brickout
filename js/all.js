const BAudio = {
	ctx: new AudioContext(),
	audioWorkerMode: false,
	Oscillators: {
		SINE: "sine",
		SQUARE: "square",
		TRIANGLE: "triangle",
		SAWTOOTH: "sawtooth"
	},
	createOscillator(type) {
		const ctx = new AudioContext();
		const oscillator = ctx.createOscillator();
		const gain = ctx.createGain();

		oscillator.type = type;
		oscillator.start();
		gain.gain.value = 0;
		oscillator.connect(gain);
		gain.connect(ctx.destination);
		return {
			ctx: ctx,
			oscillator: oscillator,
			gain: gain
		};
	},
	playOscillator(oscillator, frequency = 440, duration = 100, volume = 0.1) {
		
		oscillator.oscillator.frequency.value = frequency;
		oscillator.gain.gain.value = volume;

		window.setTimeout(() => {
			oscillator.gain.gain.value = 0;
		}, duration);
	},
	init() {
		if (this.ctx.audioWorklet) {
			this.ctx.audioWorklet.addModule('whiteNoiseProcessor.js');
			this.whiteNoiseNode = new AudioWorkletNode(this.ctx, 'white-noise-processor');
			this.whiteNoiseNode.connect(this.ctx.destination);
		}
	}
}
const BrickoutFont = {
	characterCols: 5,
	characterPadding: 5,
	sectionWidth: 1,
	sectionHeight: 1,
	characters: {
		' ': [
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' ',
			' ',' ',' ',' ',' '
		],
		'a': [
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*'
		],
		'c': [
			'*','*','*','*','*',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*'
		],
		'e': [
			'*','*','*','*','*',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*'
		],
		'g': [
			'*','*','*','*','*',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*'
		],
		'i': [
			'*','*','*','*','*',
			' ',' ','*',' ',' ',
			' ',' ','*',' ',' ',
			' ',' ','*',' ',' ',
			' ',' ','*',' ',' ',
			' ',' ','*',' ',' ',
			' ',' ','*',' ',' ',
			' ',' ','*',' ',' ',
			' ',' ','*',' ',' ',
			'*','*','*','*','*'
		],
		'l': [
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*'
		],
		'm': [
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*',' ','*','*',
			'*',' ','*',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*'
		],
		'o': [
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*'
		],
		'r': [
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*',
			'*','*',' ',' ',' ',
			'*',' ','*',' ',' ',
			'*',' ',' ','*',' ',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*'
		],
		's': [
			'*','*','*','*','*',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			'*','*','*','*','*'
		],
		'v': [
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			' ','*',' ','*',' ',
			' ','*',' ','*',' ',
			' ',' ','*',' ',' '
		],
		'0': [
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*'
		],
		'1': [
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*'
		],
		'2': [
			'*','*','*','*','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			'*','*','*','*','*',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*'
		],
 		'3': [
			'*','*','*','*','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			'*','*','*','*','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			'*','*','*','*','*'
		],
 		'4': [
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*'
		],
		'5': [
			'*','*','*','*','*',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			'*','*','*','*','*'
		],
		'6': [
			'*','*','*','*','*',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*',' ',' ',' ',' ',
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*'
		],
		'7': [
			'*','*','*','*','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*'
		],
		'8': [
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*'
		],
		'9': [
			'*','*','*','*','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*',' ',' ',' ','*',
			'*','*','*','*','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*',
			' ',' ',' ',' ','*'
		]
	},

	drawString(string, x, y, scale, ctx) {
		const str = string.toString();
		const sW = this.sectionWidth * scale * this.characterCols;
		let drawX = x;
	
		for (let i=0; i<str.length; i++) {
			this.drawCharacter(str[i], drawX, y, scale, ctx);
			drawX += this.sectionWidth * scale * this.characterCols;
			drawX += this.characterPadding;
		}
	},
		
	drawCharacter(character, x, y, scale, ctx) {
		const map = this.characters[character.toString().toLowerCase()];
		const sW = this.sectionWidth * scale;
		const sH = this.sectionHeight * scale;
		let drawX = x;
		let drawY = y;
		let currentCol = 1;	

		if (map) {
			for (let i=0; i<map.length; i++) {
				if (map[i] === '*') {
					ctx.fillRect(drawX, drawY, sW, sH);
				}
				if (currentCol === this.characterCols) {
					// move down one row
					drawY += sH;
					drawX = x;
					currentCol = 1; 
				} else {
					// move across one column
					drawX += sW;
					currentCol++;
				}
			}
		}
	}
};
const BrickoutInput = {
	keysDown: {
		LEFT: false,
		RIGHT: false,
		P: false
	},
        Keys: {
                LEFT: 37,
                RIGHT: 39,
		SPACE: 32,
                P: 80
        },
	KeysByCode: {
		32: 'SPACE',
		37: 'LEFT',
		39: 'RIGHT',
		80: 'P'
	},
	mouse: {
		x: 0,
		y: 0,
		isDown: false,
		clickX: 0,
		clickY: 0,
		clicked: false
	},
	
	getMouseX() {
		return this.mouse.x;
	},
	getMouseClicked() {
		let clicked = false;

		if (this.mouse.clicked) {
			clicked = true;
			this.mouse.clicked = false;
		}

		return clicked;
	},	
	keyIsDown(key) {
		return this.keysDown[key];
	},
	keyExists(keyCode) {
		return this.Keys[keyCode];
	},
	toggleKeyState(keyCode) {
		const key = this.Keys[this.KeysByCode[keyCode]];

		if (!key) {
			return;
		}
	
		this.keysDown[key] = !this.keysDown[key];
	},	
        onKeyDown(e) {
		this.toggleKeyState(e.keyCode);
	},
        onKeyUp(e) {
		this.toggleKeyState(e.keyCode);
	},
	onMouseMove(e) {
		this.mouse.x = e.pageX;
	},
	onClick(e) {
		this.mouse.clickX = e.pageX;
		this.mouse.clickY = e.pageY;
		this.mouse.clicked = true;
	}
};
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
class BrickoutPowerup extends GameObject {
	constructor (type) {
		super();
		
		this.Types = {
			SHRINK: 0,
			EXPAND: 1,
			SUPERBALL: 2
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
const BrickoutLevels = {
	BrickColors: ['white', 'blue', 'red', 'green', 'yellow', 'orange'],
	levels: [
		[
			[' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
			[' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
			['x','x','x','x','x','x','x','x','x','x'],
			['x12', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']
		],[
			['x','x','x','x','x','x','x','x','x','x'],
			[' ','x',' ','x',' ','x',' ','x11',' ','x']
		],[
			[' ',' ',' ',' ','x','x',' ',' ',' ',' '],
			[' ',' ',' ','x','x','x','x',' ',' ',' '],
			[' ',' ','x','x','x','x','x','x',' ',' '],
			[' ','x','x','x','x','x','x11','x','x',' '],
			[' ',' ','x','x','x','x','x','x',' ',' '],
			[' ',' ',' ','x','x','x','x',' ',' ',' '],
			[' ',' ',' ',' ','x','x',' ',' ',' ',' ']
		],[
			[' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
			[' ','x','x',' ',' ',' ',' ','x','x',' '],
			[' ','x','x',' ',' ',' ',' ','x','x',' '],
			[' ','x','x','x',' ',' ','x','x','x',' '],
			[' ',' ','x','x',' ',' ','x','x',' ',' '],
			[' ',' ',' ','x','x','x','x',' ',' ',' '],
			[' ',' ',' ',' ','x','x',' ',' ',' ',' ']
		],[
			['x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2'],
			['x', ' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x', ' '],
			[' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x'],
			['x', ' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x', ' '],
			['x', 'x', 'x', 'x', 'x', 'x11', 'x', 'x', 'x', 'x'] 
		],[
			[' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
			['x','x','x','x','x','x','x','x','x','x'],
			['x','x','x','x','x','x','x','x','x','x'],
			['x','x','x','x','x','x','x','x','x','x'],
			['x','x','x','x','x','x','x','x','x','x']
		],[
			['x',' ','x',' ',' ',' ','x',' ','x',' '],
			[' ','x',' ','x',' ','x',' ','x',' ','x'],
			['x',' ','x',' ','x',' ','x',' ','x',' '],
			[' ','x',' ','x',' ','x',' ','x',' ','x'],
			[' ',' ','x',' ','x',' ','x',' ',' ',' ']
		],[
			['x','x','x','x','x','x','x','x','x','x'],
			['x','x','x','x','x','x','x','x','x','x'],
			['x','x','x','x','x','x','x','x','x','x'],
			['x','x','x','x','x','x','x','x','x','x'],
			['x','x12','x','x','x','x','x','x','x','x']
		],[
			['x',' ','x','x','x',' ',' ','x','x','x'],
			['x',' ','x',' ','x',' ',' ','x',' ',' '],
			['x',' ','x',' ','x',' ',' ','x',' ',' '],
			['x',' ','x',' ','x',' ',' ','x',' ',' '],
			['x',' ','x',' ','x','x','x','x',' ',' ']
		]
	],

	parseLevel(level, yOffset) {
		const rows = [];
		let x = 0;
		let y = yOffset;

		for (let row=0; row<level.length; row++) {
			let bricks = [];

			for (let col = 0; col < level[row].length; col++) {
				const b = level[row][col];

				if (b[0] === 'x') {
					const brick = new Brick(x, y);

					if (b[1]) {
						brick.setHP(parseInt(b[1]));
					}

					if (b[2]) {
						const type = parseInt(b[2]);
						const powerup = new BrickoutPowerup(type);
						powerup.setX(x);
						powerup.setY(y);
						brick.addPowerup(powerup);
					}

					bricks.push(brick);
				}

				x += 50;
			}

			rows.push(new Row(bricks, this.BrickColors[row]));
			x = 0;
			y += 20;
		}

		return rows;
	}
};
const BrickoutHUD = {
	paddingTop: 0,
	paddingLeft: 0,
	textScale: 2,
	livesTextX: 200,
	levelTextX: 350,

	draw(ctx, score, lives, level) {
                BrickoutFont.drawString(
                        `score ${score}`,
                        this.paddingLeft,
                        this.paddingTop,
                        this.textScale,
                        ctx
                );
                BrickoutFont.drawString(
                        `lives ${lives}`,
                        this.paddingLeft + this.livesTextX,
                        this.paddingTop,
                        this.textScale,
                        ctx
                );
		BrickoutFont.drawString(
                        `level ${level}`,
                        this.paddingLeft + this.levelTextX,
                        this.paddingTop,
                        this.textScale,
                        ctx
                );
        }
};
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
