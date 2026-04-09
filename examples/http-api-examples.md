# Jzero HTTP API Examples

The Jzero API server runs on `localhost:3001` (configure via `PORT` environment variable).

All examples calculate birth charts from your favorite language.

## Start the Server

```bash
npm run dev
```

The API is now available at `http://localhost:3001`

---

## Quick Health Check

**Verify the server is running:**

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "healthy",
  "message": "Jzero API Server",
  "version": "2.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Calculate Birth Chart

**Endpoint:** `POST /api/chart/birth-chart`

### Request Format

```json
{
  "date": "1994-03-01",
  "time": "14:28:00",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

Optional: Use city name instead of coordinates:
```json
{
  "date": "1994-03-01",
  "time": "14:28:00",
  "city": "New York"
}
```

---

## Language Examples

### cURL

```bash
# Calculate birth chart using coordinates
curl -X POST http://localhost:3001/api/chart/birth-chart \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1994-03-01",
    "time": "14:28:00",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'

# Using city name (auto-lookup)
curl -X POST http://localhost:3001/api/chart/birth-chart \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1994-03-01",
    "time": "14:28:00",
    "city": "New York"
  }'
```

### JavaScript/Node.js

```javascript
// Using fetch (modern)
const response = await fetch('http://localhost:3001/api/chart/birth-chart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '1994-03-01',
    time: '14:28:00',
    city: 'New York'
  })
});

const chart = await response.json();
console.log('Sun:', chart.planets.sun);
console.log('Moon:', chart.planets.moon);
```

### Python

```python
import requests
import json

url = 'http://localhost:3001/api/chart/birth-chart'
data = {
    'date': '1994-03-01',
    'time': '14:28:00',
    'city': 'New York'
}

response = requests.post(url, json=data)
chart = response.json()

print(f"Sun: {chart['planets']['sun']['sign']} {chart['planets']['sun']['degree']}°")
print(f"Moon: {chart['planets']['moon']['sign']} {chart['planets']['moon']['degree']}°")
print(f"Ascendant: {chart['houses']['angles']['ascendant']['sign']}")
```

### Java

```java
import java.net.http.*;
import com.google.gson.*;

HttpClient client = HttpClient.newHttpClient();

String json = "{\"date\": \"1994-03-01\", \"time\": \"14:28:00\", \"city\": \"New York\"}";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("http://localhost:3001/api/chart/birth-chart"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(json))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
JsonObject chart = JsonParser.parseString(response.body()).getAsJsonObject();

System.out.println("Sun: " + chart.getAsJsonObject("planets")
    .getAsJsonObject("sun").get("sign"));
```

### C#

```csharp
using System.Net.Http;
using Newtonsoft.Json;

var client = new HttpClient();
var data = new
{
    date = "1994-03-01",
    time = "14:28:00",
    city = "New York"
};

var content = new StringContent(
    JsonConvert.SerializeObject(data),
    Encoding.UTF8,
    "application/json"
);

var response = await client.PostAsync("http://localhost:3001/api/chart/birth-chart", content);
var json = await response.Content.ReadAsStringAsync();
var chart = JsonConvert.DeserializeObject<dynamic>(json);

Console.WriteLine($"Sun: {chart["planets"]["sun"]["sign"]}");
```

### Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    data := map[string]interface{}{
        "date": "1994-03-01",
        "time": "14:28:00",
        "city": "New York",
    }
    
    jsonData, _ := json.Marshal(data)
    resp, _ := http.Post(
        "http://localhost:3001/api/chart/birth-chart",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    
    body, _ := ioutil.ReadAll(resp.Body)
    var chart interface{}
    json.Unmarshal(body, &chart)
    
    fmt.Println("Response:", chart)
}
```

### Rust

```rust
use reqwest::Client;
use serde_json::json;

#[tokio::main]
async fn main() {
    let client = Client::new();
    
    let data = json!({
        "date": "1994-03-01",
        "time": "14:28:00",
        "city": "New York"
    });
    
    let res = client
        .post("http://localhost:3001/api/chart/birth-chart")
        .json(&data)
        .send()
        .await
        .unwrap();
    
    let chart = res.json::<serde_json::Value>().await.unwrap();
    println!("Sun: {}", chart["planets"]["sun"]["sign"]);
}
```

