# Sudoku Variants

A beautiful, colorful Sudoku game that can be played offline as a Progressive Web App (PWA). The game features three board variants and four difficulty levels with a sleek, modern UI.

![Sudoku Variants Game](public/screenshot.png)

## Play Online

Visit [https://yourusername.github.io/SudokuVariants](https://yourusername.github.io/SudokuVariants) to play the game online.

## Features

- **Three Game Variants**:
  - Numbers: Traditional Sudoku with numbers 1-9
  - Face Emojis: Sudoku using face emoji characters
  - Fruits: Sudoku using fruit emoji characters

- **Four Difficulty Levels**:
  - Easy: Fewer empty cells for beginners
  - Medium: More empty cells for casual players
  - Hard: Many empty cells for experienced players
  - Expert: Most empty cells for true Sudoku masters

- **Innovative UI**:
  - In-cell roller picker for selecting values (iOS style)
  - Dark theme with vibrant accents and subtle glow effects
  - Responsive design for both desktop and mobile
  - Smooth animations and transitions throughout

- **Game Features**:
  - Automatic validation of inputs
  - Highlighting of related cells for easier play
  - Confetti celebration when completing a puzzle
  - Statistics tracking for completed puzzles
  - Timer to track solving speed

- **PWA Capabilities**:
  - Works offline after first visit
  - Can be installed on home screen
  - Fast loading and smooth performance

## How to Play

1. Select your preferred game variant (Numbers, Faces, or Fruits)
2. Choose your desired difficulty level
3. Tap an empty cell to open the roller picker
4. Roll or tap to select the desired value
5. Complete the entire board according to Sudoku rules:
   - Each row must contain each symbol exactly once
   - Each column must contain each symbol exactly once
   - Each 3×3 box must contain each symbol exactly once

## Installation as PWA

### On Mobile:
1. Open the game in your browser
2. Tap on the Share button (iOS) or Menu button (Android)
3. Select "Add to Home Screen" or "Install App"

### On Desktop:
1. Open the game in Chrome, Edge, or other supporting browser
2. Look for the Install icon in the address bar
3. Click "Install" when prompted

## Development

### Technologies Used
- HTML5, CSS3, and JavaScript (no frameworks)
- CSS Grid and Flexbox for layout
- CSS Variables for theming
- Service Workers for offline capability

### Project Structure
```
/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for offline capability
├── public/                 # Static assets
│   ├── icons/              # App icons for different sizes
│   └── screenshot.png      # Screenshot for README
└── src/
    ├── css/
    │   └── style.css       # Main stylesheet
    └── js/
        ├── game.js         # Main game logic
        └── sudoku-generator.js  # Sudoku puzzle generation
```

### Running Locally
Simply open the `index.html` file in a web browser. No build step or server is required.

## License

This project is open source and available under the MIT License.

## Acknowledgements

- Created by Luke Gray
- Fonts: Poppins from Google Fonts
- Color palette inspired by the Dracula theme