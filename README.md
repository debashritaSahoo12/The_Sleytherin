# 🐍 The Slytherin - Snake Game

A modern, feature-rich Snake game built with React and Vite, featuring multiple themes, sound effects, leaderboards, and customizable gameplay.

![Snake Game](https://img.shields.io/badge/Game-Snake-green) ![React](https://img.shields.io/badge/React-19.1.1-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.2-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-cyan)

### 🎯 Live Demo ![The_Slytherin 🐍](https://the-slytherin.netlify.app/)

## 🎮 Features

### Core Gameplay
- **Classic Snake Mechanics**: Navigate the snake to eat food and grow longer
- **Multiple Food Types**: 
  - 🍎 Normal Food (+1 point)
  - ⭐ Bonus Food (+5 points, expires in 5 seconds)
  - 💣 Bomb Food (halves your score, expires in 5 seconds)
- **Progressive Difficulty**: 3 difficulty levels with increasing obstacles
- **Collision Detection**: Wall hits, obstacle collisions, and self-collision

### Visual & Audio Experience
- **Customizable Snake Colors**: Color picker for personalized snake appearance
- **Sound Effects**: 
  - Background music (Naagin theme)
  - Eating sounds
  - Game over audio
  - Special food effects
- **Smooth Animations**: Snake eating, growing, and score update animations

### Game Management
- **Player Profiles**: Set and edit player names
- **Leaderboard System**: Track high scores with persistent storage
- **Game Controls**: Arrow keys for movement, spacebar for pause
- **Responsive Design**: Works on desktop and mobile devices

## 🎯 How to Play

1. **Start the Game**: Click "Start" or press any arrow key
2. **Control the Snake**: Use arrow keys (↑↓←→) to move
3. **Eat Food**: Guide your snake to eat food and grow
4. **Avoid Obstacles**: Don't hit walls, obstacles, or your own tail
5. **Special Foods**: 
   - Bonus food gives extra points but expires quickly
   - Bomb food halves your score - avoid if possible!
6. **Restart**: Click "Restart" to start a new game

## 🎨 Customization

### Themes
Choose from 10 different visual themes:
- **Default**: Classic blue theme
- **Garden**: Green nature theme
- **Road**: Gray urban theme
- **Fire**: Red flame theme
- **Neon**: Bright green theme

### Snake Colors
Use the color picker to customize your snake's appearance with any color you prefer.

### Difficulty Levels
- **Easy**: No obstacles
- **Medium**: Some obstacles
- **Hard**: Complex obstacle patterns

## 🏗️ Project Structure

```
my-react-app/
├── public/
│   ├── eat.mp3          # Eating sound effect
│   ├── gameover.mp3     # Game over sound
│   ├── naagin.mp3       # Background music
│   └── snake.svg        # Snake icon
├── src/
│   ├── components/
│   │   ├── Food.jsx     # Food component with different types
│   │   ├── GameBoard.jsx # Main game logic and UI
│   │   ├── Leaderboard.jsx # High scores display
│   │   ├── Snake.jsx    # Snake rendering component
│   │   └── Wall.jsx     # Obstacle component
│   ├── hooks/
│   │   └── useInterval.js # Custom hook for game timing
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── package.json         # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## 🛠️ Technologies Used

- **React 19.1.1**: Modern React with hooks
- **Vite 7.1.2**: Fast build tool and dev server
- **TailwindCSS 4.1.11**: Utility-first CSS framework
- **React Icons 5.5.0**: Icon library
- **Web Audio API**: Custom sound effects
- **LocalStorage**: Persistent leaderboard and settings

## 🎵 Audio Features

The game includes multiple audio elements:
- **Background Music**: Continuous Naagin theme
- **Sound Effects**: 
  - Eating sounds for different food types
  - Game over audio
  - Wall collision sounds
  - Special food effects using Web Audio API

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes

## 🏆 Scoring System

- **Normal Food**: +1 point
- **Bonus Food**: +5 points (expires in 5 seconds)
- **Bomb Food**: Score ÷ 2 (expires in 5 seconds)
- **High Score**: Automatically saved and displayed
- **Leaderboard**: Top scores with player names

### Key Features Implementation

- **Game Loop**: Custom `useInterval` hook for smooth gameplay
- **State Management**: React hooks for game state
- **Theme System**: Dynamic CSS classes and color configurations
- **Audio Management**: Web Audio API for custom sounds
- **Local Storage**: Persistent data for leaderboard and settings

## 🎉 Acknowledgments

- Inspired by the classic Snake game
- Built with modern web technologies
- Features enhanced with creative themes and sound effects

---

**Enjoy playing The Slytherin Snake Game! 🐍✨**
