require("dotenv").config();
const express = require("express");
const parseCsv = require("./csvProcessor");
const db = require("./db");

const app = express();
const PORT = 3000;

(async () => {
  try {
    const userRes = await db.query("SELECT current_user, session_user;");
    console.log("Connected as:", userRes.rows);
    const tables = await db.query("SELECT * FROM public.users LIMIT 1;");
    console.log("Users table accessible:", tables.rows);
  } catch (err) {
    console.error("Test DB connection error:", err);
  }
})();

app.post("/convert-csv", async (req, res) => {
  try {
    const filePath = process.env.CSV_PATH;
    const records = parseCsv(filePath);
    const ageGroups = { "<20": 0, "20-40": 0, "40-60": 0, "60+": 0 };

    for (const part of records) {
      const { "name.firstName": first, "name.lastName": last, age } = part;
      const address = {
        line1: part["address.line1"],
        line2: part["address.line2"],
        city: part["address.city"],
        state: part["address.state"],
      };

      const fullName = `${first} ${last}`.trim(); //name to fullname

      //making additional column to store rest of the data
      const additionalPart = { ...part };
      delete additionalPart["name.firstName"];
      delete additionalPart["name.lastName"];
      delete additionalPart.age;
      delete additionalPart["address.line1"];
      delete additionalPart["address.line2"];
      delete additionalPart["address.city"];
      delete additionalPart["address.state"];

      //inserting into db
      await db.query(
        `INSERT INTO users (name, age, address, additional_info)
         VALUES ($1, $2, $3, $4)`,
        [fullName, age, JSON.stringify(address), JSON.stringify(additionalPart)]
      );

      // Age group calculation from data in db 
      const { rows } = await db.query("SELECT age FROM users");
      for (const row of rows) {
        const age = parseInt(row.age, 10); //base 10
        if (age < 20) ageGroups["<20"]++;
        else if (age < 40) ageGroups["20-40"]++;
        else if (age < 60) ageGroups["40-60"]++;
        else ageGroups["60+"]++;
      }
    }

    console.log("Age Distribution:-", ageGroups);
    res.json({ status: "success", inserted: records.length, ageGroups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error Occured" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
