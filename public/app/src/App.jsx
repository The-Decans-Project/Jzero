/**
 * Jzero React Application
 * Professional astrology chart calculator using shadcn/ui
 * 
 * Features:
 * - Birth chart calculation
 * - Chart display with zodiac visualization
 * - Planetary positions table
 * - Current transits viewer
 * - Swiss Ephemeris powered (±0.0001° accuracy)
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import BirthChartForm from './components/BirthChartForm';
import PlanetaryTable from './components/PlanetaryTable';
import ChartDisplay from './components/ChartDisplay';
import TransitsViewer from './components/TransitsViewer';

/**
 * App - Main application component
 * @returns {React.ReactElement}
 */
function App() {
  const [chartData, setChartData] = useState(null);
  const [transits, setTransits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle birth chart calculation
   * @param {Object} birthData - Birth date and location info
   */
  const handleCalculateChart = async (birthData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/chart/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setChartData(result.data);
      } else {
        setError(result.error || 'Failed to calculate chart');
      }
    } catch (err) {
      setError(err.message || 'Connection error to backend');
      console.error('Chart calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle transits calculation
   */
  const handleCalculateTransits = async () => {
    if (!chartData) {
      setError('Calculate birth chart first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/chart/transits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthChart: chartData })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setTransits(result.data);
      } else {
        setError(result.error || 'Failed to calculate transits');
      }
    } catch (err) {
      setError(err.message || 'Connection error to backend');
      console.error('Transits calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">🌙 Jzero</h1>
          <p className="mt-2 text-slate-400">Professional Astrology Birth Chart Calculator • Swiss Ephemeris Powered</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-900 bg-red-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-500" />
            <p className="mt-4 text-slate-400">Computing planetary positions...</p>
          </div>
        )}

        {/* Tab Navigation */}
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1">
            <TabsTrigger 
              value="calculator"
              className="text-slate-400 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              📊 Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="chart" 
              disabled={!chartData}
              className="text-slate-400 disabled:opacity-50 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              🎯 Birth Chart
            </TabsTrigger>
            <TabsTrigger 
              value="transits" 
              disabled={!chartData}
              className="text-slate-400 disabled:opacity-50 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              🔄 Transits
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-2xl font-bold text-white">Calculate Your Birth Chart</h2>
              <p className="mt-2 text-slate-400">
                Enter your birth date, time, and location. Powered by Swiss Ephemeris for ±0.0001° accuracy.
              </p>
            </div>
            <BirthChartForm onSubmit={handleCalculateChart} disabled={loading} />
          </TabsContent>

          {/* Birth Chart Tab */}
          <TabsContent value="chart" className="space-y-6">
            {chartData && (
              <>
                {/* Chart Title & Info */}
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                  <h2 className="text-2xl font-bold text-white">Your Birth Chart</h2>
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-mono text-slate-200">{chartData.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Time</p>
                      <p className="font-mono text-slate-200">{chartData.time}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Latitude</p>
                      <p className="font-mono text-slate-200">{chartData.location.latitude.toFixed(4)}°</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Longitude</p>
                      <p className="font-mono text-slate-200">{chartData.location.longitude.toFixed(4)}°</p>
                    </div>
                  </div>
                </div>

                {/* Chart Visualization & Table */}
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ChartDisplay chartData={chartData} />
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                      <h3 className="font-semibold text-white">Angles</h3>
                      <div className="mt-3 space-y-2 text-sm">
                        {chartData.angles && Object.entries(chartData.angles).map(([key, angle]) => (
                          <div key={key} className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">{key}</span>
                            <span className="font-mono text-slate-200">{angle.zodiac} {angle.degree.toFixed(1)}°</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Planetary Table */}
                <PlanetaryTable planets={chartData.planets} />

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCalculateTransits}
                    disabled={loading}
                    className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                  >
                    📡 View Current Transits
                  </button>
                </div>
              </>
            )}
          </TabsContent>

          {/* Transits Tab */}
          <TabsContent value="transits" className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="text-2xl font-bold text-white">Current Transits</h2>
              <p className="mt-2 text-slate-400">Where the planets are now, relative to your birth chart.</p>
            </div>
            <button
              onClick={handleCalculateTransits}
              disabled={loading || !chartData}
              className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Get Current Transits'}
            </button>
            {transits && <TransitsViewer transitsData={transits} />}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-400">Jzero © 2024 • Swiss Ephemeris Powered • MIT Licensed</p>
        <p className="mt-2">
          <a href="https://github.com/The-Decans-Project/Jzero" className="text-purple-400 hover:text-purple-300">
            GitHub
          </a>
          {' • '}
          <a href="https://github.com/sponsors/The-Decans-Project" className="text-purple-400 hover:text-purple-300">
            Sponsor
          </a>
          {' • '}
          <a href="https://jzero.dev/docs" className="text-purple-400 hover:text-purple-300">
            Documentation
          </a>
        </p>
        <p className="mt-3 text-slate-600">Accuracy: ±0.0001° | Performance: ~150ms</p>
      </footer>
    </div>
  );
}

export default App;
