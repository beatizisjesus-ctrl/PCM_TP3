class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espectro de Frequências";
    // Inicializar propriedades específicas
    this.properties = {
      barWidthScale: 5,
    };
    this.createProperties("#ff0000", "Colors");
    this.createProperties(50, "showGrid");
    this.createProperties(50, "Background");
    this.createProperties(50, "Sensitivity");
  }

  draw() {
    this.clearCanvas();

    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;

    const scale = this.properties.barWidthScale || 1;
    // this.properties.Sensitivity || 50;

    const barWidth = (this.canvas.width / data.length) * scale;

    for (let i = 0; i < data.length; i++) {
      let barHeight = (data[i] / 255) * this.canvas.height;

      const x = i * barWidth;
      const y = this.canvas.height - barHeight;

      this.ctx.fillStyle = this.getProperties().Colors;
      this.ctx.fillRect(x, y, barWidth, barHeight);
    }
  }
  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}
