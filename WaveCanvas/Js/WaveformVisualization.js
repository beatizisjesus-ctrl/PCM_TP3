class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";
    // Inicializar propriedades específicas
    this.properties["lineWidth"] = 4;
    this.createProperties("#4cc9f0", "Colors");
    this.createProperties(0, "ShowGrid");
    this.createProperties(50, "Background");
    this.createProperties(50, "Sensitivity");
    this.createProperties(50, "Intensity");
  }

  draw() {
    // TODO: Desenhar forma de onda
    this.clearCanvas();
    if (this.properties.ShowGrid) {
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
      //calcula-se através damplitude maxima, a amplitude maxima for alta, fica vermlha, se for baixa fica azul
      let maxAmp = 0;

      for (let i = 0; i < data.length; i++) {
        const centered = Math.abs(data[i] - 128); // amplitude absoluta. data[i] para sabermos quanto o sinal se afastou do sinlêncio
        if (centered > maxAmp) {
          maxAmp = centered; //procura-se o máximo
        }
      }

      // normaliza intensidade (0 a 1)
      const intensity = Math.min(maxAmp / 128, 1);

      // aumenta contraste (mais reativo)
      const boosted = Math.pow(intensity, 1.2); //intensity elevado a 1.2

      // converte-se a  intensidade para cor
      const red = Math.floor(boosted * 255); //arredonda para o inteiro mais baixo
      const green = Math.floor((1 - boosted) * 100);
      const blue = Math.floor((1 - boosted) * 255);

      this.ctx.strokeStyle = `rgb(${red},${green},${blue})`;
    } else {
      this.ctx.strokeStyle = this.getProperties().Colors; //liga-se a propriedade à visualização
    }
    this.ctx.lineWidth = this.getProperties().lineWidth;
    this.ctx.stroke();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}
