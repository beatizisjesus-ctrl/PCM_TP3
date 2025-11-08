class AudioProcessor {
  constructor(app) {
    this.analyser = null;
    this.mediaStream = null;
    //define que sao arrays do tipo 8 com o tamanho errado, ira ser definido em baixo
    this.frequencyData = new Uint8Array();
    this.waveformData = new Uint8Array();
    this.isPlaying = false;
    this.audioContext = new AudioContext();
    //usar objetos da app
  }

  async startMicrophone() {
    // TODO: iniciar captura do microfone
    console.log("Iniciando captura do microfone...");

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          // Transforma um media stream numa fonte de audio que o programa possa manipular
          const mediaSource = this.audioContext.createMediaStreamSource(stream);
          this.mediaSource = mediaSource;
          this.stream = stream;
          //configurar o analyzer:
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 2048; //define-se o tamanho da janela de análise de frequência.
          //O analyser observa o sinal de audio e fornece métodos para preencher arrays com os dados do áudio no momento atual:
          //frequencyData → armazena intensidade de cada faixa de frequência (espectro).
          //waveformData → armazena valores do sinal de áudio ao longo do tempo (forma da onda).
          this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount); //Cria-se um array de 8 bits (0–255) para armazenar os dados de frequência.
          this.waveformData = new Uint8Array(this.analyser.fftSize); //o mm do de cima, mas para a forma de onda de audio
          // liga a fonte de áudio ao analyser
          mediaSource.connect(this.analyser);
          //destinatin, sai o audio
          this.analyser.connect(this.audioContext.destination);
          this.mediaStream = this.stream;
          this.isPlaying = true;
          //iniciar loop de atualizaçao
          this.update();
          resolve("Microfone capturado com sucesso");
        })
        .catch((error) => {
          reject("Erro ao iniciar o microfone", error);
        });
    });
  }

  async loadAudioFile(file) {
    // TODO: carregar ficheiro de áudio
    console.log("Carregando ficheiro de áudio...");
    // Devolver Promise
  }

  stop() {
    // TODO: parar processamento de áudio
    console.log("Parando processamento de áudio...");
    if (!this.isPlaying) return;

    //Todos os tracks(qu representam dados do microfone) do mediaStream sao parados
    if (this.mediaStream)
      this.mediaStream.getTracks().forEach((track) => track.stop());

    //Desligar todas as conexões de áudio
    try {
      if (this.analyser) {
        this.analyser.disconnect();
      }
      if (this.mediaSource) {
        this.mediaSource.disconnect();
      }
    } catch (e) {
      console.warn("Erro ao desconectar nós de áudio:", e);
    }

    //Suspender o contexto de áudio (para parar o som imediatamente)
    if (this.audioContext && this.audioContext.state === "running") {
      this.audioContext.suspend().then(() => {
        console.log("AudioContext suspenso.");
      });
    }
    // Marca que não está mais a tocar
    this.isPlaying = false;
    this.analyser = null;
    this.mediaSource = null;
    this.mediaStream = null;
    this.frequencyData = new Uint8Array();
    this.waveformData = new Uint8Array();

    console.log("Áudio parado com sucesso.");
  }

  update() {
    if (!this.isPlaying || !this.analyser) return;

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.waveformData);
  }

  //gets:
  getFrequencyData() {
    return this.frequencyData;
  }

  getWaveformData() {
    return this.waveformData;
  }

  calculateAudioLevel() {
    return 0;
  }
}
