require("dotenv").config();
const express = require("express");
const parseCsv = require("./csvProcessor");
const pool = require("./db");

const app = express();
const PORT = 3000;

(async () => {
  try {
    const userRes = await pool.query("SELECT current_user, session_user;");
    console.log("Connected as:", userRes.rows);
    const tables = await pool.query("SELECT * FROM public.users LIMIT 1;");
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

    for (const r of records) {
      const { "name.firstName": first, "name.lastName": last, age } = r;
      const address = {
        line1: r["address.line1"],
        line2: r["address.line2"],
        city: r["address.city"],
        state: r["address.state"],
      };

      const fullName = `${first} ${last}`.trim(); //name to fullname

      //making additional column to store rest of the data
      const additional = { ...r };
      delete additional["name.firstName"];
      delete additional["name.lastName"];
      delete additional.age;
      delete additional["address.line1"];
      delete additional["address.line2"];
      delete additional["address.city"];
      delete additional["address.state"];

      //inserting into db
      await pool.query(
        `INSERT INTO users (name, age, address, additional_info)
         VALUES ($1, $2, $3, $4)`,
        [fullName, age, JSON.stringify(address), JSON.stringify(additional)]
      );

      // Age group calculation from data in db 
      const { rows } = await pool.query("SELECT age FROM users");
      for (const row of rows) {
        const age = parseInt(row.age, 10); //base 10
        if (age < 20) ageGroups["<20"]++;
        else if (age < 40) ageGroups["20-40"]++;
        else if (age < 60) ageGroups["40-60"]++;
        else ageGroups["60+"]++;
      }
    }

    console.log("Age Distribution:", ageGroups);
    res.json({ status: "success", inserted: records.length, ageGroups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
