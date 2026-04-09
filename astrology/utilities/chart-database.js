/**
 * Chart Database
 * Manages storage and retrieval of birth charts
 * In-memory cache for demonstration; can be extended to use localStorage or API
 * Open Source Astrology Calculator
 */

/**
 * In-memory storage for birth charts
 * In production, this would use localStorage, IndexedDB, or a backend API
 */
const chartDatabase = {};
let chartIdCounter = 1;

/**
 * Save a birth chart to the database
 * @param {Object} chart - Birth chart object
 * @param {Object} metadata - Additional metadata (name, notes, etc.)
 * @returns {string} Chart ID
 */
export function saveChart(chart, metadata = {}) {
  const chartId = `chart_${chartIdCounter++}`;
  
  chartDatabase[chartId] = {
    id: chartId,
    chart: chart,
    metadata: {
      ...metadata,
      created: new Date(),
      updated: new Date()
    }
  };
  
  return chartId;
}

/**
 * Retrieve a chart by ID
 * @param {string} chartId - Chart ID
 * @returns {Object|null} Chart object or null if not found
 */
export function getChart(chartId) {
  const entry = chartDatabase[chartId];
  return entry ? entry.chart : null;
}

/**
 * Get chart with metadata
 * @param {string} chartId - Chart ID
 * @returns {Object|null} Chart entry with metadata or null
 */
export function getChartEntry(chartId) {
  return chartDatabase[chartId] || null;
}

/**
 * Update a chart
 * @param {string} chartId - Chart ID
 * @param {Object} chart - Updated chart object
 * @returns {boolean} True if successful
 */
export function updateChart(chartId, chart) {
  if (!chartDatabase[chartId]) {
    return false;
  }
  
  chartDatabase[chartId].chart = chart;
  chartDatabase[chartId].metadata.updated = new Date();
  return true;
}

/**
 * Delete a chart
 * @param {string} chartId - Chart ID
 * @returns {boolean} True if successful
 */
export function deleteChart(chartId) {
  if (!chartDatabase[chartId]) {
    return false;
  }
  
  delete chartDatabase[chartId];
  return true;
}

/**
 * List all saved charts
 * @returns {Array} Array of chart entries
 */
export function listCharts() {
  return Object.values(chartDatabase);
}

/**
 * Search charts by name
 * @param {string} query - Search query
 * @returns {Array} Matching chart entries
 */
export function searchCharts(query) {
  const searchTerm = query.toLowerCase();
  
  return Object.values(chartDatabase).filter(entry => {
    const name = (entry.metadata.name || '').toLowerCase();
    const notes = (entry.metadata.notes || '').toLowerCase();
    return name.includes(searchTerm) || notes.includes(searchTerm);
  });
}

/**
 * Get chart statistics
 * @returns {Object} Database statistics
 */
export function getStatistics() {
  const charts = Object.values(chartDatabase);
  
  return {
    totalCharts: charts.length,
    oldestChart: charts.length > 0 ? Math.min(...charts.map(c => c.metadata.created)) : null,
    newestChart: charts.length > 0 ? Math.max(...charts.map(c => c.metadata.created)) : null,
    lastModified: charts.length > 0 ? Math.max(...charts.map(c => c.metadata.updated)) : null
  };
}

/**
 * Export all charts as JSON
 * @returns {string} JSON string of all charts
 */
export function exportAllCharts() {
  return JSON.stringify(chartDatabase, null, 2);
}

/**
 * Import charts from JSON
 * @param {string} jsonData - JSON string to import
 * @returns {boolean} True if successful
 */
export function importCharts(jsonData) {
  try {
    const imported = JSON.parse(jsonData);
    Object.assign(chartDatabase, imported);
    // Update counter to avoid ID conflicts
    const maxId = Math.max(...Object.keys(chartDatabase)
      .map(k => parseInt(k.split('_')[1]) || 0));
    chartIdCounter = maxId + 1;
    return true;
  } catch (error) {
    console.error('Error importing charts:', error);
    return false;
  }
}

/**
 * Clear all charts from database
 * @returns {boolean} True if successful
 */
export function clearDatabase() {
  Object.keys(chartDatabase).forEach(key => delete chartDatabase[key]);
  chartIdCounter = 1;
  return true;
}

export default {
  saveChart,
  getChart,
  getChartEntry,
  updateChart,
  deleteChart,
  listCharts,
  searchCharts,
  getStatistics,
  exportAllCharts,
  importCharts,
  clearDatabase
};