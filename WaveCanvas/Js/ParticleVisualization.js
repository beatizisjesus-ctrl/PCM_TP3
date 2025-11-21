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
    this.createProperties(50, "Colors");
    this.createProperties(50, "ShowGrid");
    this.createProperties(50, "Background");
    this.createProperties(50, "Sensitivity");
    this.createProperties(50, "Intensity");
    
    // Inicializar particles
    this.initParticles();
  }

  draw() {
    // TODO: desenhar partículas
    this.clearCanvas();
    this.drawParticles();
    this.drawConnections();
    if (this.properties.Showgrid) {
      this.drawGrid();
    }
  }

  //este uptade é chamado no VisualizationEngine
  update() {
    // TODO: atualizar partículas
    super.update();
    this.updateParticleCount();
    this.updateParticles();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties(); //na classe mãe existe este metodo get.properties que vai buscar as propriedades específicas de cada visualização
  }

  initParticles() {
    // TODO: inicializar partículas
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: this.getProperties().particleRadius || 2,
        color: `hsl(${this.getProperties().Colors}, 100%, 50%)`, //liga-se a propriedade à visualização
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
      p.radius = this.getProperties().particleRadius; //liga às propriedades
      p.color = this.getProperties().Colors;

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

        //para tornar mais dinamico, assim ,mesmo que os valores sejam baixos, deixam de ser
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
    const maxDistance = this.properties.connectionDistance || 100; //esta ligado ao slider das properties

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

  updateParticleCount() {
    const desiredCount = this.properties.particleCount; //liga às propriedades
    const currentCount = this.particles.length;

    // Obtemos a diferença dos valores, e essa diferença vai ser o numero de particulas qu evao ser desenhadas
    if (desiredCount > currentCount) {
      const toAdd = desiredCount - currentCount;
      for (let i = 0; i < toAdd; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: this.properties.particleRadius,
          color: this.properties.Colors,
        });
      }
    } else if (desiredCount < currentCount) {
      this.particles.splice(desiredCount); // remove tudo a partir de desired count
    }
  }
}
