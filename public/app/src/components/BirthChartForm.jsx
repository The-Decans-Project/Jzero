import { useState } from 'react';

/**
 * Birth Chart Calculator Form
 * Collects date, time, and location for chart calculation
 */
function BirthChartForm({ onSubmit, disabled }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '12:00',
    city: '',
    latitude: '',
    longitude: '',
    timezone: 'America/New_York'
  });

  const [useCity, setUseCity] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
      {/* Date & Time Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Date & Time</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-slate-200">
              Birth Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="time" className="block text-sm font-medium text-slate-200">
              Birth Time (Local) <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4 border-t border-slate-700 pt-4">
        <h3 className="font-semibold text-white">Location</h3>

        {/* Location Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUseCity(true)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
              useCity
                ? 'bg-purple-600 text-white'
                : 'border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            City Search
          </button>
          <button
            type="button"
            onClick={() => setUseCity(false)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
              !useCity
                ? 'bg-purple-600 text-white'
                : 'border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            Coordinates
          </button>
        </div>

        {/* City Input */}
        {useCity ? (
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-slate-200">
              City Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g., New York, London, Tokyo"
              required={useCity}
              className="block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <p className="text-xs text-slate-500">100+ major cities supported worldwide</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="latitude" className="block text-sm font-medium text-slate-200">
                Latitude <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="-90 to 90"
                min="-90"
                max="90"
                step="0.0001"
                required={!useCity}
                className="block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="longitude" className="block text-sm font-medium text-slate-200">
                Longitude <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="-180 to 180"
                min="-180"
                max="180"
                step="0.0001"
                required={!useCity}
                className="block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300">
        <p><strong className="text-slate-200">Accuracy:</strong> ±0.0001° with Swiss Ephemeris</p>
        <p><strong className="text-slate-200">Performance:</strong> ~150ms calculation time</p>
        <p><strong className="text-slate-200">Valid Range:</strong> Years 1950–2050</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-semibold text-white transition hover:from-purple-700 hover:to-purple-800 disabled:opacity-50"
      >
        {disabled ? 'Calculating...' : '🎯 Calculate Birth Chart'}
      </button>
    </form>
  );
}

export default BirthChartForm;
