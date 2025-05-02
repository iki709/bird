const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions to match the device screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load bird image
const birdImage = new Image();
birdImage.src = "images-removebg-preview (1).png"; // Replace with the actual path to your bird image

// Load two pipe images
const upperPipeImage = new Image();
upperPipeImage.src = "Ner.pipe.png"; // Load the Ner.pipe image for upper pipe

const lowerPipeImage = new Image();
lowerPipeImage.src = "Upp.pipe.png"; // Load the Upp.pipe image for lower pipe

// Initialize gap sizes
const gapSize = Math.random() * (200 - 150) + 150;

const bird = {
  x: 50,
  y: canvas.height / 2 - 25, // Adjust the position for better alignment
  width: 35, // Adjust the bird's width based on your image size
  height: 35, // Adjust the bird's height based on your image size
  velocity: 0,
  gravity: 0.6,
  jumpStrength: 9,
};

let pipes = [];

let score = 0;
let isGameOver = false;
let isGameStarted = false; // Add this variable to track whether the game has started

// Create a function to show the game menu
function showGameMenu() {
  const gameMenu = document.getElementById("gameMenu");
  gameMenu.style.display = "block";
}

// Create a function to hide the game menu
function hideGameMenu() {
  const gameMenu = document.getElementById("gameMenu");
  gameMenu.style.display = "none";
}

// Create a function to reset the game
function resetGame() {
  isGameOver = false;
  score = 0;
  pipes = [];
  bird.y = canvas.height / 2 - 25;
  hideGameMenu(); // Hide the game menu
  update(); // Start a new game
}

// Add an event listener to the "Play" button
const playButton = document.getElementById("playButton");
playButton.addEventListener("click", () => {
  resetGame(); // Reset the game and start a new one
});

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score;

  // Apply a different color to create an animation effect
  scoreElement.style.color = "#ff5733"; // Change to a different color

  // Trigger the animation by adding a class temporarily
  scoreElement.classList.add("animate-score");

  setTimeout(() => {
    scoreElement.style.color = "#333"; // Restore the original color
    scoreElement.classList.remove("animate-score"); // Remove the animation class
  }, 300); // Change the color back and remove the animation class after 300 milliseconds (adjust for desired animation duration)
}

function createPipe() {
  const pipeHeight = Math.random() * (canvas.height - gapSize);
  const newPipe = {
    x: canvas.width,
    upperPipeHeight: pipeHeight,
    lowerPipeHeight: canvas.height - (pipeHeight + gapSize),
    speed: 3,
    hasPassed: false, // Track if the bird has passed this pipe
  };
  pipes.push(newPipe);
}

function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipe() {
  for (const pipe of pipes) {
    // Draw upper pipe first (at the top)
    ctx.drawImage(upperPipeImage, pipe.x, 0, upperPipeImage.width, pipe.upperPipeHeight);

    // Draw lower pipe (at the bottom)
    const lowerPipeY = pipe.upperPipeHeight + gapSize;
    ctx.drawImage(lowerPipeImage, pipe.x, lowerPipeY, lowerPipeImage.width, pipe.lowerPipeHeight);
  }
}

function collisionDetection() {
  for (const pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x && bird.x < pipe.x + upperPipeImage.width &&
      (bird.y < pipe.upperPipeHeight || bird.y + bird.height > pipe.upperPipeHeight + gapSize)
    ) {
      isGameOver = true;
    }
  }
}

function update() {
  if (isGameStarted && !isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    for (const pipe of pipes) {
      pipe.x -= pipe.speed;

      if (!pipe.hasPassed && bird.x > pipe.x + upperPipeImage.width) {
        // Bird has successfully passed the pipe
        pipe.hasPassed = true; // Update the flag
        score++; // Increment the score
        updateScore(); // Update the score display
      }
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
      createPipe();
    }

    if (pipes.length > 0 && pipes[0].x + upperPipeImage.width < 0) {
      pipes.shift();
    }

    drawPipe();
    drawBird();
    collisionDetection();
    requestAnimationFrame(update);
  } else {
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", canvas.width / 1.8 - 150, canvas.height / 2.2);
    showGameMenu(); // Display the game menu
  }

}

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 32 && !isGameOver) {
    if (!isGameStarted) {
      isGameStarted = true; // Start the game on the first jump
      update(); // Start the game loop
    }
    bird.velocity = -bird.jumpStrength;
  }
});

canvas.addEventListener("touchstart", () => {
  if (!isGameOver) {
    if (!isGameStarted) {
      isGameStarted = true; // Start the game on the first touch
      update(); // Start the game loop
    }
    bird.velocity = -bird.jumpStrength;
  }
});

canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
});

// Initialize the game with the first pipe
createPipe();
