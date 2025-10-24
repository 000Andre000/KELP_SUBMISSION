# CSV to JSON and upload to PostgreSQL 

This application reads a CSV file and converts each row into JSON objects, and uploads the data to a PostgreSQL database. It also calculates the **age distribution** of all users stored in the database.

---

### 1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Create a `.env` file in the project root:
```env
CSV_PATH=YOUR FILE PATH
PORT=PORT YOU WISH TO RUN THE API ON

PGHOST=POSTGREE SQL HOST NAME
PGUSER=POSTGREE SQL USER NAME
PGPASSWORD=POSTGREE SQL PASSWORD
PGDATABASE=POSTGREE SQL DATABASE NAME
PGPORT=POSTGREE SQL PORT NUMBER
```

### 4. Create the table :

### 5. Start the server:
```bash
node index.js
```

### 6. Trigger CSV conversion and table insertion:
USE THE 
### POST API ENDPOINT `/convert-csv`
```bash
curl -X POST http://localhost:3000/convert-csv
```
---


## CSV Format

### Sample CSV Structure:
```csv
name.firstName, name.lastName, age, address.line1, address.line2, address.city, address.state, gender Rohit, Prasad, 35, A-563 Rakshak Society, New Pune Road, Pune, Maharashtra, male
```
