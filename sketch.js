let trator;
let trigo = [];
let obstaculos = [];
let score = 0;
let gameState = "start"; // "start", "playing", "gameOver"
let timePassed = 0;  // Tempo passado desde o início
let obstacleFrequency = 100;  // Frequência inicial dos obstáculos
let trigoFrequency = 60;  // Frequência inicial do trigo

function setup() {
  createCanvas(600, 400);
  trator = new Trator();
  gameState = "start";  // Inicia na tela de início
}

function draw() {
  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "playing") {
    drawPlayingScreen();
  } else if (gameState === "gameOver") {
    drawGameOverScreen();
  }
}

// Tela de início
function drawStartScreen() {
  background(0, 128, 255); // Fundo azul
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Jogo do Trator", width / 2, height / 4);
  textSize(20);
  text("Pressione qualquer tecla para começar", width / 2, height / 2);
}

// Tela de jogo
function drawPlayingScreen() {
  background(255);
  
  // Atualiza e desenha o trator
  trator.update();
  trator.display();

  // Atualiza o tempo do jogo
  timePassed++;

  // Gera trigo aleatoriamente com base na frequência
  if (timePassed % trigoFrequency === 0) {
    trigo.push(new Trigo());
  }

  // Atualiza e desenha o trigo
  for (let i = trigo.length - 1; i >= 0; i--) {
    trigo[i].update();
    trigo[i].display();
    
    // Verifica colisão com o trator
    if (trator.hits(trigo[i])) {
      trigo.splice(i, 1);  // Remove o trigo coletado
      score++;  // Aumenta o score
    }
  }

  // Gera obstáculos aleatoriamente com base na frequência
  if (timePassed % obstacleFrequency === 0) {
    obstaculos.push(new Obstaculo());
  }

  // Atualiza e desenha os obstáculos
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    obstaculos[i].update();
    obstaculos[i].display();
    
    // Verifica colisão com o trator
    if (trator.hits(obstaculos[i])) {
      gameState = "gameOver"; // Muda para a tela de Game Over
    }
    
    // Remove obstáculos que saíram da tela
    if (obstaculos[i].y > height) {
      obstaculos.splice(i, 1);
    }
  }

  // Aumenta a dificuldade ao longo do tempo
  increaseDifficulty();

  // Mostra o score na tela
  fill(0);
  textSize(20);
  text(`Score: ${score}`, 20, 30);
}

// Tela de Game Over
function drawGameOverScreen() {
  background(255, 0, 0); // Fundo vermelho
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 4);
  textSize(20);
  text(`Score Final: ${score}`, width / 2, height / 2);
  text("Pressione R para reiniciar", width / 2, height * 3 / 4);
}

// Função chamada quando uma tecla é pressionada
function keyPressed() {
  if (gameState === "start") {
    gameState = "playing"; // Inicia o jogo
  } else if (gameState === "gameOver" && key === 'r') {
    resetGame(); // Reinicia o jogo
  } else if (gameState === "playing" && key === 'c') {
    trator.changeColor(); // Muda a cor do trator quando C é pressionado
  }
}

// Função para resetar o jogo
function resetGame() {
  score = 0;
  trigo = [];
  obstaculos = [];
  trator = new Trator();
  timePassed = 0;
  obstacleFrequency = 100;
  trigoFrequency = 60;
  gameState = "playing"; // Reinicia o jogo
}

// Função para aumentar a dificuldade ao longo do tempo
function increaseDifficulty() {
  // A cada 10 segundos (600 frames), aumenta a velocidade dos obstáculos e do trigo
  if (timePassed % 600 === 0 && obstacleFrequency > 30) {
    obstacleFrequency -= 5;  // Aumenta a frequência de obstáculos (diminui o tempo entre gerações)
    trigoFrequency -= 2;  // Aumenta a frequência do trigo (diminui o tempo entre gerações)
  }

  // Aumenta a velocidade dos obstáculos
  for (let i = 0; i < obstaculos.length; i++) {
    obstaculos[i].increaseSpeed();
  }

  // Aumenta a velocidade do trigo
  for (let i = 0; i < trigo.length; i++) {
    trigo[i].increaseSpeed();
  }
}

// Classe do Trator
class Trator {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.width = 60;
    this.height = 40;
    this.speed = 5;
    this.color = this.randomColor();
  }
  
  update() {
    if (keyIsDown(LEFT_ARROW) && this.x > 0) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x < width - this.width) {
      this.x += this.speed;
    }
  }

  display() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }

  hits(obj) {
    return (
      this.x < obj.x + obj.size &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.size &&
      this.y + this.height > obj.y
    );
  }

  // Função para mudar a cor do trator aleatoriamente
  changeColor() {
    this.color = this.randomColor();
  }

  // Função para gerar uma cor aleatória
  randomColor() {
    return color(random(255), random(255), random(255));
  }
}

// Classe do Trigo
class Trigo {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 20;
    this.speed = 2;
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      trigo.splice(trigo.indexOf(this), 1); // Remove o trigo que saiu da tela
    }
  }

  display() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }

  // Função para aumentar a velocidade do trigo
  increaseSpeed() {
    this.speed += 0.05;
  }
}

// Classe do Obstáculo
class Obstaculo {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = 30; // Tamanho dos obstáculos
    this.speed = 3; // Velocidade inicial de queda dos obstáculos
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(255, 0, 0); // Cor dos obstáculos (vermelho)
    ellipse(this.x, this.y, this.size, this.size);
  }

  // Função para aumentar a velocidade do obstáculo
  increaseSpeed() {
    this.speed += 0.05;
  }
}
