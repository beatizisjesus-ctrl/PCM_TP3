# Read me

**Identificação:** Beatriz de Jesus, 52749 e Diana Oliveira, 52651

**Data:** 15/11/2025

## Instruções de instalação e uso

-   Descarregar o ficheiro.
-   Abrir o arquivo `index.html` no navegador.
-   Usar os botões para iniciar o microfone ou carregar um arquivo de
    áudio.
-   Selecionar o tipo de visualização desejado no menu.
-   Ajustar propriedades no painel lateral.
-   Exportar a visualização usando os botões PNG ou JPEG.

## Descrição das funcionalidades implementadas

-   Captura de áudio do microfone.
-   Carregamento e reprodução de arquivos de áudio.
-   Visualizações interativas: Espectro de Frequências, Forma de Onda e
    Partículas.
-   Painel de propriedades para alterar parâmetros das visualizações.
-   Exportação das visualizações em PNG ou JPEG.
-   Feedback em tempo real sobre o estado do áudio (ativo/parado e nível
    de volume).
-   Tratamento de erros com modal de notificação.
-   Responsividade da interface e redimensionamento automático do
    canvas.

## Explicação da arquitetura do projeto

O projeto é estruturado em JavaScript modular, seguindo o paradigma
orientado a objetos. A arquitetura é organizada da seguinte forma:

-   **App.js** -- Classe principal que gere a aplicação, inicializa os
    componentes e coordena o fluxo do áudio e das visualizações.
-   **AudioProcessor.js** -- Classe responsável pelo processamento do
    áudio do microfone e de arquivos. Fornece dados de frequência e
    forma de onda que são essenciais para a implementação das
    visualizações.
-   **AudioVisualization.js** -- Classe abstrata que define a interface
    para todas as visualizações.
-   **SpectrumVisualization.js**, **WaveformVisualization.js**,
    **ParticleVisualization.js** -- Implementações concretas das
    visualizações. São estas as classes que implementam os métodos da
    classe AudioVisualization.
-   **VisualizationEngine.js** -- Engine que coordena a animação e a
    atualização das visualizações no canvas.
-   **UIManager.js** -- Gerencia os elementos da interface, eventos do
    utilizador e atualização de informações. É a única classe que
    instância a app e é a que comunica com o HTML, garantindo interação
    e feedback visual ao utilizador.
-   **ExportManager.js** -- Permite exportar a visualização atual como
    imagem (PNG ou JPEG).
-   **index.html** -- Estrutura HTML da aplicação, incluindo os
    elementos de interação como botões, menus, canvas e painéis.
-   **styles.css** -- Responsável pelo estilo visual da aplicação,
    cores, botões e layout responsivo.

### Fluxo do sistema

1.  App inicializa os componentes principais (AudioProcessor,
    VisualizationEngine, UIManager, ExportManager).
2.  O utilizador inicia a captura de áudio ou carrega um ficheiro áudio.
3.  AudioProcessor processa os dados e atualiza as visualizações.
4.  VisualizationEngine desenha a visualização selecionada no canvas.
5.  UIManager atualiza o painel de propriedades e exibe informações de
    áudio.
6.  ExportManager permite salvar a visualização.

## Tecnologias Utilizadas

-   JavaScript ES6+
-   HTML5
-   CSS3
-   jQuery (para manipulação da UI)
-   Canvas API (para visualizações gráficas)
-   Web Audio API (para captura e processamento de áudio)