### PHP

```php
<?php
$data = [
    'date' => '1994-03-01',
    'time' => '14:28:00',
    'city' => 'New York'
];

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($data)
    ]
]);

$response = file_get_contents(
    'http://localhost:3001/api/chart/birth-chart',
    false,
    $context
);

$chart = json_decode($response, true);
echo "Sun: " . $chart['planets']['sun']['sign'];
?>
```

### Swift (iOS/macOS)

```swift
import Foundation

let data = [
    "date": "1994-03-01",
    "time": "14:28:00",
    "city": "New York"
]

var request = URLRequest(url: URL(string: "http://localhost:3001/api/chart/birth-chart")!)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.httpBody = try! JSONSerialization.data(withJSONObject: data)

URLSession.shared.dataTask(with: request) { data, response, error in
    let chart = try! JSONSerialization.jsonObject(with: data!) as! [String: Any]
    print("Sun:", chart["planets"])
}.resume()
```

---

## Response Format

Birth chart responses include:

```json
{
  "input": {
    "date": "1994-03-01",
    "time": "14:28:00",
    "location": "New York",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "jd": {
    "jd_tt": "2449418.108333",
    "deltaT": "59.184",
    "deltaT_seconds": "59.2 seconds"
  },
  "planets": {
    "sun": {
      "degree": "10.45",
      "sign": "Pisces",
      "zodiacDegree": "10.45"
    },
    "moon": {
      "degree": "178.92",
      "sign": "Libra",
      "zodiacDegree": "28.92"
    }
    // ... more planets
  },
  "houses": {
    "houses": [
      { "degree": "12.34", "sign": "Libra", "zodiacDegree": "12.34" }
      // ... 12 houses
    ],
    "angles": {
      "ascendant": { "degree": "12.34", "sign": "Libra" },
      "mc": { "degree": "25.67", "sign": "Cancer" },
      "descendant": { "degree": "192.34", "sign": "Aries" },
      "ic": { "degree": "205.67", "sign": "Capricorn" }
    }
  },
  "accuracy": {
    "planetary_positions": "±0.0001°",
    "house_cusps": "±0.01°"
  }
}
```

---

## Error Handling

### Missing Fields

```
Status: 400
{"error": "Missing required fields: date, time"}
```

### City Not Found

```
Status: 404
{"error": "City not found: InvalidCity"}
```

### Invalid Date

```
Status: 400
{"error": "Invalid date format"}
```

---

## Integration Patterns

### Web Frontend → Jzero API

Your web app (React, Vue, Angular) calls the API:
```javascript
fetch('/api/chart/birth-chart').then(...);
```

### Mobile App → Jzero API

Your iOS/Android app calls the API:
```swift
URLSession.shared.dataTask(with: url).resume()
```

### Python Backend → Jzero API

Your Python Django/FastAPI service calls it:
```python
requests.post('http://jzero-api/api/chart/birth-chart')
```

### Microservices

Deploy Jzero and other services call it via HTTP:
- Java microsvc calls Python which calls Jzero
- Go CLI tool calls Jzero for calculations
- C# workers query Jzero for batch processing

---

## Performance Notes

- Single birth chart calculation: **<50ms**
- Planetary positions: **±0.0001° accuracy**
- House cusps: **±0.01° accuracy**
- Geolocation lookup: **<10ms**

## Configuration

Configure via `.env`:

```bash
# Server
PORT=3001
NODE_ENV=development

# Logging
LOG_LEVEL=INFO

# API
CORS_ORIGIN=*
```

---

## Next Steps

- ✅ Running the API successfully
- ✅ Getting calculations in your language
- 📖 Check [SERVER_API.md](../SERVER_API.md) for all endpoints
- 🚀 Deploy with Docker or to Vercel/Heroku

Happy calculating! 🌙⭐
