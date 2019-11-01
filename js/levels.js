const BrickoutLevels = {
	BrickColors: ['white', 'blue', 'yellow', 'orange', 'green', 'red'],
	levels: [
			[
				['x','x','x','x','x','x','x','x','x','x'],
				[' ','x',' ','x',' ','x',' ','x11',' ','x']
			],
			[
				['x','x','x','x','x','x','x','x','x','x'],
				['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']
			],
			[
				['x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2', 'x2'],
				['x', ' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x', ' '],
				[' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x'],
				['x', ' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x', ' '],
				['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'] 
			],
			[
				['x','x','x','x','x','x','x','x','x','x'],
				['x','x','x','x','x','x','x','x','x','x'],
				['x','x','x','x','x','x','x','x','x','x'],
				['x','x','x','x','x','x','x','x','x','x'],
				['x','x','x','x','x','x','x','x','x','x']
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
