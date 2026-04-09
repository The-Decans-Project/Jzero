import React from 'react';

const planetSymbols = {
  'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
};

/**
 * Chart Display
 * SVG zodiac wheel with planetary and angle positions
 */
function ChartDisplay({ chartData }) {
  const size = 400;
  const center = size / 2;
  const radius = 150;

  const getAngle = (longitude) => (longitude - 90) * (Math.PI / 180);
  const getCoordinates = (angle, r) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle)
  });

  const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  return (
    <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
      <div className="flex justify-center rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6">
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Zodiac Wheel */}
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#4c5a7a" strokeWidth="2" />
          <circle cx={center} cy={center} r={radius * 0.7} fill="none" stroke="#374555" strokeWidth="1" />
          
          {/* Zodiac Signs */}
          {signs.map((sign, i) => {
            const angle = getAngle((i * 30) + 15);
            const coords = getCoordinates(angle, radius + 20);
            return (
              <text 
                key={`sign-${i}`} 
                x={coords.x} 
                y={coords.y} 
                textAnchor="middle" 
                dominantBaseline="central" 
                fontSize="18"
                fill="#9ca3af"
                fontWeight="600"
              >
                {sign}
              </text>
            );
          })}

          {/* Planets */}
          {chartData.planets && Object.entries(chartData.planets).map(([planet, pos]) => {
            const angle = getAngle(parseFloat(pos.longitude));
            const coords = getCoordinates(angle, radius * 0.6);
            return (
              <g key={`planet-${planet}`} className="cursor-pointer">
                <circle cx={coords.x} cy={coords.y} r="12" fill="#7c3aed" stroke="#fff" strokeWidth="2" />
                <text 
                  x={coords.x} 
                  y={coords.y} 
                  textAnchor="middle" 
                  dominantBaseline="central" 
                  fontSize="12" 
                  fill="#fff" 
                  fontWeight="bold"
                >
                  {planetSymbols[planet]}
                </text>
              </g>
            );
          })}

          {/* Angles */}
          {chartData.angles && Object.entries(chartData.angles).map(([key, angle]) => {
            const angleRad = getAngle(parseFloat(angle.longitude));
            const coords = getCoordinates(angleRad, radius * 0.85);
            const labelMap = { ASC: 'A', MC: 'M', DSC: 'D', IC: 'I' };
            return (
              <g key={`angle-${key}`}>
                <rect 
                  x={coords.x - 12} 
                  y={coords.y - 12} 
                  width="24" 
                  height="24" 
                  fill="#ef4444" 
                  stroke="#fff" 
                  strokeWidth="2" 
                  rx="2"
                />
                <text 
                  x={coords.x} 
                  y={coords.y} 
                  textAnchor="middle" 
                  dominantBaseline="central" 
                  fontSize="10" 
                  fill="#fff" 
                  fontWeight="bold"
                >
                  {labelMap[key]}
                </text>
              </g>
            );
          })}

          {/* Center Point */}
          <circle cx={center} cy={center} r="4" fill="#cbd5e1" />
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800/50 p-2">
          <span className="text-base text-purple-400">●</span>
          <span className="text-slate-300">Planets</span>
        </div>
        <div className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800/50 p-2">
          <span className="text-base text-red-400">■</span>
          <span className="text-slate-300">Angles (ASC/MC/DSC/IC)</span>
        </div>
      </div>
    </div>
  );
}

export default ChartDisplay;
