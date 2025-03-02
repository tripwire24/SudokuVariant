# Installing Xcode Command Line Tools

Before you can use Git to push your Sudoku Variants game to GitHub, you'll need to install the Xcode Command Line Tools on your Mac. This document provides instructions for doing so.

## Method 1: Using Terminal

The simplest way to install the Command Line Tools is through Terminal:

1. Open Terminal (Applications > Utilities > Terminal)
2. Run the following command:
   ```bash
   xcode-select --install
   ```
3. A dialog box will appear asking if you want to install the tools. Click "Install"
4. Wait for the installation to complete (it may take some time)
5. Verify the installation by running:
   ```bash
   git --version
   ```
   This should display the Git version if installed correctly

## Method 2: Download from Apple Developer Site

If the terminal method doesn't work, you can download the tools directly:

1. Visit [Apple Developer Downloads](https://developer.apple.com/download/all/)
2. Sign in with your Apple ID
3. Find "Command Line Tools for Xcode" for your macOS version
4. Download and install the package
5. Verify the installation as described above

## After Installation

Once you have the Command Line Tools installed, you can follow the instructions in the `GITHUB_SETUP.md` file to create a GitHub repository and push your code to it.

Remember, you only need to install these tools once on your Mac, and they'll be available for all your future development projects.