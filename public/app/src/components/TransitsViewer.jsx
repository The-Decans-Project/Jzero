import React from 'react';

const planetSymbols = {
  'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
};

/**
 * Transits Viewer
 * Displays current planetary transits relative to birth chart
 */
function TransitsViewer({ transitsData }) {
  if (!transitsData || !transitsData.transits) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center">
        <p className="text-slate-400">No transit data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timestamp */}
      <div className="rounded-lg border border-slate-800 bg-slate-800/50 px-4 py-3 text-sm text-slate-400">
        Calculated: {new Date(transitsData.datetime).toLocaleString()}
      </div>

      {/* Transits Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {transitsData.transits.map((transit, idx) => (
          <div 
            key={idx} 
            className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 space-y-3 hover:bg-slate-800/75 transition"
          >
            {/* Planet Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
              <span className="text-2xl">{planetSymbols[transit.planet]}</span>
              <div>
                <p className="font-semibold text-white">{transit.planet}</p>
                <p className="text-xs text-slate-500">{transit.aspect}</p>
              </div>
            </div>

            {/* Positions */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Current</span>
                <span className="font-mono text-slate-300">{transit.currentPosition.zodiac} {transit.currentPosition.degree.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Birth</span>
                <span className="font-mono text-slate-300">{transit.birthPosition.zodiac} {transit.birthPosition.degree.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-500">Orb</span>
                <span className="font-mono font-semibold text-purple-400">{transit.orb.toFixed(2)}°</span>
              </div>
            </div>

            {/* Aspect Badge */}
            <div className="rounded bg-slate-700/50 px-2 py-1 text-xs font-semibold text-purple-300">
              {transit.aspect}
            </div>

            {/* Interpretation */}
            {transit.interpretation && (
              <p className="text-xs text-slate-400 italic">{transit.interpretation}</p>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-xs text-slate-500">
        <p>Accuracy: ±0.0001° | Aspects calculated from birth chart</p>
      </div>
    </div>
  );
}

export default TransitsViewer;
