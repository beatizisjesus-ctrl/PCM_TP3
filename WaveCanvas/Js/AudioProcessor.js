class AudioProcessor {
  constructor() {
    // Contextos separados
    this.micContext = new AudioContext();
    this.fileContext = new AudioContext();
    this.analyser = null;
    this.mediaStream = null;
    //define que sao arrays do tipo 8 com o tamanho errado, ira ser definido em baixo
    this.frequencyData = new Uint8Array();
    this.waveformData = new Uint8Array();
    this.isPlaying = false;
  }

  async startMicrophone() {
    // TODO: iniciar captura do microfone
    console.log("Iniciando captura do microfone...");

    if (this.micContext.state === "suspended") {
      await this.micContext.resume();
    }

    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          // Transforma um media stream numa fonte de audio que o programa possa manipular
          const mediaSource = this.micContext.createMediaStreamSource(stream);
          this.mediaSourceMicrophone = mediaSource; //microfone
          this.stream = stream;
          //configurar o analyzer:
          this.analyser = this.micContext.createAnalyser();
          this.analyser.fftSize = 2048; //define-se o tamanho da janela de análise de frequência.
          //O analyser observa o sinal de audio e fornece métodos para preencher arrays com os dados do áudio no momento atual:
          //frequencyData → armazena intensidade de cada faixa de frequência (espectro).
          //waveformData → armazena valores do sinal de áudio ao longo do tempo (forma da onda).
          this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount); //Cria-se um array de 8 bits (0–255) para armazenar os dados de frequência.
          this.waveformData = new Uint8Array(this.analyser.fftSize); //o mm do de cima, mas para a forma de onda de audio
          // liga a fonte de áudio ao analyser
          this.mediaSourceMicrophone.connect(this.analyser);
          //destinatin, sai o audio
          this.analyser.connect(this.micContext.destination);
          this.mediaStreamMicrophone = this.stream; //stream do microfone
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
    if (this.fileContext.state === "suspended") {
      await this.fileContext.resume();
    }

    return new Promise((resolve, reject) => {
      file
        .arrayBuffer()
        .then((arrayBuffer) => this.fileContext.decodeAudioData(arrayBuffer)) //decodifica os bytes do ficheiro para um AudioBuffer, que é o formato que o AudioContext consegue reproduzir e processar.
        .then((audioBuffer) => {
          //guardar aduiBuffer decodificado
          this.audioBuffer = audioBuffer;

          // Antes de criar bufferSource
          if (this.mediaSourceBuffer) {
            try {
              this.mediaSourceBuffer.stop();
            } catch (e) {}
            this.mediaSourceBuffer.disconnect();
          }

          // Criar uma fonte de áudio a partir do buffer
          const bufferSource = this.fileContext.createBufferSource();
          bufferSource.buffer = this.audioBuffer; //mantem-se o mm audioBuffer decodificado para se poder reproudzir varios fiecheiros audio, usando o mm buffer
          this.mediaSourceBuffer = bufferSource; //atualiza-se mediaSourceBuffer com uma novo no de sourceBuffer

          // Criar (ou recriar) o analyser
          this.analyser = this.fileContext.createAnalyser();
          this.analyser.fftSize = 2048;
          this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
          this.waveformData = new Uint8Array(this.analyser.fftSize);

          // Conectar a destination(playback)
          bufferSource.connect(this.analyser);
          this.analyser.connect(this.fileContext.destination);

          // Guardar referências
          this.mediaSourceBuffer = bufferSource;
          this.isPlaying = true;

          //quando acabar o audio, para
          this.mediaSourceBuffer.onended = () => {
            console.log("Ficheiro terminou, parando automaticamente...");
            this.stop(); // isso vai parar áudio e visualização
          };
          // Iniciar reprodução
          this.mediaSourceBuffer.start();

          // Atualização contínua (para o visualizador)
          this.update();

          console.log("Ficheiro de áudio a tocar...");
          resolve("Ficheiro carregado com sucesso");
        })
        .catch((error) => {
          reject("Erro ao carregar ficheiro de áudio: " + error);
        });
    });
  }

  stop() {
    // TODO: parar processamento de áudio
    console.log("Parando processamento de áudio...");
    if (!this.isPlaying) return;

    // Parar microfone
    if (this.mediaStreamMicrophone) {
      this.mediaStreamMicrophone.getTracks().forEach((track) => track.stop());
      this.mediaSourceMicrophone?.disconnect();
      this.mediaStreamMicrophone = null;
      this.mediaSourceMicrophone = null;
    }

    // Parar ficheiro de áudio
    if (this.mediaSourceBuffer) {
      try {
        this.mediaSourceBuffer.stop();
      } catch (e) {
        //pode ja estar parado
      }
      this.mediaSourceBuffer.disconnect();
      this.mediaSourceBuffer = null;
    }

    // Desconectar analyser
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    // Suspender AudioContext
    if (this.micContext && this.micContext.state === "running") {
      this.micContext.suspend().then(() => {
        console.log("AudioContext suspenso.");
      });
    }

    this.isPlaying = false;
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
    if (!this.analyser || !this.waveformData.length) return 0;

    // Obter a forma de onda atual (valores 0–255)
    this.analyser.getByteTimeDomainData(this.waveformData);

    // Calcular desvio da média (128 ≈ linha central do sinal)
    let sum = 0;
    for (let i = 0; i < this.waveformData.length; i++) {
      const deviation = this.waveformData[i] - 128;
      sum += deviation * deviation;
    }

    // Média quadrática (RMS)
    const rms = Math.sqrt(sum / this.waveformData.length);

    // Normalizar para 0–1 (128 é amplitude máxima possível)
    const normalizedLevel = rms / 128;

    // Suavizar o resultado (evita saltos bruscos)
    

    return normalizedLevel;
  }
}
