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
    $("#properties-container-cor").html("");
    $("#properties-container-fundo").html("");
    $("#properties-container-grelha").html("");
    $("#properties-container-sensibilidade").html("");
    $("#properties-container-intensidade").html("");
    $("#properties-container-Radius").html("");
    $("#properties-container-Distance").html("");
    $("#properties-container-Count").html("");
    if (!this.visualizationEngine.currentVisualization) {
      console.warn(
        "Nenhuma visualização ativa — painel de propriedades vazio."
      );
      return;
    }
    //para todas as visualizações
    const grelha = this.createGridPropertyControl("ShowGrid", false);
    $("#properties-container-grelha").append(grelha);
    const Cores = this.createColorPropertyControl("Colors");
    $("#properties-container-cor").append(Cores);
    const coresFundo =
      this.createBackgroundColorPropertyControl("BackgroundColor");
    $("#properties-container-fundo").append(coresFundo);
    const sensibilidade = this.createPropertyControl(
      "Sensitivity",
      50,
      1,
      100,
      1
    );
    $("#properties-container-sensibilidade").append(sensibilidade);
    const intensidade = this.createIntensityPropertyControl("Intensity", false);
    $("#properties-container-intensidade").append(intensidade);
    if (
      this.visualizationEngine.currentVisualization.name === "Forma de Onda"
    ) {
      const line_Width = this.createPropertyControl("lineWidth", 4, 1, 5, 1);
      //const line_Color = this.createPropertyControl("lineColor", 4, 1, 5, 1);
      $("#properties-container").append(line_Width);
    } else if (
      this.visualizationEngine.currentVisualization.name ===
      "Espectro de Frequências"
    ) {
      const bar_WidthScale = this.createPropertyControl(
        "BarWidthScale",
        3,
        1,
        6,
        0.01
      );
      $("#properties-container").append(bar_WidthScale);
    } else if (
      this.visualizationEngine.currentVisualization.name ===
      "Visualização Circular"
    ) {
      const bar_LengthScale = this.createPropertyControl(
        "BarLengthScale",
        3,
        1,
        6,
        0.01
      );
      $("#properties-container").append(bar_LengthScale);
    } else {
      const particle_Radius = this.createPropertyControlParticles(
        "particleRadius",
        5,
        2,
        10,
        1
      );
      const connection_Distance = this.createPropertyControlParticles(
        "connectionDistance",
        100,
        80,
        150,
        20
      );
      const particle_Count = this.createPropertyControlParticles(
        "particleCount",
        50,
        2,
        100,
        5
      );
      $("#properties-container-Radius").append(particle_Radius);
      $("#properties-container-Distance").append(connection_Distance);
      $("#properties-container-Count").append(particle_Count);
      console.log("Atualizando painel de propriedades...");
    }
  }
  //acrescentar as propriedades dos fractais
  updateAudioInfo(info, isError = false) {
    // TODO: atualizar informações de áudio
    const audioStatus = $("#audioStatus");
    const audioLevel = $("#audioLevel");

    if (isError) {
      audioStatus.text(`Erro: ${info}`).css("color", "#f72585");
    } else {
      audioStatus.text(`Áudio: ${info.status || "Ativo"}`);
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

    //Muda o tipo de visualizaçao consoante a escolha do utilizador:
    //envia o que foi escolhido pelo o utilizador para a app
    $("#visualizationType").on("change", (e) => {
      this.app.setVisualization(e.target.value);
      this.updatePropertiesPanel();
    });

    //Exportações
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

  //barWidthSacle e Sensitivity:
  createPropertyControl(property, value, min, max, step) {
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

  //para cor:
  createColorPropertyControl(property) {
    const container = $("<div>").addClass("property-control-cor");

    const label = $("<label>").text(property).attr("for", `prop-${property}`);

    const input = $("<input>")
      .attr("type", "color") //mudou-se range para color para obter o color picker
      .attr("id", `prop-${property}`);

    input.on("input", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        e.target.value
      );
    });

    container.append(label).append(input);

    return container;
  }

  //para mudar a cor do background

  createBackgroundColorPropertyControl(property) {
    // TODO: criar controlo de propriedade
    const container = $("<div>").addClass("property-control-cor");

    const label = $("<label>").text(property).attr("for", `prop-${property}`);

    const input = $("<input>")
      .attr("type", "color") //mudou-se range para color para obter o color picker
      .attr("id", `prop-${property}`);

    input.on("input", (e) => {
      $("#audioCanvas").css("background-color", e.target.value);
      this.visualizationEngine.updateVisualizationProperty(
        property,
        e.target.value
      );
    });

    container.append(label).append(input);

    return container;
  }

  //para grelha
  createGridPropertyControl(property, initialState) {
    // TODO: criar controlo de propriedade
    const container = $("<div>").addClass("property-control-grelha");
    //poe texto no boato e liga-o a um input
    const label = $("<label>").text(property).attr("for", `prop-${property}`);
    const button = $("<button>").text(initialState ? "OFF" : "ON");

    let state = initialState;
    //Com o clique muda de estado
    button.on("click", () => {
      state = !state; // alterna o estado
      button.text(state ? "OFF" : "ON");
      // Atualiza no motor de visualização e agrelha de acordo com o estado do botao
      this.visualizationEngine.currentVisualization.properties.ShowGrid = state;
      this.visualizationEngine.updateVisualizationProperty(property, state);
    });

    container.append(label).append(button);
    return container;
  }

  giveSensitivity() {
    const props = this.visualizationEngine.currentVisualization?.properties;
    if (props && typeof props.Sensitivity !== "undefined") {
      //para verificar se o tipo de valor de sensitivity nao é indefinido
      return Number(props.Sensitivity);
      //Coloca-se Number pq HTML muitas vezes devolve Strings
    }

    //fallback: ler o slider no HTML (se existir)
    const $slider = $("#prop-Sensitivity");
    if ($slider.length) {
      const v = parseFloat($slider.val());
      if (!Number.isNaN(v)) return v;
    }
    //passa o valor do slider para float pq...?

    return 50;
  }

  createIntensityPropertyControl(property, initialState) {
    const container = $("<div>").addClass("property-control-intensidade");
    const label = $("<label>").text(property).attr("for", `prop-${property}`);
    const button = $("<button>").text(initialState ? "OFF" : "ON");

    let state = initialState;
    //Com o clique muda de estado
    button.on("click", () => {
      state = !state; // alterna o estado
      button.text(state ? "OFF" : "ON");
      // Atualiza no motor de visualização e agrelha de acordo com o estado do botao

      this.visualizationEngine.updateVisualizationProperty(property, state);
    });

    container.append(label).append(button);
    return container;
  }

  createPropertyControlParticles(property, value, min, max, step) {
    const container = $("<div>").addClass("property-control-Particles");

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
