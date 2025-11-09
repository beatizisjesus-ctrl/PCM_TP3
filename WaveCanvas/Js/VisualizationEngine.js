// Motor de Visualização
class VisualizationEngine {
  constructor(canvasId, audioProcessor) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.visualizations = new Map();
    this.currentVisualization = null;
    this.animationId = null;
    this.isRunning = false;
    this.audioProcessor = audioProcessor;

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

    // Pede que o proximo frame use Animacao, para tornar o loop continuo.
    this.animationId = requestAnimationFrame(() => this.updateLoop());

    //FALTA ATUALIZAR PROPERTIES PANEL

    console.log("Motor de visualização iniciado.");
  }

  updateLoop() {
    if (!this.isRunning) return;
    this.animationId = requestAnimationFrame(() => this.updateLoop());
    this.currentVisualization.update();
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
  }

  resize() {
    // TODO: redimensionar canvas
    if (!this.canvas) return;

    // Ajusta o canvas ao tamanho do container (ou da janela)
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // Se for preiciso redimensionar a visualizaçao atual
    if (this.currentVisualization?.resize) {
      this.currentVisualization.resize(this.canvas.width, this.canvas.height);
    }

    console.log(
      `Canvas redimensionado: ${this.canvas.width}x${this.canvas.height}`
    );
  }

  getVisualizationProperties() {
    // TODO: obter propriedades da visualização atual
    return {};
  }

  updateVisualizationProperty(property, value) {
    // TODO: atualizar propriedade da visualização
    console.log(`Atualizando propriedade: ${property} = ${value}`);
  }
}
