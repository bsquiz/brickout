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
