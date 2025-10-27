import { useState, useEffect, useRef } from "react";
import Snake from "./Snake";
import Food, { FOOD_TYPES } from "./Food";
import Leaderboard from "./Leaderboard";
import { useInterval } from "../hooks/useInterval";

// Enhanced theme system with comprehensive styling
const themes = {
  default: "board-theme-default",
  garden: "board-theme-garden",
  road: "board-theme-road",
  space: "board-theme-space",
  cyberpunk: "board-theme-cyberpunk",
  slytherin: "board-theme-slytherin",
  ocean: "board-theme-ocean",
  fire: "board-theme-fire",
  ice: "board-theme-ice",
  neon: "board-theme-neon",
};

// Theme configurations for snake, food, and obstacles
const themeConfigs = {
  default: {
    snake: "#a3e635",
    food: "#f97316",
    obstacle: "#8b5cf6",
    board: "default",
  },
  garden: {
    snake: "#22c55e",
    food: "#facc15",
    obstacle: "#16a34a",
    board: "garden",
  },
  road: {
    snake: "#f59e0b",
    food: "#ef4444",
    obstacle: "#6b7280",
    board: "road",
  },
  space: {
    snake: "#8b5cf6",
    food: "#ec4899",
    obstacle: "#1e40af",
    board: "space",
  },
  cyberpunk: {
    snake: "#00ff88",
    food: "#ff0080",
    obstacle: "#00ffff",
    board: "cyberpunk",
  },
  slytherin: {
    snake: "#10b981",
    food: "#fbbf24",
    obstacle: "#1f2937",
    board: "slytherin",
  },
  ocean: {
    snake: "#06b6d4",
    food: "#f59e0b",
    obstacle: "#0ea5e9",
    board: "ocean",
  },
  fire: {
    snake: "#f97316",
    food: "#eab308",
    obstacle: "#dc2626",
    board: "fire",
  },
  ice: {
    snake: "#38bdf8",
    food: "#a78bfa",
    obstacle: "#60a5fa",
    board: "ice",
  },
  neon: {
    snake: "#00ff41",
    food: "#ff0080",
    obstacle: "#8000ff",
    board: "neon",
  },
};

// Levels hurdles (instead of speed)
const levelHurdles = {
  1: [], // no obstacles
  2: [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ],
  3: [
    { x: 5, y: 5 },
    { x: 6, y: 5 },
    { x: 7, y: 5 },
    { x: 12, y: 15 },
    { x: 13, y: 15 },
    { x: 14, y: 15 },
  ],
  4: [
    ...Array.from({ length: 8 }, (_, i) => ({ x: i + 6, y: 10 })),
    ...Array.from({ length: 8 }, (_, i) => ({ x: 10, y: i + 6 })),
  ],
  5: [
    // Horizontal line with gaps at x=5 and x=15
    ...Array.from({ length: 20 }, (_, i) =>
      i === 5 || i === 15 ? null : { x: i, y: 10 }
    ).filter(Boolean),

    // Vertical line with gaps at y=5 and y=15
    ...Array.from({ length: 20 }, (_, i) =>
      i === 5 || i === 15 ? null : { x: 10, y: i }
    ).filter(Boolean),
  ],
};

