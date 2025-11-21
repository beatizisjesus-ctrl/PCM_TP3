class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";
    // Inicializar propriedades específicas
    this.properties["lineWidth"] = 4;
    this.properties["lineColor"] = "#4cc9f0";
    this.createProperties(50, "Colors");
    this.createProperties(50, "ShowGrid");
    this.createProperties(50, "Background");
    this.createProperties(50, "Sensitivity");
    this.createProperties(50, "Intensity");
  }

  draw() {
    // TODO: Desenhar forma de onda
    this.clearCanvas();
    if (this.properties.Showgrid) {
      this.drawGrid();
    }

    // Implementação básica para teste
    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;
    const sliceWidth = this.canvas.width / data.length;

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height / 2);

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * this.canvas.height) / 2;
      const x = i * sliceWidth;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    if (this.properties.Intensity === true) {
      const v = data[data.length - 1]; // pega último valor do waveform para a cor
      const r = v;
      const g = 50;
      const b = 255 - v;
      this.ctx.strokeStyle = `rgb(${r},${g},${b})`;
    } else {
      this.ctx.strokeStyle = this.getProperties().Colors;
    }

    this.ctx.strokeStyle = this.getProperties().Colors; //liga-se a propriedade à visualização
    this.ctx.lineWidth = this.getProperties().lineWidth;
    this.ctx.stroke();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}
