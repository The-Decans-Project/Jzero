import React from 'react';

const planetSymbols = {
  'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptune': '♆', 'Pluto': '♇'
};

/**
 * Planetary Table
 * Displays the 10 planets with their positions, signs, and coordinates
 */
function PlanetaryTable({ planets }) {
  const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

  return (
    <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Planet</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-slate-200">Sign</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-200">Degree</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-200">Longitude</th>
              <th className="hidden px-4 py-3 text-right text-sm font-semibold text-slate-200 md:table-cell">Latitude</th>
              <th className="hidden px-4 py-3 text-right text-sm font-semibold text-slate-200 lg:table-cell">Distance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {planetOrder.map(planet => {
              const data = planets[planet];
              if (!data) return null;

              return (
                <tr key={planet} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-slate-200">
                    <span className="mr-2 text-lg">{planetSymbols[planet]}</span>
                    <span className="font-semibold">{planet}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300">
                    <span className="font-semibold text-purple-400">{data.sign}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {parseFloat(data.zodiacDegree).toFixed(2)}°
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {parseFloat(data.longitude).toFixed(2)}°
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono text-slate-400 md:table-cell">
                    {parseFloat(data.latitude).toFixed(2)}°
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono text-slate-400 lg:table-cell">
                    {parseFloat(data.distance).toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-700 pt-4 text-xs text-slate-500">
        <p>Accuracy: ±0.0001° • Source: Swiss Ephemeris</p>
      </div>
    </div>
  );
}

export default PlanetaryTable;
