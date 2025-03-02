# Setting Up GitHub Repository for Sudoku Variants

This document provides instructions for setting up a GitHub repository for your Sudoku Variants game and deploying it as a GitHub Pages site that you can access from your mobile device.

## Prerequisites

You'll need:
- Git installed on your computer
- A GitHub account
- Xcode Command Line Tools (for macOS)

## Step 1: Install Git and Developer Tools

### On macOS:
If you received a message about missing developer tools, you'll need to install them first:

```bash
# Install Xcode Command Line Tools
xcode-select --install
```

Follow the prompts to complete the installation.

## Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right, then "New repository"
3. Name it "SudokuVariants" 
4. Add a description: "A beautiful Sudoku game with multiple variants and offline capabilities"
5. Choose "Public" if you want anyone to access it
6. Click "Create repository"

## Step 3: Initialize and Push Your Local Repository

Open Terminal and run these commands:

```bash
# Navigate to your project
cd ~/Desktop/Projects/SudokuVariants

# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Sudoku Variants game"

# Connect to your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/SudokuVariants.git

# Push to GitHub
git push -u origin main
```

Note: If the last command gives an error about the branch name, try:
```bash
git push -u origin master
```

## Step 4: Enable GitHub Pages for Hosting

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "main" branch (or "master") and "/" (root) folder
5. Click "Save"
6. GitHub will provide you with a URL like `https://YOUR_USERNAME.github.io/SudokuVariants/`

## Step 5: Access on Mobile

1. Once GitHub Pages is set up, you can access your game from any device using the URL
2. On your mobile device, visit the URL and add it to your home screen:
   - On iOS: tap share icon (box with arrow) and select "Add to Home Screen"
   - On Android: tap menu (three dots) and select "Add to Home Screen"

This will create a PWA-like experience where you can launch the game directly from your home screen and play offline after the initial load.

## Additional Notes

- The first time you visit the page on your mobile device, ensure you're connected to the internet
- After that, the service worker will allow the game to function offline
- Any changes you make to the code will need to be committed and pushed to GitHub, and may take a few minutes to be reflected on the GitHub Pages site