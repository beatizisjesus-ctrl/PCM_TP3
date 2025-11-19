class FractalVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.rotation = 0;
    this.baseBranches = 6;
  }

  drawSpiral(x, y, angle, length, depth) {
    if (depth <= 0) return;

    // Calcula próximo ponto
    const x2 = x + length * Math.cos(angle);
    const y2 = y + length * Math.sin(angle);

    this.ctx.strokeStyle = `hsl(${(depth * 20) % 360}, 100%, 50%)`;
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Continua a espiral aumentando o ângulo
    const newLength = length * 0.97; // faz a espiral ir diminuindo o raio
    const newAngle = angle + 0.3; // controla a velocidade de giro

    this.drawSpiral(x2, y2, newAngle, newLength, depth - 1);
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);

    const radius = Math.min(w, h) / 3;
    const depth = 100; // controla o quão longa é a espiral

    this.drawSpiral(centerX, centerY, this.rotation, radius, depth);
  }

  update() {
    if (!this.audioProcessor) return;
    this.audioProcessor.update();

    const level = this.audioProcessor.calculateAudioLevel();
    this.rotation += level * 0.08;

    this.draw();
  }
}
