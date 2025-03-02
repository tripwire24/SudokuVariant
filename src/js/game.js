/**
 * Sudoku Game
 * Main game logic that handles user interactions, board state, and game features
 */

class SudokuGame {
  constructor() {
    // Game elements
    this.board = document.getElementById('game-board');
    this.resetBtn = document.getElementById('reset-btn');
    this.newGameBtn = document.getElementById('new-game-btn');
    this.completedCount = document.getElementById('completed-count');
    this.timerDisplay = document.getElementById('timer');
    this.completionModal = document.getElementById('completion-modal');
    this.completionTime = document.getElementById('completion-time');
    this.completionDifficulty = document.getElementById('completion-difficulty');
    this.completionType = document.getElementById('completion-type');
    this.playAgainBtn = document.getElementById('play-again-btn');
    
    // Buttons for game type
    this.btnNumbers = document.getElementById('game-numbers');
    this.btnFaces = document.getElementById('game-faces');
    this.btnFruits = document.getElementById('game-fruits');
    
    // Buttons for difficulty
    this.btnEasy = document.getElementById('difficulty-easy');
    this.btnMedium = document.getElementById('difficulty-medium');
    this.btnHard = document.getElementById('difficulty-hard');
    this.btnExpert = document.getElementById('difficulty-expert');
    
    // Game state
    this.generator = new SudokuGenerator();
    this.currentPuzzle = null;
    this.solution = null;
    this.cells = [];
    this.selectedCell = null;
    this.activeRoller = null;
    this.gameType = 'numbers';
    this.difficulty = 'easy';
    this.timeElapsed = 0;
    this.timerInterval = null;
    this.completed = 0;
    
    // Symbol mappings
    this.symbols = {
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      faces: ['😀', '😎', '🥳', '😍', '🤔', '😮', '🙂', '😆', '🤩'],
      fruits: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🥝', '🍒', '🍐']
    };
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Start with loading count from localStorage
    this.loadState();
    
    // Start a new game
    this.startNewGame();
  }
  
  initEventListeners() {
    // Game type selection
    this.btnNumbers.addEventListener('click', () => this.changeGameType('numbers'));
    this.btnFaces.addEventListener('click', () => this.changeGameType('faces'));
    this.btnFruits.addEventListener('click', () => this.changeGameType('fruits'));
    
    // Difficulty selection
    this.btnEasy.addEventListener('click', () => this.changeDifficulty('easy'));
    this.btnMedium.addEventListener('click', () => this.changeDifficulty('medium'));
    this.btnHard.addEventListener('click', () => this.changeDifficulty('hard'));
    this.btnExpert.addEventListener('click', () => this.changeDifficulty('expert'));
    
    // Game controls
    this.resetBtn.addEventListener('click', () => this.resetBoard());
    this.newGameBtn.addEventListener('click', () => this.startNewGame());
    this.playAgainBtn.addEventListener('click', () => {
      this.completionModal.style.display = 'none';
      this.startNewGame();
    });
    
    // Close roller when clicking outside
    document.addEventListener('click', (e) => {
      if (this.activeRoller && !e.target.closest('.cell-roller') && !e.target.closest('.cell.selected')) {
        this.removeRoller();
      }
    });
  }
  
