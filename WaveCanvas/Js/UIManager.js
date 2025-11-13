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
    $("#properties-container").html("");
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
      $("#properties-container").append(line_Width);
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
      $("#properties-container").append(bar_WidthScale);
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
      $("#properties-container").append(particle_Count);
      $("#properties-container").append(particle_Radius);
      $("#properties-container").append(connection_Distance);
    }

    console.log("Atualizando painel de propriedades...");
  }

  updateAudioInfo(info, isError = false) {
    // TODO: atualizar informações de áudio
    const audioStatus = $("#audioStatus");
    const audioLevel = $("#audioLevel");

    if (isError) {
      audioStatus.text(`Erro: ${info}`).css("color", "#f72585");
    } else {
      audioStatus
        .text(`Áudio: ${info.status || "Ativo"}`)
        .css("color", "#e6e6e6");
      audioLevel.text(`Nível: ${info.level || 0}%`);
    }
  }

  setButtonStates(playing) {
    // TODO: atualizar estados dos botões
    const startMicBtn = $("#startMic");
    const stopAudioBtn = $("#stopAudio");

    //o botao start deixa de estar ativo quando se começa
    //o botao stop deixa de estar ativo quando ja se parou, ja nao esta playing
    startMicBtn.prop("disabled", playing);
    stopAudioBtn.prop("disabled", !playing);
  }

  showError(message) {
    // TODO: mostrar mensagem de erro
    const errorModal = $("#errorModal");
    const errorMessage = $("#errorMessage");

    errorMessage.text(message);
    errorModal.removeClass("hidden");

    // Fechar modal ao clicar no X
    $(".close").click(() => {
      errorModal.addClass("hidden");
    });

    // Fechar modal ao clicar fora
    $(window).click((event) => {
      if (event.target === $("#errorModal")[0]) {
        errorModal.addClass("hidden");
      }
    });
  }

  setupEventListeners() {
    // TODO: configurar event listeners
    $("#startMic").on("click", () => {
      this.app.startMicrophone();
    });

    $("#stopAudio").on("click", () => {
      this.app.stopAudio();
    });

    $("#audioFile").on("change", (e) => {
      if (e.target.files.length > 0) {
        this.app.loadAudioFile(e.target.files[0]);
      }
    });

    //muda o tipo de visualizaçao consoante a escolha do utilizador:
    //envia o que foi escolhido pelo o utilizador para a app
    $("#visualizationType").on("change", (e) => {
      this.app.setVisualization(e.target.value);
      this.updatePropertiesPanel();
    });

    $("#exportPNG").on("click", () => {
      this.app.exportManager.exportAsPNG();
    });

    $("#exportJPEG").on("click", () => {
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
    const container = $("<div>").addClass("property-control");

    const label = $("<label>").text(property).attr("for", `prop-${property}`);

    const input = $("<input>")
      .attr("type", "range")
      .attr("id", `prop-${property}`);
    input.attr({
      min: min,
      max: max,
      step: step,
      value: value,
    });

    input.on("input", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        parseFloat(e.target.value)
      );
    });

    container.append(label).append(input);

    return container;
  }
}