export default function GameBoard({ currentTheme, setCurrentTheme }) {
  const boardSize = 20;
  const gridSize = 20;
  const initialSnake = [{ x: 0, y: 0 }]; // snake starts at top-left corner

  const [snake, setSnake] = useState(initialSnake);
  const [hurdles, setHurdles] = useState(levelHurdles[1]);
  const [food, setFood] = useState(
    getRandomFood(initialSnake, levelHurdles[1])
  );
  const [foodType, setFoodType] = useState(FOOD_TYPES.NORMAL);
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const [currentLevel, setCurrentLevel] = useState(1);
  const [snakeColor, setSnakeColor] = useState("#10b981");

  // Animation states
  const [isSnakeEating, setIsSnakeEating] = useState(false);
  const [isSnakeGrowing, setIsSnakeGrowing] = useState(false);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);

  // Get current theme configuration
  const currentThemeConfig = themeConfigs[currentTheme];

  // Helper function to adjust color brightness
  const adjustColor = (hex, percent) => {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    let RR =
      R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
    let GG =
      G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
    let BB =
      B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

    return `#${RR}${GG}${BB}`;
  };

  // 🏆 Leaderboard + High Score
  const [leaderboard, setLeaderboard] = useState([]);
  const [highestScore, setHighestScore] = useState(0);

  // 👤 Player Name + Modal
  const [playerName, setPlayerName] = useState("");
  const [showNameModal, setShowNameModal] = useState(true);
  const [tempName, setTempName] = useState("");
  const [editingName, setEditingName] = useState(false); // NEW: for inline edit
  const [paused, setPaused] = useState(false);
  // 🎉 High score banner (non-blocking)
  const [showHighBanner, setShowHighBanner] = useState(false);

  // Track remaining time for special food (ms)
  const [specialTimeLeft, setSpecialTimeLeft] = useState(null);

  // Timer refs
  const specialTimerRef = useRef(null);
  const specialIntervalRef = useRef(null);

  //music and sound effects
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const eatSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);
  const wallHitSoundRef = useRef(null);
  const bonusSoundRef = useRef(null);
  const bombSoundRef = useRef(null);

  useEffect(() => {
    // Background music
    audioRef.current = new Audio("/naagin.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // Sound effects
    eatSoundRef.current = new Audio("/eat.mp3");
    eatSoundRef.current.volume = 0.5;

    gameOverSoundRef.current = new Audio("/gameover.mp3");
    gameOverSoundRef.current.volume = 0.7;

    // Create additional sound effects using Web Audio API
    wallHitSoundRef.current = createToneSound(200, 0.1, "sawtooth");
    bonusSoundRef.current = createToneSound(800, 0.3, "sine");
    bombSoundRef.current = createToneSound(150, 0.5, "square");

    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (eatSoundRef.current) eatSoundRef.current.pause();
      if (gameOverSoundRef.current) gameOverSoundRef.current.pause();
    };
  }, []);

  // Function to create tone sounds using Web Audio API
  const createToneSound = (frequency, duration, type = "sine") => {
    return () => {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.log("Web Audio API not supported");
      }
    };
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play();
      setMusicPlaying(true);
    }
  };

  // --- Helpers ---
  function getRandomFood(snakeBody, hurdlesList) {
    while (true) {
      const pos = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
      };
      const onSnake = snakeBody?.some((s) => s.x === pos.x && s.y === pos.y);
      const onHurdle = hurdlesList?.some((h) => h.x === pos.x && h.y === pos.y);
      if (!onSnake && !onHurdle) return pos;
    }
  }

  function clearSpecialTimer() {
    if (specialTimerRef.current) {
      clearTimeout(specialTimerRef.current);
      specialTimerRef.current = null;
    }
    if (specialIntervalRef.current) {
      clearInterval(specialIntervalRef.current);
      specialIntervalRef.current = null;
    }
    setSpecialTimeLeft(null);
  }

  function startSpecialExpiryTimer(expiredType) {
    clearSpecialTimer();
    setSpecialTimeLeft(5000); // 5 seconds total

    // Countdown updater
    specialIntervalRef.current = setInterval(() => {
      setSpecialTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 100) return 0;
        return prev - 100;
      });
    }, 100);

    // Expiry action
    specialTimerRef.current = setTimeout(() => {
      const nextType = pickNextTypeDifferentFrom(expiredType);
      spawnFood(nextType);
    }, 5000);
  }

  // 70% normal, 15% bonus, 15% bomb
  function pickWeightedType() {
    const r = Math.random();
    if (r < 0.7) return FOOD_TYPES.NORMAL;
    if (r < 0.85) return FOOD_TYPES.BONUS;
    return FOOD_TYPES.BOMB;
  }

  function pickNextTypeDifferentFrom(prevType) {
    if (prevType === FOOD_TYPES.BONUS || prevType === FOOD_TYPES.BOMB) {
      return FOOD_TYPES.NORMAL;
    }
    return pickWeightedType();
  }

  function spawnFood(type = FOOD_TYPES.NORMAL, nextSnake = snake) {
    const nextPos = getRandomFood(nextSnake, hurdles);
    setFood(nextPos);
    setFoodType(type);

    if (type === FOOD_TYPES.BONUS || type === FOOD_TYPES.BOMB) {
      startSpecialExpiryTimer(type);
    } else {
      clearSpecialTimer();
    }
  }

  function moveSnake() {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    if (direction === "UP") head.y -= 1;
    if (direction === "DOWN") head.y += 1;
    if (direction === "LEFT") head.x -= 1;
    if (direction === "RIGHT") head.x += 1;

    // Wall collision
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= boardSize ||
      head.y >= boardSize
    ) {
      // Play wall hit sound
      if (wallHitSoundRef.current) {
        wallHitSoundRef.current();
      }
      endGame();
      return;
    }

    // Hurdle collision
    if (hurdles.some((h) => h.x === head.x && h.y === head.y)) {
      // Play wall hit sound
      if (wallHitSoundRef.current) {
        wallHitSoundRef.current();
      }
      endGame();
      return;
    }

    // Move head
    newSnake.unshift(head);

    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
      if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
        endGame();
        return;
      }
    }

    const ateFood = head.x === food.x && head.y === food.y;

    if (ateFood) {
      // 🔊 Play appropriate food-eaten sound
      if (foodType === FOOD_TYPES.NORMAL) {
        if (eatSoundRef.current) {
          eatSoundRef.current.currentTime = 0;
          eatSoundRef.current.play();
        }
      } else if (foodType === FOOD_TYPES.BONUS) {
        if (bonusSoundRef.current) {
          bonusSoundRef.current();
        }
      } else if (foodType === FOOD_TYPES.BOMB) {
        if (bombSoundRef.current) {
          bombSoundRef.current();
        }
      }

      // Update score based on food type
      setScore((prev) => {
        const newScore =
          foodType === FOOD_TYPES.NORMAL
            ? prev + 1
            : foodType === FOOD_TYPES.BONUS
            ? prev + 5
            : foodType === FOOD_TYPES.BOMB
            ? Math.floor(prev / 2)
            : prev;

        // Trigger score animation
        setShowScoreAnimation(true);
        setTimeout(() => setShowScoreAnimation(false), 600);

        return newScore;
      });

      // Trigger snake eating animation
      setIsSnakeEating(true);
      setTimeout(() => setIsSnakeEating(false), 400);

      // Trigger snake growing animation
      setIsSnakeGrowing(true);
      setTimeout(() => setIsSnakeGrowing(false), 300);

      // DO NOT unshift again (we already did). Growing = just don't pop the tail.
      // Spawn next food
      clearSpecialTimer();
      const nextType = pickWeightedType();
      spawnFood(nextType, newSnake);
    } else {
      // Normal move: remove tail
      newSnake.pop();
    }
    setSnake(newSnake);
  }
  function endGame() {
    if (gameOverSoundRef.current) {
      gameOverSoundRef.current.currentTime = 0;
      gameOverSoundRef.current.play();
    }
    setGameOver(true);
    setSpeed(null);
    clearSpecialTimer();

    const prevHigh = highestScore;
    const existing = leaderboard.find((p) => p.name === playerName);
    const bestForPlayer = existing ? Math.max(existing.score, score) : score;
    const newHigh = Math.max(prevHigh, bestForPlayer);

    // Update leaderboard
    setLeaderboard((prevLb) => {
      const updated = [...prevLb, { name: playerName || "Player", score }];
      const sorted = updated.sort((a, b) => b.score - a.score);

      // 📝 Save leaderboard in localStorage
      localStorage.setItem("leaderboard", JSON.stringify(sorted));
      return sorted;
    });

    // Update high score
    if (newHigh > prevHigh) {
      setHighestScore(newHigh);
      localStorage.setItem("highestScore", newHigh); // 📝 Save high score
      setShowHighBanner(true);
      setTimeout(() => setShowHighBanner(false), 2500);
    }
  }

  useInterval(moveSnake, paused ? null : speed);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");

      if (e.code === "Space") {
        e.preventDefault(); // prevent page scroll
        setPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, paused]); // ✅ include paused here

  useEffect(() => {
    setHurdles(levelHurdles[currentLevel]);
  }, [currentLevel]);

  useEffect(() => {
    return () => clearSpecialTimer();
  }, []);

  function startNewGame() {
    clearSpecialTimer();
    const freshSnake = [{ x: 0, y: 0 }];
    setSnake(freshSnake);
    setDirection("RIGHT");
    setPaused(false);
    setSpeed(200);
    setGameOver(false);
    setScore(0);
    setHurdles(levelHurdles[currentLevel]);
    spawnFood(FOOD_TYPES.NORMAL, freshSnake);
  }

  const shouldBlink =
    (foodType === FOOD_TYPES.BONUS || foodType === FOOD_TYPES.BOMB) &&
    specialTimeLeft !== null &&
    specialTimeLeft <= 800;

  const foodClass = `food-${currentTheme} ${shouldBlink ? "food-blink" : ""}`;

  // 👤 Name Modal submit
  const handleNameSubmit = (e) => {
    e.preventDefault();
    const trimmed = (tempName || "").trim();
    const finalName = trimmed || "Player";
    setPlayerName(finalName);
    setShowNameModal(false);
    // Auto-start once the name is set, if not running
    if (speed === null || gameOver) startNewGame();
  };

  const handleInlineNameSubmit = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setPlayerName(tempName.trim());
      setEditingName(false);
    }
  };

  // Prevent playing without a name (optional safety)
  useEffect(() => {
    if (!playerName && !showNameModal) setShowNameModal(true);
  }, [playerName, showNameModal]);

  useEffect(() => {
    const savedLeaderboard =
      JSON.parse(localStorage.getItem("leaderboard")) || [];
    const savedHighScore = parseInt(localStorage.getItem("highestScore")) || 0;
    setLeaderboard(savedLeaderboard);
    setHighestScore(savedHighScore);
  }, []);
  return (
    <div className="w-full relative">
      {/* Non-blocking high-score banner */}
      {showHighBanner && (
        <div className="fixed top-2 right-2 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-2 rounded-lg shadow-xl animate-bounce border border-yellow-300">
          <div className="flex items-center gap-1">
            <span className="text-sm">🏆</span>
            <span className="text-xs">New High Score!</span>
          </div>
        </div>
      )}

      {/* Single-Page Layout */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 📍 Top Section - Two Lines */}

        {/* Line 1: Game Title | Score Display | Start Button | Music Toggle */}
        <div className="modern-card">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
            {/* Game Title & Player Name */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐍</span>
                <span className="text-heading font-bold">The Slytherin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-label">👤</span>
                {editingName ? (
                  <form
                    onSubmit={handleInlineNameSubmit}
                    className="flex items-center gap-1"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={handleInlineNameSubmit}
                      className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-label border border-white/30 focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder-white/60 w-24"
                      placeholder="Name"
                    />
                  </form>
                ) : (
                  <span
                    onClick={() => {
                      setEditingName(true);
                      setTempName(playerName);
                    }}
                    className="cursor-pointer hover:text-pink-400 transition-colors duration-300 text-label font-semibold text-white"
                    title="Click to edit name"
                  >
                    {playerName || "Player"}
                  </span>
                )}
              </div>
            </div>

            {/* Score Display */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span
                className={`text-heading font-bold text-white transition-all duration-300 ${
                  showScoreAnimation ? "animate-score-update" : ""
                }`}
              >
                Score:{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {score}
                </span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={startNewGame}
                className="modern-button btn-primary flex items-center gap-2"
              >
                <span className="text-lg">
                  {gameOver || speed === null ? "▶️" : "🔄"}
                </span>
                {gameOver || speed === null ? "Start" : "Restart"}
              </button>
              <button
                onClick={toggleMusic}
                className={`modern-button flex items-center gap-2 ${
                  musicPlaying ? "btn-error" : "btn-success"
                }`}
              >
                <span className="text-lg">{musicPlaying ? "🔇" : "🔊"}</span>
                {musicPlaying ? "Mute" : "Music"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="modern-card">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* Visual Theme Selector */}
            <div className="flex items-center gap-3">
              <span className="text-label font-semibold">🎭 Theme</span>
              <div className="flex gap-2 flex-wrap">
                {[
                  {
                    value: "default",
                    label: "Default",
                    color: "from-blue-800 to-blue-400",
                  },
                  {
                    value: "fire",
                    label: "Fire",
                    color: "from-red-500 to-orange-500",
                  },
                  {
                    value: "garden",
                    label: "Garden",
                    color: "from-green-600 to-lime-600",
                  },
                  {
                    value: "neon",
                    label: "Neon",
                    color: "from-green-800 to-green-500",
                  },
                  {
                    value: "road",
                    label: "Road",
                    color: "from-gray-900 to-gray-400",
                  },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setCurrentTheme(theme.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/10 transition-all duration-200 
              bg-white/5 hover:bg-white/15 hover:scale-105 
              ${
                currentTheme === theme.value
                  ? `bg-gradient-to-r ${theme.color} text-black shadow-md`
                  : "text-white/80"
              }`}
                    title={theme.label}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pill Level Selector */}
            <div className="flex items-center gap-3">
              <span className="text-label font-semibold">🏆 Level</span>
              <div className="flex gap-2">
                {[
                  { value: 1, label: "Easy" },
                  { value: 2, label: "Medium" },
                  { value: 3, label: "Hard" },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setCurrentLevel(level.value)}
                    className={`level-pill ${
                      currentLevel === level.value ? "active" : ""
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Snake Color Picker */}
            <div className="flex items-center gap-3">
              <span className="text-label font-semibold">🎨 Snake Color</span>
              <input
                type="color"
                value={snakeColor}
                onChange={(e) => setSnakeColor(e.target.value)}
                className="color-picker"
                title="Choose snake color"
              />
            </div>
          </div>
        </div>

        {/* 🎮 Middle Section - Game Board & Leaderboard Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board - Takes 3/4 of the space */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="relative animate-fade-in-scale">
              <div
                className={`relative board-theme ${themes[currentTheme]} animate-pulse-glow responsive-board`}
                style={{
                  width: `${boardSize * gridSize}px`,
                  height: `${boardSize * gridSize}px`,
                }}
              >
                {/* Snake */}
                <Snake
                  snakeDots={snake}
                  direction={direction}
                  snakeColor={snakeColor}
                  isEating={isSnakeEating}
                  isGrowing={isSnakeGrowing}
                />

                {/* Food */}
                <Food
                  position={food}
                  type={foodType}
                  extraClass={foodClass}
                  themeColor={currentThemeConfig.food}
                />

                {/* Hurdles */}
                {hurdles.map((h, idx) => (
                  <div
                    key={idx}
                    className="absolute rounded shadow border"
                    style={{
                      left: h.x * gridSize,
                      top: h.y * gridSize,
                      width: gridSize,
                      height: gridSize,
                      background: `linear-gradient(135deg, ${
                        currentThemeConfig.obstacle
                      }, ${adjustColor(currentThemeConfig.obstacle, -20)})`,
                      borderColor: adjustColor(currentThemeConfig.obstacle, 20),
                      boxShadow: `0 0 5px ${currentThemeConfig.obstacle}40, inset 0 1px 2px rgba(255,255,255,0.2)`,
                    }}
                  />
                ))}
              </div>

              {/* Status Messages */}
              {paused && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 rounded-lg">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-4 py-2 rounded-lg text-lg shadow-xl animate-bounce border border-yellow-300">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⏸️</span>
                      <span>PAUSED</span>
                    </div>
                  </div>
                </div>
              )}
              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center   rounded-lg">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-6 py-4 rounded-lg text-lg shadow-xl animate-pulse border border-red-300 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💀</span>
                        <span>GAME OVER!</span>
                      </div>
                      <div className="text-base font-semibold bg-white/20 px-3 py-1 rounded">
                        Your Score: {score}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🏆 Leaderboard - Right Side (1/4 of the space) */}
          <div className="lg:col-span-1">
            <Leaderboard
              leaderboard={leaderboard}
              highestScore={highestScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
