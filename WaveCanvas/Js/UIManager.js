// Gestão de UI
class UIManager {
  constructor(app) {
    this.app = app;
    this.visualizationEngine = app.visualizationEngine;
    this.audioProcessor = app.audioProcessor;
    // Inicializar interface
    this.setupEventListeners();
  }

  updatePropertiesPanel() {
    // TODO: atualizar painel de propriedades
    document.getElementById("properties-container").innerHTML = "";
    if (!this.visualizationEngine.currentVisualization) {
      console.warn(
        "Nenhuma visualização ativa — painel de propriedades vazio."
      );
      return;
    }
    if (
      this.visualizationEngine.currentVisualization.name === "Forma de Onda"
    ) {
      const line_Width = this.createPropertyControl("lineWidth", 4, 1, 5, 1);
      //const line_Color = this.createPropertyControl("lineColor", 4, 1, 5, 1);
      document.getElementById("properties-container").appendChild(line_Width);
      //document.getElementById("properties-container").appendChild(line_Color);
    } else if (
      this.visualizationEngine.currentVisualization.name ===
      "Espectro de Frequências"
    ) {
      const bar_WidthScale = this.createPropertyControl(
        "barWidthScale",
        3,
        1,
        6,
        0.01
      );
      document
        .getElementById("properties-container")
        .appendChild(bar_WidthScale);
    } else {
      // propriedades das particulas
      const particle_Count = this.createPropertyControl(
        "particleCount",
        4,
        1,
        5,
        1
      );
      const particle_Radius = this.createPropertyControl(
        "particleRadius",
        2,
        2,
        6,
        1
      );
      const connection_Distance = this.createPropertyControl(
        "connectionDistance",
        100,
        80,
        150,
        20
      );
      document
        .getElementById("properties-container")
        .appendChild(particle_Count);
      document
        .getElementById("properties-container")
        .appendChild(particle_Radius);
      document
        .getElementById("properties-container")
        .appendChild(connection_Distance);
    }

    console.log("Atualizando painel de propriedades...");
  }

  updateAudioInfo(info, isError = false) {
    // TODO: atualizar informações de áudio
    const audioStatus = document.getElementById("audioStatus");
    const audioLevel = document.getElementById("audioLevel");

    if (isError) {
      audioStatus.textContent = `Erro: ${info}`;
      audioStatus.style.color = "#f72585";
    } else {
      audioStatus.textContent = `Áudio: ${info.status || "Ativo"}`;
      audioStatus.style.color = "#e6e6e6";
      audioLevel.textContent = `Nível: ${info.level || 0}%`;
    }
  }

  setButtonStates(playing) {
    // TODO: atualizar estados dos botões
    const startMicBtn = document.getElementById("startMic");
    const stopAudioBtn = document.getElementById("stopAudio");

    //o botao start deixa de estar ativo quando se começa
    //o botao stop deixa de estar ativo quando ja se parou, ja nao esta playing
    startMicBtn.disabled = playing;
    stopAudioBtn.disabled = !playing;
  }

  showError(message) {
    // TODO: mostrar mensagem de erro
    const errorModal = document.getElementById("errorModal");
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = message;
    errorModal.classList.remove("hidden");

    // Fechar modal ao clicar no X(close representa x no html)
    document.querySelector(".close").onclick = () => {
      errorModal.classList.add("hidden");
    };

    // Fechar modal ao clicar fora
    window.onclick = (event) => {
      if (event.target === errorModal) {
        errorModal.classList.add("hidden");
      }
    };
  }

  setupEventListeners() {
    // TODO: configurar event listeners
    document.getElementById("startMic").addEventListener("click", () => {
      this.app.startMicrophone();
    });

    document.getElementById("stopAudio").addEventListener("click", () => {
      this.app.stopAudio();
    });

    document.getElementById("audioFile").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.app.loadAudioFile(e.target.files[0]);
      }
    });

    //muda o tipo de visualizaçao consoante a escolha do utilizador:
    document
      //envia o que foi escolhido pelo o utilizador para a app
      .getElementById("visualizationType")
      .addEventListener("change", (e) => {
        this.app.setVisualization(e.target.value);
        this.updatePropertiesPanel();
      });

    document.getElementById("exportPNG").addEventListener("click", () => {
      this.app.exportManager.exportAsPNG();
    });

    document.getElementById("exportJPEG").addEventListener("click", () => {
      this.app.exportManager.exportAsJPEG(0.9);
    });
  }

  setupAudioLevels() {
    // TODO: configurar monitorização de níveis de áudio
    const update = () => {
      if (this.audioProcessor.isPlaying) {
        const level = this.audioProcessor.calculateAudioLevel();
        this.updateAudioInfo({
          status: "Ativo",
          level: Math.round(level * 100),
        });
      }
      requestAnimationFrame(update);
    };

    // Iniciar loop de monitorização
    update();
  }

  createPropertyControl(property, value, min, max, step) {
    // TODO: criar controlo de propriedade
    const container = document.createElement("div");
    container.className = "property-control";

    const label = document.createElement("label");
    label.textContent = property;
    label.htmlFor = `prop-${property}`;

    const input = document.createElement("input");
    input.type = "range"; //slider
    input.id = `prop-${property}`;
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;

    input.addEventListener("input", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        parseFloat(e.target.value)
      );
    });

    container.appendChild(label);
    container.appendChild(input);

    return container;
  }
}
