// Motor de Visualização
class VisualizationEngine {
  constructor(canvasId, audioProcessor, app) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.visualizations = new Map();
    this.currentVisualization = null;
    this.animationId = null;
    this.isRunning = false;
    this.audioProcessor = audioProcessor;
    this.app = app;

    // Inicializar visualizações
    this.resize();

    // Adiciona listener da janela
    window.addEventListener("resize", () => this.resize());
    this.initVisualizations();
  }

  initVisualizations() {
    // TODO: inicializar tipos de visualização
    this.visualizations.set(
      "spectrum",
      new SpectrumVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "waveform",
      new WaveformVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "particles",
      new ParticleVisualization(this.canvas, this.audioProcessor)
    );
  }

  setVisualization(type) {
    console.log(`Definindo visualização: ${type}`);
    this.currentVisualization = null;
    const viz = this.visualizations.get(type);
    this.currentVisualization = viz;
    console.log(`Visualização definida: ${type}`);
    return true;
  }

  start() {
    // TODO: iniciar animação
    this.isRunning = true;

    console.log("Iniciando motor de visualização...");
    if (!this.currentVisualization) {
      console.warn("Nenhuma visualização definida!");
      return;
    }

    // Pede que o proximo frame use Animação, para tornar o loop contínuo.
    this.animationId = requestAnimationFrame(() => this.updateLoop());

    console.log("Motor de visualização iniciado.");
  }

  updateLoop() {
    if (!this.isRunning) return;
    this.animationId = requestAnimationFrame(() => this.updateLoop());
    this.currentVisualization.update();
    this.updateUI();
  }

  stop() {
    // TODO: parar animação
    console.log("Parando motor de visualização...");
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    console.log("Motor de visualização parado.");
    this.updateUI();
  }

  updateUI() {
    let info = {
      level: parseInt(
        Math.abs(this.audioProcessor.calculateAudioLevel()) * 100
      ),
      status: this.isRunning ? "Ativo" : "Parado",
    };
    this.app.uiManager.updateAudioInfo(info, false);
  }

  resize() {
    // TODO: redimensionar canvas
    if (!this.canvas) return;

    // Ajusta o canvas ao tamanho do container (ou da janela)
    //Pegando no tamanho real do container (CSS)
    //Copia esse tamanho para a resolução interna do canvas
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // Se for preciso redimensionar a visualizaçao atual, para fazer a atualização
    if (this.currentVisualization?.resize) {
      this.currentVisualization.resize(this.canvas.width, this.canvas.height);
    }

    console.log(
      `Canvas redimensionado: ${this.canvas.width}x${this.canvas.height}`
    );
  }

  getVisualizationProperties() {
    // TODO: obter propriedades da visualização atual

    if (!this.currentVisualization) {
      console.warn("Nenhuma visualização ativa para obter propriedades.");
      return {};
    }
    return this.currentVisualization.getProperties();
  }

  updateVisualizationProperty(property, value) {
    if (!this.currentVisualization) {
      console.warn("Nenhuma visualização ativa para atualizar propriedades.");
      return;
    }

    // Atualiza a propriedade na visualização atual
    this.currentVisualization.updateProperty(property, value);
    console.log(`Atualizando propriedade: ${property} = ${value}`);
  }
}