  createCellRoller(cell) {
    // Remove any existing roller
    this.removeRoller();
    
    // Create the roller container
    const rollerContainer = document.createElement('div');
    rollerContainer.classList.add('cell-roller');
    
    // Create the roller items container
    const rollerItems = document.createElement('div');
    rollerItems.classList.add('roller-items');
    
    // Add symbols to the roller
    const symbols = this.symbols[this.gameType];
    for (let i = 0; i < 9; i++) {
      const item = document.createElement('div');
      item.classList.add('roller-item');
      item.dataset.value = i + 1;
      item.textContent = symbols[i];
      rollerItems.appendChild(item);
    }
    
    // Add roller items to the container
    rollerContainer.appendChild(rollerItems);
    
    // Add the roller to the cell
    cell.appendChild(rollerContainer);
    
    // Set as active roller
    this.activeRoller = {
      container: rollerContainer,
      items: rollerItems,
      cell: cell
    };
    
    // Initialize roller interaction
    this.initRollerInteraction(rollerItems);
    
    // Set initial selection (centered)
    rollerItems.style.transform = 'translateY(0px)';
    this.updateSelectedRollerItem();
    
    // Add tap/click event to select items
    rollerItems.querySelectorAll('.roller-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = parseInt(item.dataset.value);
        const [row, col] = this.getCellPosition(cell);
        this.setCell(row, col, value);
        this.removeRoller();
      });
    });
  }
  
  initRollerInteraction(rollerItems) {
    let startY = 0;
    let currentY = 0;
    let initialTranslate = 0;
    let isTouching = false;
    
    const rollerItemHeight = 30; // Height of each roller item
    
    const touchStart = (e) => {
      isTouching = true;
      startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
      initialTranslate = this.getCurrentTranslate(rollerItems);
      
      // Prevent default scrolling
      e.preventDefault();
      e.stopPropagation();
    };
    
    const touchMove = (e) => {
      if (!isTouching) return;
      
      currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
      const diffY = currentY - startY;
      let newTranslate = initialTranslate + diffY;
      
      // Limit the scroll range
      const maxTranslate = 60; // Allow slight overscroll
      const minTranslate = -((rollerItems.children.length - 1) * rollerItemHeight + 60);
      
      if (newTranslate > maxTranslate) {
        newTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.2; // Resistance at top
      } else if (newTranslate < minTranslate) {
        newTranslate = minTranslate + (newTranslate - minTranslate) * 0.2; // Resistance at bottom
      }
      
      rollerItems.style.transform = `translateY(${newTranslate}px)`;
      this.updateSelectedRollerItem();
      
      // Prevent default scrolling
      e.preventDefault();
      e.stopPropagation();
    };
    
    const touchEnd = (e) => {
      if (!isTouching) return;
      isTouching = false;
      
      const currentTranslate = this.getCurrentTranslate(rollerItems);
      const itemIndex = Math.round(-currentTranslate / rollerItemHeight);
      const snapToTranslate = Math.max(
        Math.min(-itemIndex * rollerItemHeight, 0),
        -((rollerItems.children.length - 1) * rollerItemHeight)
      );
      
      // Snap to closest item
      rollerItems.style.transform = `translateY(${snapToTranslate}px)`;
      rollerItems.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
      
      // Update selected item
      setTimeout(() => {
        rollerItems.style.transition = '';
        this.updateSelectedRollerItem();
      }, 300);
      
      e.stopPropagation();
    };
    
    rollerItems.addEventListener('touchstart', touchStart, { passive: false });
    rollerItems.addEventListener('touchmove', touchMove, { passive: false });
    rollerItems.addEventListener('touchend', touchEnd);
    
    rollerItems.addEventListener('mousedown', touchStart);
    document.addEventListener('mousemove', touchMove);
    document.addEventListener('mouseup', touchEnd);
  }
  
  getCurrentTranslate(element) {
    const style = window.getComputedStyle(element);
    const matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m42; // Y translation
  }
  
  updateSelectedRollerItem() {
    if (!this.activeRoller) return;
    
    const rollerItems = this.activeRoller.items;
    const translate = this.getCurrentTranslate(rollerItems);
    const rollerItemHeight = 30;
    const selectedIndex = Math.round(-translate / rollerItemHeight);
    
    // Remove selected class from all items
    const items = rollerItems.querySelectorAll('.roller-item');
    items.forEach(item => item.classList.remove('selected'));
    
    // Add selected class to current item
    if (items[selectedIndex] && selectedIndex >= 0 && selectedIndex < items.length) {
      items[selectedIndex].classList.add('selected');
    }
  }
  
  removeRoller() {
    if (this.activeRoller) {
      this.activeRoller.container.remove();
      this.activeRoller = null;
    }
  }
  
  generateBoard() {
    this.board.innerHTML = '';
    this.cells = [];
    
    // Generate a new puzzle
    const { puzzle, solution } = this.generator.generatePuzzle(this.difficulty);
    this.currentPuzzle = puzzle;
    this.solution = solution;
    
    // Create cells
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        // Add index as data attributes for easy access
        cell.dataset.row = i;
        cell.dataset.col = j;
        
        // Add initial numbers
        if (puzzle[i][j] !== 0) {
          cell.textContent = this.getSymbol(puzzle[i][j]);
          cell.classList.add('fixed');
        }
        
        // Cell click event listener
        cell.addEventListener('click', () => this.selectCell(cell));
        
        this.board.appendChild(cell);
        this.cells.push(cell);
      }
    }
  }
  
  selectCell(cell) {
    // Don't select fixed cells
    if (cell.classList.contains('fixed')) {
      return;
    }
    
    // If the same cell is clicked and a roller is active, just return
    if (this.selectedCell === cell && this.activeRoller) {
      return;
    }
    
    // Remove highlights from previously selected cells
    this.cells.forEach(c => {
      c.classList.remove('selected', 'highlighted', 'glowing');
    });
    
    // Highlight the selected cell
    cell.classList.add('selected', 'glowing');
    this.selectedCell = cell;
    
    // Highlight same row, column, and box
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    this.highlightRelatedCells(row, col);
    
    // Create roller for the selected cell
    this.createCellRoller(cell);
  }
  
  highlightRelatedCells(row, col) {
    // Highlight row
    for (let i = 0; i < 9; i++) {
      if (i !== col) {
        this.getCellElement(row, i).classList.add('highlighted');
      }
    }
    
    // Highlight column
    for (let i = 0; i < 9; i++) {
      if (i !== row) {
        this.getCellElement(i, col).classList.add('highlighted');
      }
    }
    
    // Highlight 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boxRow + i !== row || boxCol + j !== col) {
          this.getCellElement(boxRow + i, boxCol + j).classList.add('highlighted');
        }
      }
    }
  }
  
  getCellElement(row, col) {
    return this.cells[row * 9 + col];
  }
  
  getCellPosition(cell) {
    return [parseInt(cell.dataset.row), parseInt(cell.dataset.col)];
  }
  
  getSymbol(number) {
    return this.symbols[this.gameType][number - 1];
  }
  
  setCell(row, col, value) {
    const cell = this.getCellElement(row, col);
    
    // Don't modify fixed cells
    if (cell.classList.contains('fixed')) {
      return;
    }
    
    // Update the current puzzle
    this.currentPuzzle[row][col] = value;
    
    // Remove the roller
    this.removeRoller();
    
    // Update the cell display
    cell.textContent = this.getSymbol(value);
    cell.classList.add('inserted');
    
    // Reset animation after it completes
    setTimeout(() => {
      cell.classList.remove('inserted');
    }, 500);
    
    // Check if the value is correct
    const isCorrect = this.generator.checkValue(row, col, value);
    
    // Update cell styling based on correctness
    cell.classList.remove('error');
    if (!isCorrect) {
      cell.classList.add('error');
    }
    
    // Check if the puzzle is complete
    this.checkCompletion();
  }
  
  changeGameType(type) {
    // Update active button styling
    [this.btnNumbers, this.btnFaces, this.btnFruits].forEach(btn => {
      btn.classList.remove('active');
    });
    
    switch (type) {
      case 'numbers':
        this.btnNumbers.classList.add('active');
        break;
      case 'faces':
        this.btnFaces.classList.add('active');
        break;
      case 'fruits':
        this.btnFruits.classList.add('active');
        break;
    }
    
    // Update game type and restart game
    this.gameType = type;
    this.startNewGame();
  }
  
  changeDifficulty(difficulty) {
    // Update active button styling
    [this.btnEasy, this.btnMedium, this.btnHard, this.btnExpert].forEach(btn => {
      btn.classList.remove('active');
    });
    
    switch (difficulty) {
      case 'easy':
        this.btnEasy.classList.add('active');
        break;
      case 'medium':
        this.btnMedium.classList.add('active');
        break;
      case 'hard':
        this.btnHard.classList.add('active');
        break;
      case 'expert':
        this.btnExpert.classList.add('active');
        break;
    }
    
    // Update difficulty and restart game
    this.difficulty = difficulty;
    this.startNewGame();
  }
  
  startNewGame() {
    // Stop previous timer
    this.stopTimer();
    
    // Remove any active roller
    this.removeRoller();
    
    // Generate a new board
    this.generateBoard();
    
    // Reset selected cell
    this.selectedCell = null;
    
    // Start timer
    this.resetTimer();
    this.startTimer();
  }
  
  resetBoard() {
    // Reset to initial state but keep the same puzzle
    this.cells.forEach(cell => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      
      if (!cell.classList.contains('fixed')) {
        cell.textContent = '';
        cell.classList.remove('error');
        this.currentPuzzle[row][col] = 0;
      }
    });
    
    // Reset timer
    this.resetTimer();
    this.startTimer();
    
    // Clear selected cell and remove roller
    if (this.selectedCell) {
      this.selectedCell.classList.remove('selected', 'highlighted', 'glowing');
      this.selectedCell = null;
      
      // Remove all highlights
      this.cells.forEach(cell => {
        cell.classList.remove('highlighted');
      });
    }
    
    this.removeRoller();
  }
  
  checkCompletion() {
    // Check if all cells are filled
    let allFilled = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.currentPuzzle[i][j] === 0) {
          allFilled = false;
          break;
        }
      }
      if (!allFilled) break;
    }
    
    // If all filled, check if solution is correct
    if (allFilled) {
      const isCorrect = this.generator.checkSolution(this.currentPuzzle);
      
      if (isCorrect) {
        this.handleCompletion();
      }
    }
  }
  
  handleCompletion() {
    // Stop timer
    this.stopTimer();
    
    // Increment completed count
    this.completed++;
    this.completedCount.textContent = this.completed;
    
    // Save to localStorage
    this.saveState();
    
    // Play completion animation
    this.playCompletionAnimation();
    
    // Show completion modal
    this.showCompletionModal();
  }
  
  playCompletionAnimation() {
    // Animate each cell sequentially with glow effect
    this.cells.forEach((cell, index) => {
      setTimeout(() => {
        cell.classList.add('correct', 'glowing');
        setTimeout(() => {
          cell.classList.remove('correct', 'glowing');
        }, 500);
      }, index * 20);
    });
    
    // Add confetti effect
    this.createConfetti();
  }
  
  createConfetti() {
    const colors = ['#ff7675', '#6c5ce7', '#00cec9', '#fdcb6e', '#0984e3', '#e84393'];
    const shapes = ['square', 'circle', 'triangle'];
    
    // Remove any existing confetti
    document.querySelectorAll('.confetti').forEach(c => c.remove());
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      // Random shape
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      confetti.classList.add(shape);
      
      // Random color
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      if (shape === 'triangle') {
        confetti.style.borderBottomColor = confetti.style.backgroundColor;
      }
      
      // Random position
      confetti.style.left = `${Math.random() * 100}vw`;
      
      // Random size
      const size = Math.random() * 10 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Random animation delay
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }
  
  showCompletionModal() {
    // Update modal content
    this.completionTime.textContent = this.formatTime(this.timeElapsed);
    this.completionDifficulty.textContent = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
    this.completionType.textContent = this.gameType.charAt(0).toUpperCase() + this.gameType.slice(1);
    
    // Show modal after a short delay
    setTimeout(() => {
      this.completionModal.style.display = 'flex';
    }, 1000);
  }
  
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeElapsed++;
      this.updateTimerDisplay();
    }, 1000);
  }
  
  stopTimer() {
    clearInterval(this.timerInterval);
  }
  
  resetTimer() {
    this.timeElapsed = 0;
    this.updateTimerDisplay();
  }
  
  updateTimerDisplay() {
    this.timerDisplay.textContent = this.formatTime(this.timeElapsed);
  }
  
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  saveState() {
    localStorage.setItem('sudoku-completed', this.completed);
    localStorage.setItem('sudoku-game-type', this.gameType);
    localStorage.setItem('sudoku-difficulty', this.difficulty);
  }
  
  loadState() {
    const savedCompleted = localStorage.getItem('sudoku-completed');
    const savedGameType = localStorage.getItem('sudoku-game-type');
    const savedDifficulty = localStorage.getItem('sudoku-difficulty');
    
    if (savedCompleted) {
      this.completed = parseInt(savedCompleted);
      this.completedCount.textContent = this.completed;
    }
    
    if (savedGameType) {
      this.gameType = savedGameType;
      this.changeGameType(savedGameType);
    }
    
    if (savedDifficulty) {
      this.difficulty = savedDifficulty;
      this.changeDifficulty(savedDifficulty);
    }
  }
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new SudokuGame();
});