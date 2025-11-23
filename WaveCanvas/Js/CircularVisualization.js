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
    this.createProperties(0, "ShowGrid");
    this.createProperties(50, "Background");
    this.createProperties(50, "Sensitivity");
    this.createProperties(50, "Intensity");
    this.createProperties(3, "BarLengthScale");

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

      // sensibilidade mapeada para 0.5 a 3
      const sensitivityFactor =
        0.5 + (this.properties.BarLengthScale - 1) * 0.5; //para manter os valores visiveis, vai de 0.5 a 3

      const barScale = 0.5 + (this.properties.BarLengthScale / 100) * 2; //vai de 0.5 a 2

      // calcula o raio do ponto com base no áudio, sensibilidade e barScale
      let amplitude =
        valorAudio *
        this.properties.amplitudeScale *
        this.properties.baseRadius *
        sensitivityFactor;
      amplitude *= barScale;

      const radius = this.properties.baseRadius + amplitude;

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
      let level = this.audioProcessor
        ? this.audioProcessor.calculateAudioLevel()
        : 0.5;

      const boost = 8; // para se ver o vermelho mais facilmente

      level = Math.min(level * boost, 1); // evita passar de 1
      //conversao de nivel para valor de cor
      const hue = 240 - Math.floor(level * 240);
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
