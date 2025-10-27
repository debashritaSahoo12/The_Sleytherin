// import React from "react";

// export default function Leaderboard({ leaderboard, highestScore }) {
//     // Helper to format positions
//     const formatPosition = (index) => {
//         if (index === 0) return "1st";
//         if (index === 1) return "2nd";
//         if (index === 2) return "3rd";
//         return `${index + 1}th`;
//     };

//     const getPositionIcon = (index) => {
//         if (index === 0) return "🥇";
//         if (index === 1) return "🥈";
//         if (index === 2) return "🥉";
//         return "🏅";
//     };

//     const getPositionStyle = (index) => {
//         if (index === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black";
//         if (index === 1) return "bg-gradient-to-r from-gray-300 to-gray-400 text-black";
//         if (index === 2) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
//         return "bg-white/10 text-white";
//     };

//     return (
//         <div className="modern-card h-fit">
//             {/* Header */}
//             <div className="text-center mb-4">
//                 <h2 className="text-heading font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
//                     <span className="text-2xl">🏆</span>
//                     <span>Top 5</span>
//                 </h2>
//                 <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-2"></div>
//             </div>

//             {/* Leaderboard List - Vertical Layout for Sidebar */}
//             <div className="space-y-3 mb-4">
//                 {leaderboard.slice(0, 5).map((player, index) => (
//                     <div
//                         key={index}
//                         className={`modern-card p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
//                             index < 3 ? "border-2 border-yellow-400/50" : "border border-white/20"
//                         }`}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${getPositionStyle(index)}`}>
//                                     {getPositionIcon(index)}
//                                 </div>
//                                 <div className={`font-bold text-label ${index < 3 ? "text-white" : "text-white/90"}`}>
//                                     {player.name.length > 8 ? player.name.substring(0, 8) + "..." : player.name}
//                                 </div>
//                             </div>
//                             <div className={`text-heading font-bold ${index < 3 ? "text-yellow-400" : "text-white"}`}>
//                                 {player.score}
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Highest Score */}
//             <div className="text-center">
//                 <div className="modern-card p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-400/30">
//                     <div className="text-label font-bold text-white mb-1">🏆 Highest</div>
//                     <div className="text-heading font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                         {highestScore}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React from "react";

export default function Leaderboard({ leaderboard, highestScore }) {
  const formatPosition = (index) => {
    if (index === 0) return "1st";
    if (index === 1) return "2nd";
    if (index === 2) return "3rd";
    return `${index + 1}th`;
  };

  const getPositionIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "🏅";
  };

  const getPositionStyle = (index) => {
    if (index === 0)
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black";
    if (index === 1)
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-black";
    if (index === 2)
      return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    return "bg-white/10 text-white";
  };

  return (
    <div className="modern-card h-fit p-2">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <span className="text-xl">🏆</span>
          <span>Top 5</span>
        </h2>
        <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-1"></div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2 mb-2">
        {leaderboard.slice(0, 5).map((player, index) => (
          <div
            key={index}
            className={`modern-card p-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
              index < 3
                ? "border border-yellow-400/50"
                : "border border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${getPositionStyle(
                    index
                  )}`}
                >
                  {getPositionIcon(index)}
                </div>
                <div
                  className={`font-semibold text-sm ${
                    index < 3 ? "text-white" : "text-white/90"
                  }`}
                >
                  {player.name.length > 8
                    ? player.name.substring(0, 8) + "..."
                    : player.name}
                </div>
              </div>
              <div
                className={`font-bold text-sm ${
                  index < 3 ? "text-yellow-400" : "text-white"
                }`}
              >
                {player.score}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Highest Score */}
      <div className="text-center">
        <div className="modern-card p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30">
          <div className="text-xs font-bold text-white mb-0.5">🏆 Highest</div>
          <div className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-400 bg-clip-text text-transparent">
            {highestScore}
          </div>
        </div>
      </div>
    </div>
  );
}
