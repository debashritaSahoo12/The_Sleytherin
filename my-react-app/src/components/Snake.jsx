import { GiSnakeBite } from "react-icons/gi";

export default function Snake({
  snakeDots,
  direction,
  snakeColor = "#a3e635",
  isEating = false,
  isGrowing = false,
}) {
  const gridSize = 20;

  // Determines the rotation angle for the snake's head based on its direction
  const getHeadRotation = () => {
    switch (direction) {
      case "UP":
        return "-90deg";
      case "DOWN":
        return "90deg";
      case "LEFT":
        return "180deg";
      case "RIGHT":
        return "0deg";
      default:
        return "0deg"; // Default orientation
    }
  };
  const getBodyGradient = (color) => {
    // Enhanced 3D gradient effect with multiple layers
    const lighterColor = adjustColor(color, 40);
    const midColor = adjustColor(color, 10);
    const darkerColor = adjustColor(color, -20);
    const darkestColor = adjustColor(color, -40);
    return `radial-gradient(circle at 30% 30%, ${lighterColor} 0%, ${midColor} 30%, ${darkerColor} 70%, ${darkestColor} 100%)`;
  };

  // Helper function to lighten or darken a hex color
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
  return (
    <>
      {snakeDots.map((dot, index) => {
        const isHead = index === 0;
        const isTail = index === snakeDots.length - 1;
        const bodyGradient = getBodyGradient(snakeColor);

        return (
          <div
            key={index}
            className="absolute flex items-center justify-center"
            style={{
              left: `${dot.x * gridSize}px`,
              top: `${dot.y * gridSize}px`,
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              // Adds a smooth transition for movement instead of instant jumps
              transition: "all 0.1s linear",
            }}
          >
            {isHead ? (
              // 🐍 Head Segment with enhanced 3D effect
              <div className={`relative ${isEating ? 'animate-snake-eat' : ''}`}>
                <div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${snakeColor}40, transparent)`,
                    filter: 'blur(4px)',
                    transform: 'scale(1.2)',
                  }}
                ></div>
                <span
                  role="img"
                  aria-label="snake-head"
                  className="relative text-3xl filter drop-shadow-2xl animate-pulse"
                  style={{
                    color: snakeColor,
                    transform: `rotate(${getHeadRotation()})`,
                    transition: "transform 0.1s linear, filter 0.3s ease",
                    textShadow: `0 0 10px ${snakeColor}80, 0 0 20px ${snakeColor}40`,
                  }}
                >
                  <GiSnakeBite />
                </span>
              </div>
            ) : (
              // 🟢 Body & Tail Segment with enhanced 3D effect
              <div className={`flex items-center justify-center w-full h-full relative ${isGrowing ? 'animate-snake-grow' : ''}`}>
                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    background: `radial-gradient(circle, ${snakeColor}60, transparent)`,
                    filter: 'blur(2px)',
                    transform: 'scale(1.1)',
                  }}
                ></div>
                {/* Main body */}
                <div
                  className="relative rounded-full filter drop-shadow-lg border-2 border-white/20"
                  style={{
                    background: bodyGradient,
                    width: isTail ? "75%" : "90%",
                    height: isTail ? "75%" : "90%",
                    transition: "width 0.2s ease, height 0.2s ease, transform 0.1s ease",
                    boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 0 8px ${snakeColor}40`,
                  }}
                >
                  {/* Highlight */}
                  <div
                    className="absolute top-1 left-1 w-2 h-2 rounded-full opacity-60"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}