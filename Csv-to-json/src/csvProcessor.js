const fs = require('fs');

// Convert a CSV line into an array of values 
function parseCsvLine(line) {
  const result = [];
  let current = "", inQuotes = false;

  for (let char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else current += char;
  }
  result.push(current.trim());
  return result;
}

// Read entire CSV and return array of JSON objects
function parseCsv(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => (obj[h] = values[idx]));
    data.push(obj);
  }

  return data;
}

module.exports = parseCsv;
