import { GiShinyApple, GiRollingBomb } from "react-icons/gi";
import { PiOrangeFill } from "react-icons/pi";
import { IoDiamondSharp } from "react-icons/io5";


export const FOOD_TYPES = {
  NORMAL: "normal",
  BONUS: "bonus",
  BOMB: "bomb",
};

const ICONS = {
  [FOOD_TYPES.NORMAL]: PiOrangeFill,
  [FOOD_TYPES.BONUS]: IoDiamondSharp,
  [FOOD_TYPES.BOMB]: GiRollingBomb,
};

/**
 * Distinct icon colors that never blend with the board.
 * The themed backplate (from index.css) ensures extra contrast.
 */
const COLORS = {
  [FOOD_TYPES.NORMAL]: "#f97316", // orange-500
  [FOOD_TYPES.BONUS]: "#ef4444", // red-500
  [FOOD_TYPES.BOMB]: "#0f172a", // slate-900 (near-black)
};

export default function Food({
  position,
  type = FOOD_TYPES.NORMAL,
  extraClass = "", // receives "food-<theme>" and optional "food-blink"
  themeColor = "#f97316", // theme-specific color
}) {
  const gridSize = 20;
  const Icon = ICONS[type];

  const getFoodGlow = (type) => {
    const color = type === FOOD_TYPES.NORMAL ? themeColor : COLORS[type];
    const rgb = hexToRgb(color);
    
    switch (type) {
      case FOOD_TYPES.NORMAL:
        return `0 0 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8), 0 0 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`;
      case FOOD_TYPES.BONUS:
        return "0 0 20px rgba(239, 68, 68, 0.9), 0 0 40px rgba(239, 68, 68, 0.5)";
      case FOOD_TYPES.BOMB:
        return "0 0 15px rgba(15, 23, 42, 0.9), 0 0 30px rgba(15, 23, 42, 0.6)";
      default:
        return "0 0 10px rgba(255, 255, 255, 0.5)";
    }
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const getFoodAnimation = (type) => {
    switch (type) {
      case FOOD_TYPES.NORMAL:
        return "animate-pulse";
      case FOOD_TYPES.BONUS:
        return "animate-bounce";
      case FOOD_TYPES.BOMB:
        return "animate-ping";
      default:
        return "";
    }
  };

  return (
    <div
      className={`absolute rounded-full flex items-center justify-center relative ${
        type === FOOD_TYPES.NORMAL ? "food-pulsate" : ""
      } ${extraClass}`}
      style={{
        left: `${position.x * gridSize}px`,
        top: `${position.y * gridSize}px`,
        width: `${gridSize}px`,
        height: `${gridSize}px`,
      }}
      aria-label={`food-${type}`}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-50"
        style={{
          background: `radial-gradient(circle, ${type === FOOD_TYPES.NORMAL ? themeColor : COLORS[type]}40, transparent)`,
          filter: 'blur(3px)',
          transform: 'scale(1.3)',
          boxShadow: getFoodGlow(type),
        }}
      ></div>
      
      {/* Main food container */}
      <div
        className={`relative rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg ${getFoodAnimation(type)}`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${type === FOOD_TYPES.NORMAL ? themeColor : COLORS[type]}CC, ${type === FOOD_TYPES.NORMAL ? themeColor : COLORS[type]}99, ${type === FOOD_TYPES.NORMAL ? themeColor : COLORS[type]}66)`,
          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), ${getFoodGlow(type)}`,
        }}
      >
        {/* Icon with enhanced styling */}
        <Icon
          size={gridSize - 4}
          style={{
            color: type === FOOD_TYPES.BOMB ? "#ffffff" : (type === FOOD_TYPES.NORMAL ? themeColor : COLORS[type]),
            filter: type === FOOD_TYPES.BOMB 
              ? "drop-shadow(0 0 8px rgba(0,0,0,0.9))" 
              : "drop-shadow(0 0 4px rgba(255,255,255,0.8))",
            textShadow: type === FOOD_TYPES.BOMB 
              ? "0 0 10px rgba(0,0,0,0.8)" 
              : "0 0 6px rgba(255,255,255,0.6)",
          }}
        />
        
        {/* Highlight effect */}
        <div
          className="absolute top-1 left-1 w-2 h-2 rounded-full opacity-70"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent)',
          }}
        ></div>
      </div>
    </div>
  );
}