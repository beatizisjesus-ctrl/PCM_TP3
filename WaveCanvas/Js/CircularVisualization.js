class CircularVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Visualização Circular";

    this.baseRadius = 50; // raio base da esfera
    this.amplitudeScale = 4; // quanto a esfera se expande com o áudio
    this.waveFrequency = 0.3; // frequência da “onda” da esfera, numero de ondulaçoes ao longo do perimetro
    this.createProperties("#8000ff", "Colors");
    this.createProperties(0, "ShowGrid");
    this.createProperties(50, "Background");
    this.createProperties(50, "Sensitivity");
    this.createProperties(50, "Intensity");
    this.createProperties(3, "BarLengthScale");
    this.createProperties(0.01, "Speed");

    this.phase = 0; // fase da animação
  }
  draw() {
    this.clearCanvas();

    if (this.properties.ShowGrid) {
      this.drawGrid();
    }

    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;

    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const numPoints = 128;

    ctx.beginPath();

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;

      // obtém valor de áudio correspondente:
      //Temos 128 pontos no circulo mas 256 valores de áudio — então é preciso espalhar os valores uniformemente ao longo do círculo.
      //Logo temos que ligar os 128 pontos aos 256 valores de áudio. Tansformamos um indice de 128 pontos para um indice
      //de 256.
      const audioIndex = Math.floor((i / numPoints) * data.length);
      /*Evita picos e deixa suave*/
      const valorAudio =
        (data[audioIndex] +
          data[(audioIndex + 1) % data.length] + //se for para o index 256 , a seguir volta para o index 0
          data[(audioIndex - 1 + data.length) % data.length]) /
        3 /
        255;

      // divide-se por 3 para nao ficar muito grande
      const BarLengthScaleFactor = this.getProperties().BarLengthScale / 3;
      //0.5 + (this.getProperties().BarLengthScale - 1) * 0.5;

      // calcula o raio do ponto com base no áudio, sensibilidade e barScale
      let amplitude =
        valorAudio *
        this.amplitudeScale *
        this.baseRadius *
        BarLengthScaleFactor;

      const radius = this.baseRadius + amplitude;

      // ondulação dinâmica proporcional ao raio base
      const waveOffset =
        Math.sin(i * this.waveFrequency + this.phase) * this.baseRadius * 0.1;

      const finalRadius = radius + waveOffset;

      const x = centerX + Math.cos(angle + this.phase) * finalRadius;
      const y = centerY + Math.sin(angle + this.phase) * finalRadius;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();

    // cor dinâmica ou fixa
    if (this.getProperties().Intensity === true) {
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

    // avança a fase para girar a esfera
    this.phase += this.getProperties().Speed;
  }

  getProperties() {
    return super.getProperties();
  }
}
