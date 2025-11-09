// Visualizações Concretas
class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espectro de Frequências";
    // Inicializar propriedades específicas
  }

  draw() {
    console.log(this.audioProcessor.getFrequencyData());
    // TODO: desenhar espectro de frequências
    this.clearCanvas();

    // Implementação básica para teste
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const barWidth = this.canvas.width / data.length;

    //desenhar cada barra
    for (let i = 0; i < data.length; i++) {
      const scale = 2; //para subir as barras
      const barHeight = (data[i] / 255) * this.canvas.height * scale;
      const x = i * barWidth;
      const y = this.canvas.height - barHeight;

      this.ctx.fillStyle = `hsl(${(i / data.length) * 360}, 100%, 50%)`;
      this.ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  }
  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}
