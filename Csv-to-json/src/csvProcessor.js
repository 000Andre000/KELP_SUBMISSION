const fs = require('fs');

// Convert a CSV line into an array of values 
function parseCsvLine(line) {
  const result = [];
  let current = "", isSeperate = false;

  for (let char of line) {
    if (char === '"') isSeperate = !isSeperate;
    else if (char === ',' && !isSeperate) {
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
  const start = parseCsvLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const obj = {};
    start.forEach((h, idx) => (obj[h] = values[idx]));
    data.push(obj);
  }

  return data;
}

module.exports = parseCsv;
