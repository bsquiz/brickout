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
