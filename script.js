document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const turnMessage = document.getElementById("turnMessage");
    const winnerMessage = document.getElementById("winnerMessage");
    const restartButton = document.getElementById("restartButton");
    const toggleAIButton = document.getElementById("toggleAIButton");
    let isAITurn = false;
    let isPlayerX = true;
    let isAIEnabled = false;
    let gameActive = true;

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = Array.from(cells).indexOf(cell);

        if (cell.textContent !== "" || !gameActive) {
            return;
        }

        if (isPlayerX) {
            cell.textContent = "X";
            cell.classList.add("x");
        } else {
            cell.textContent = "O";
            cell.classList.add("o");
        }

        checkWinner();
        isPlayerX = !isPlayerX;

        if (gameActive) {
            updateTurnMessage();
            if (isAIEnabled && !isPlayerX) {
                isAITurn = true;
                setTimeout(makeAIMove, 500);
            }
        }
    }

    function makeAIMove() {
        if (!isAITurn) return;

        let availableCells = Array.from(cells).filter(cell => cell.textContent === "");
        if (availableCells.length === 0) return;

        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        randomCell.textContent = "O";
        randomCell.classList.add("o");

        checkWinner();
        isPlayerX = !isPlayerX;
        updateTurnMessage();
        isAITurn = false;
    }

    function checkWinner() {
        let board = Array.from(cells).map(cell => cell.textContent);
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                highlightWinningCells(combination);
                gameActive = false;
                if (isAIEnabled && !isPlayerX) {
                    winnerMessage.textContent = "AI wins!";
                } else {
                    winnerMessage.textContent = `${board[a]} wins!`;
                }
                turnMessage.textContent = ''; // Clear the turn message when the game ends
                return;
            }
        }

        if (board.every(cell => cell !== "")) {
            winnerMessage.textContent = "It's a draw!";
            gameActive = false;
            turnMessage.textContent = ''; // Clear the turn message when the game ends
        }
    }

    function highlightWinningCells(combination) {
        combination.forEach(index => {
            cells[index].classList.add("winning");
        });
    }

    function updateTurnMessage() {
        if (!gameActive) return;
        turnMessage.textContent = `${isPlayerX ? "X" : "O"}'s turn`;
    }

    function restartGame() {
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("x", "o", "winning");
        });
        isPlayerX = true;
        gameActive = true;
        winnerMessage.textContent = "";
        updateTurnMessage();
    }

    function toggleAI() {
        isAIEnabled = !isAIEnabled;
        toggleAIButton.textContent = `AI: ${isAIEnabled ? "ON" : "OFF"}`;
        restartGame();
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    restartButton.addEventListener("click", restartGame);
    toggleAIButton.addEventListener("click", toggleAI);

    updateTurnMessage();
});