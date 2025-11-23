class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espectro de Frequências";
    // Inicializar propriedades específicas
    this.properties = {
      BarWidthScale: 5,
    };
    this.createProperties("#5164cfff", "Colors");
    this.createProperties(0, "ShowGrid");
    this.createProperties(50, "Background");
    this.createProperties(50, "Sensitivity");
    this.createProperties(50, "Intensity");
  }

  draw() {
    this.clearCanvas();
    if (this.properties.ShowGrid) {
      this.drawGrid();
    }

    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;

    const scale = this.properties.BarWidthScale || 1;

    const barWidth = (this.canvas.width / data.length) * scale;

    for (let i = 0; i < data.length; i++) {
      let barHeight = (data[i] / 255) * this.canvas.height;

      const x = i * barWidth;
      const y = this.canvas.height - barHeight;

      if (this.properties.Intensity === true) {
        //Cor baseada na intensidade do som
        const valorEspetro = data[i]; //vai de 0 a 255, a mm gama do modelo rgb
        const red = valorEspetro;
        const green = 50; //fica fixo
        const blue = 255 - valorEspetro;
        this.ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      } else {
        //Usa o color picker normal
        this.ctx.fillStyle = this.getProperties().Colors;
      }
      this.ctx.fillRect(x, y, barWidth, barHeight);
    }
  }
  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}
