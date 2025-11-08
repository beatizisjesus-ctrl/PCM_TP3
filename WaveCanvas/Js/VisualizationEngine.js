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
    const viz = this.visualizations.get(type);
    //caso haja algum erro
    if (!viz) {
      console.warn(`Visualização "${type}" não encontrada`);
      return false;
    }
    //dizer a visulizaçao
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

    console.log("Motor de visualização iniciado.");
  }

  updateLoop() {
    if (!this.isRunning) return;
    this.animationId = requestAnimationFrame(() => this.updateLoop());
    this.currentVisualization.update();
  }

  stop() {
    //FUNCIONA
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
