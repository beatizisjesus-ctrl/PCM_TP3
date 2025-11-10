class ParticleVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Partículas";
    this.particles = [];
    this.lastTime = 0;

    //Inicializar properties
    this.properties = {
      particleCount: 50,
      particleRadius: 2,
      connectionDistance: 100,
    };
    // Inicializar partículas
    this.initParticles();
  }

  draw() {
    // TODO: desenhar partículas
    this.clearCanvas();
    this.drawGrid();
    this.drawParticles();
    this.drawConnections();
  }

  update() {
    // TODO: atualizar partículas
    super.update();
    this.updateParticles();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties(); //na classe mae existe este metodo get.properties que vai buscar as propriedades especificas de cada visualizaçao
  }

  initParticles() {
    // TODO: inicializar partículas
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      });
    }
  }

  updateParticles() {
    // TODO: atualizar estado das partículas
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const audioLevel = this.audioProcessor
      ? this.audioProcessor.calculateAudioLevel()
      : 1.0;

    console.log(audioLevel.toFixed(3));

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Mover partícula
      p.x += p.vx;
      p.y += p.vy;

      // Rebater nas bordas
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Aplicar influência do áudio
      if (data.length > 0) {
        const freqIndex = Math.floor((i / this.particles.length) * data.length);
        const intensity = data[freqIndex] / 255;

        //para tornar mais dinamico, assim ,mm que os valores sejam baixos, deixam de ser
        const freqContribution = intensity * 5; // depende do espectro
        const levelContribution = audioLevel * 10; // volume total
        p.vx += (Math.random() - 0.5) * (freqContribution + levelContribution);
        p.vy += (Math.random() - 0.5) * (freqContribution + levelContribution);

        // Limitar velocidade
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        //mudou-se os valores para aumentar a diferença entre som e sem som
        const maxSpeed = 1 + audioLevel * 10;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
      }
    }
  }

  drawParticles() {
    // TODO: desenhar partículas
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
  }

  drawConnections() {
    // TODO: desenhar conexões entre partículas
    const maxDistance = 100;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(76, 201, 240, ${opacity * 0.5})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }
}
