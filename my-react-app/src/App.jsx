// import { useState, useEffect } from "react";
// import GameBoard from "./components/GameBoard";

// export default function App() {
//   const [currentTheme, setCurrentTheme] = useState("default");

//   useEffect(() => {
//     // Apply theme to document instantly
//     document.documentElement.setAttribute('data-theme', currentTheme);
    
//     // Force a re-render to ensure theme is applied
//     document.body.style.transition = 'all 0.2s ease';
//   }, [currentTheme]);

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 opacity-20" style={{
//         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//       }}></div>
//       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
//       {/* Floating Particles */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-60"></div>
//         <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float-delayed opacity-40"></div>
//         <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-float-slow opacity-50"></div>
//         <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-float-delayed-2 opacity-30"></div>
//       </div>

//       {/* Main Content - Single Page Layout */}
//       <div className="relative z-10 p-4 sm:p-6">
//         {/* Professional Header */}
//         <div className="text-center mb-6 sm:mb-8 animate-slide-in-top">
//           <h1 className="text-heading font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient-x">
//             The Slytherin 🐍
//           </h1>
//         </div>
        
//         {/* Single Page Game Layout */}
//         <GameBoard currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";

export default function App() {
  const [currentTheme, setCurrentTheme] = useState("default");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    document.body.style.transition = "all 0.2s ease";
  }, [currentTheme]);

  return (
    <div className="min-h-screen relative overflow-hidden text-sm">
      {/* Subtle Animated Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

      {/* Minimal Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-3 sm:p-4">
        {/* Compact Header */}
        <div className="text-center mb-4 animate-fade-in">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            The Slytherin 🐍
          </h1>
        </div>

        {/* Game Board */}
        <GameBoard
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />
      </div>
    </div>
  );
}
