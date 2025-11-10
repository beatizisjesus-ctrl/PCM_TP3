// Classe Abstrata Base para Visualizações
class AudioVisualization {
  constructor(canvas, audioProcessor) {
    if (this.constructor === AudioVisualization) {
      throw new Error(
        "AudioVisualization é uma classe abstrata e não pode ser instanciada diretamente."
      );
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.audioProcessor = audioProcessor;
    this.name = "Visualização";
    this.properties = {};
    this.testData = new Uint8Array(256);
    this.frameCount = 0;

    // Inicializar dados de teste
    for (let i = 0; i < this.testData.length; i++) {
      this.testData[i] = Math.sin(i / 10) * 128 + 128;
    }
  }

  draw() {
    throw new Error("Método draw() deve ser implementado pela subclasse.");
  }

  update() {
    // TODO: atualizar estado da visualização
    this.draw();
    this.audioProcessor.update();
    this.frameCount++;
  }

  resize(width, height) {
    // TODO: redimensionar visualização
    this.canvas.width = width;
    this.canvas.height = height;
  }

  getProperties() {
    // TODO: obter propriedades da visualização
    return this.properties;
  }

  updateProperty(property, value) {
    // TODO: atualizar propriedade
    //Por exemplo: "lineWidth" e 3. Atualiza o que ja foi defenido de modo a nao criar propriedadees novas por engano.
    if (this.properties.hasOwnProperty(property)) {
      this.properties[property] = value;
    }
  }

  clearCanvas() {
    // TODO: limpar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid() {
    // TODO: desenhar grelha de fundo
    const width = this.canvas.width;
    const height = this.canvas.height;
    const gridSize = 50; // tamanho de cada célula da grelha (podes mudar)

    // Define cor e espessura das linhas
    this.ctx.strokeStyle = "#ccc";
    this.ctx.lineWidth = 0.5;

    this.ctx.beginPath();

    // Linhas verticais
    for (let x = 0; x <= width; x += gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }

    // Linhas horizontais
    for (let y = 0; y <= height; y += gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
    }

    this.ctx.stroke(); // desenha as linhas
    this.ctx.closePath();
  }

  createGradient() {
    // TODO: criar gradiente de cores
    return this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  normalizeData() {
    // TODO: normalizar dados de áudio
    return [];
  }
}
