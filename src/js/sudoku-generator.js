/**
 * Sudoku Generator and Solver
 * This file handles the creation of valid Sudoku puzzles and solving them
 */

class SudokuGenerator {
  constructor() {
    this.grid = Array(9).fill().map(() => Array(9).fill(0));
    this.solvedGrid = [];
  }

  /**
   * Check if number can be placed in cell
   */
  isValid(row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (this.grid[row][x] === num) {
        return false;
      }
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (this.grid[x][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Fill the diagonal boxes of the Sudoku grid
   */
  fillDiagonal() {
    for (let i = 0; i < 9; i += 3) {
      this.fillBox(i, i);
    }
  }

  /**
   * Fill a 3x3 box with random numbers
   */
  fillBox(row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = Math.floor(Math.random() * 9) + 1;
        } while (!this.isValid(row + i, col + j, num));

        this.grid[row + i][col + j] = num;
      }
    }
  }

  /**
   * Solve the Sudoku grid using backtracking
   */
  solveSudoku() {
    let emptyCell = this.findEmptyCell();
    if (!emptyCell) {
      return true; // Puzzle solved
    }

    let [row, col] = emptyCell;

    // Try each number 1-9
    for (let num = 1; num <= 9; num++) {
      if (this.isValid(row, col, num)) {
        this.grid[row][col] = num;

        if (this.solveSudoku()) {
          return true;
        }

        this.grid[row][col] = 0; // Backtrack
      }
    }

    return false; // Trigger backtracking
  }

  /**
   * Find an empty cell (with value 0)
   */
  findEmptyCell() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.grid[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null; // No empty cells
  }

  /**
   * Generate a full Sudoku grid
   */
  generateFullGrid() {
    // Start with empty grid
    this.grid = Array(9).fill().map(() => Array(9).fill(0));
    
    // Fill diagonal boxes
    this.fillDiagonal();
    
    // Fill the rest using backtracking
    this.solveSudoku();
    
    // Create a deep copy of the solved grid
    this.solvedGrid = JSON.parse(JSON.stringify(this.grid));
    
    return this.grid;
  }

  /**
   * Remove numbers to create a puzzle with a specified difficulty
   */
  generatePuzzle(difficulty) {
    // Generate full grid first
    this.generateFullGrid();
    
    // Determine how many cells to remove based on difficulty
    let cellsToRemove;
    switch (difficulty) {
      case 'easy':
        cellsToRemove = 35; // 46 cells filled
        break;
      case 'medium':
        cellsToRemove = 45; // 36 cells filled
        break;
      case 'hard':
        cellsToRemove = 52; // 29 cells filled
        break;
      case 'expert':
        cellsToRemove = 59; // 22 cells filled
        break;
      default:
        cellsToRemove = 35;
    }
    
    // Create a copy of the full grid
    let puzzle = JSON.parse(JSON.stringify(this.grid));
    let positions = [];
    
    // Create an array of all positions
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }
    
    // Shuffle positions to remove numbers randomly
    positions = this.shuffleArray(positions);
    
    // Remove numbers
    for (let i = 0; i < cellsToRemove; i++) {
      if (i < positions.length) {
        let [row, col] = positions[i];
        puzzle[row][col] = 0;
      }
    }
    
    return {
      puzzle: puzzle,
      solution: this.solvedGrid
    };
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Verify if a solution is correct
   */
  checkSolution(grid) {
    // Check if all cells match the solved grid
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== this.solvedGrid[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check if value at position is correct according to solution
   */
  checkValue(row, col, value) {
    return this.solvedGrid[row][col] === value;
  }
}