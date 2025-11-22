class CircularVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Visualização Circular";
    this.properties = {
      baseRadius: 50, // raio base da esfera
      amplitudeScale: 4, // quanto a esfera se expande com o áudio
      waveFrequency: 0.3, // frequência da “onda” da esfera, numero de ondulaçoes ao longo do perimetro
      speed: 0.05, //velocidade do circulo a girar
    };
    this.createProperties("#8000ff", "Colors");
    this.createProperties(false, "ShowGrid");
    this.createProperties(50, "Background");
    this.createProperties(50, "Sensitivity");
    this.createProperties(50, "Intensity");

    this.phase = 0; // fase da animação
  }
  draw() {
    this.clearCanvas();

    if (this.properties.ShowGrid) {
      this.drawGrid();
    }

    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData || Array.from({ length: 256 }, () => Math.random() * 255);

    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const numPoints = 128;

    ctx.beginPath();

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;

      // obtém valor de áudio correspondente
      const audioIndex = Math.floor((i / numPoints) * data.length);
      const valorAudio =
        (data[audioIndex] +
          data[(audioIndex + 1) % data.length] +
          data[(audioIndex - 1 + data.length) % data.length]) /
        3 /
        255;

      // sensibilidade mapeada para 0.5 → 3
      const sensitivityFactor = 0.5 + (this.properties.Sensitivity / 100) * 2.5;

      // calcula o raio do ponto com base no áudio e sensibilidade
      const radius =
        this.properties.baseRadius +
        valorAudio *
          this.properties.amplitudeScale *
          this.properties.baseRadius *
          sensitivityFactor;

      // ondulação dinâmica proporcional ao raio base
      const waveOffset =
        Math.sin(i * this.properties.waveFrequency + this.phase) *
        this.properties.baseRadius *
        0.1;

      const finalRadius = radius + waveOffset;

      const x = centerX + Math.cos(angle) * finalRadius;
      const y = centerY + Math.sin(angle) * finalRadius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();

    // cor dinâmica ou fixa
    if (this.properties.Intensity === true) {
      const level = this.audioProcessor
        ? this.audioProcessor.calculateAudioLevel()
        : 0.5;
      const hue = Math.floor(level * 360);
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    } else {
      ctx.strokeStyle = this.getProperties().Colors;
    }

    ctx.lineWidth = 2;
    ctx.stroke();

    // avança a fase para animar a esfera
    this.phase += this.properties.speed;
  }

  getProperties() {
    return super.getProperties();
  }
}
