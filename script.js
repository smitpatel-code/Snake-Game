const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
const blocks = [];
let snake = [{ x: 1, y: 3 }];
let direction = 'left';
let food = null;
let score = 0;

// Create board blocks
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

// Render snake and food
function render() {
    // Clear board
    for (let key in blocks) {
        blocks[key].classList.remove("fill", "food");
    }

    // Render snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });

    // Render food
    if (food) {
        blocks[`${food.x}-${food.y}`].classList.add("food");
    }
}

// Generate food at random empty location
function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * cols);
    } while (snake.some(seg => seg.x === x && seg.y === y));
    food = { x, y };
}

// Move snake
function moveSnake() {
    let head = null;
    const oldHead = snake[0];

    if (direction === "left") head = { x: oldHead.x, y: oldHead.y - 1 };
    else if (direction === "right") head = { x: oldHead.x, y: oldHead.y + 1 };
    else if (direction === "down") head = { x: oldHead.x + 1, y: oldHead.y };
    else if (direction === "up") head = { x: oldHead.x - 1, y: oldHead.y };

    // Check wall collision
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        alert(`Game Over! Score: ${score}`);
        clearInterval(intervalId);
        return;
    }

    // Check self-collision
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        alert(`Game Over! Score: ${score}`);
        clearInterval(intervalId);
        return;
    }

    snake.unshift(head);

    // Check if food eaten
    if (food && head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop(); // remove tail if no food eaten
    }

    render();
}

// Initial food
generateFood();
render();

// Start game loop
intervalId = setInterval(moveSnake, 400);

// Handle keyboard input
addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    else if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    else if (event.key === "ArrowRight" && direction !== "left") direction = "right";
});
