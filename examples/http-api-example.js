/**
 * HTTP API Example - Birth Chart via HTTP
 * 
 * This example shows how to use Jzero's HTTP API to calculate a birth chart.
 * Perfect for testing or integrating with other languages/frameworks.
 * 
 * Usage:
 * 1. Start the API server: npm run dev
 * 2. In another terminal: node examples/http-api-example.js
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001';

/**
 * Make an HTTP request to the Jzero API
 */
async function apiRequest(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Check if API is running
 */
async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    console.log('✅ API Server:', data.status);
    console.log('   Version:', data.version);
    return true;
  } catch (error) {
    console.error('❌ API Server not running!');
    console.error('   Start it with: npm run dev');
    return false;
  }
}

/**
 * Example: Calculate birth chart
 */
async function exampleBirthChart() {
  console.log('\n📊 Birth Chart Calculation (via HTTP API)\n');

  const birthData = {
    date: '1994-03-01',
    time: '14:28:00',
    city: 'New York'
  };

  console.log('Input:');
  console.log(`  Date: ${birthData.date}`);
  console.log(`  Time: ${birthData.time}`);
  console.log(`  Location: ${birthData.city}\n`);

  try {
    const chart = await apiRequest('/api/chart/birth-chart', birthData);

    console.log('Planetary Positions:\n');
    const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

    planets.forEach(planet => {
      if (chart.planets[planet]) {
        const p = chart.planets[planet];
        console.log(`  ${planet.padEnd(9)} : ${p.degree.padEnd(6)}° ${p.sign.padEnd(8)} (${p.zodiacDegree}°)`);
      }
    });

    console.log('\nAngles:\n');
    const { ascendant, mc, descendant, ic } = chart.houses.angles;
    console.log(`  Ascendant   : ${ascendant.degree.padEnd(6)}° ${ascendant.sign}`);
    console.log(`  Midheaven   : ${mc.degree.padEnd(6)}° ${mc.sign}`);
    console.log(`  Descendant  : ${descendant.degree.padEnd(6)}° ${descendant.sign}`);
    console.log(`  IC          : ${ic.degree.padEnd(6)}° ${ic.sign}`);

    console.log('\nAccuracy:', chart.accuracy);
  } catch (error) {
    console.error('Error calculating birth chart:', error.message);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🌙 Jzero HTTP API Example\n');
  console.log('This demonstrates using Jzero from your client');
  console.log('(in any language - we\'re using JavaScript/fetch here)\n');

  // Check if API is running
  const isHealthy = await checkHealth();
  if (!isHealthy) {
    process.exit(1);
  }

  // Run examples
  await exampleBirthChart();

  console.log('\n✅ Example complete!\n');
  console.log('Next steps:');
  console.log('  - See examples/http-api-examples.md for other languages');
  console.log('  - Read SERVER_API.md for all available endpoints');
  console.log('  - Deploy the API to call from Python, Go, Rust, etc.\n');
}

main().catch(console.error);
