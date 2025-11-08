// Classe principal da aplicação
class App {
  constructor() {
    this.uiManager = new UIManager(this); //para o uimanager saber que app existe e tbm usar os objetos daqui
    this.audioProcessor = new AudioProcessor(this);
    this.visualizationEngine = new VisualizationEngine(
      "audioCanvas",
      this.audioProcessor
    );
    this.exportManager = new ExportManager(this.visualizationEngine);
    this.setVisualization("spectrum"); //para começar
    // Inicialização
    this.init();
  }

  init() {
    // TODO: inicializar a aplicação
    console.log("App inicializada");
  }

  startMicrophone() {
    // TODO: iniciar captura do microfone
    //maneira de se lidar com a promise
    this.audioProcessor
      .startMicrophone()
      .then((stream) => {
        this.uiManager.setButtonStates(true);
        this.visualizationEngine.start();
        console.log("Iniciando microfone...");
      })
      .catch((error) => {
        this.uiManager.showError(error);
        this.uiManager.setButtonStates(false);
      });
  }

  loadAudioFile(file) {
    // TODO: carregar ficheiro de áudio
    console.log("Carregando ficheiro de áudio...");
  }

  stopAudio() {
    // TODO: parar áudio
    console.log("Parando áudio...");
    this.audioProcessor.stop(); //para o processamento e audio
    this.visualizationEngine.stop(); //para o desnho
    this.uiManager.setButtonStates(false); //desativa o stop e ativa o start microfone
  }

  setVisualization(type) {
    // TODO: definir tipo de visualização
    //envia-se a escolha do utilizador para o Vis.Engine
    this.visualizationEngine.setVisualization(type);
    console.log(`Definindo visualização: ${type}`);
  }

  exportFrame() {
    // TODO: exportar frame atual
    console.log("Exportando frame...");
  }

  destroy() {
    // TODO: limpar recursos
    console.log("Destruindo aplicação...");
  }
}

// Inicialização da aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();

  // Expor app globalmente para debugging (remover em produção)
  window.app = app;
});
