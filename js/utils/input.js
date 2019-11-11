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
