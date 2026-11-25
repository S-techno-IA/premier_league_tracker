import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { Pool } from "pg";

config();

const port = Number(process.env.PORT) || 3001;
const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

app.get("/scorers", async (req, res) => {
  const result = await pool.query(`
      SELECT
        s.id,
        s.name AS scorer_name,
        t.name AS team_name,
        t.short_name,
        COALESCE(gc.total_goals, 0)::INT AS total_goals
      FROM scorers s
      JOIN teams t ON t.id = s.team_id
      LEFT JOIN goals_count gc ON gc.scorer_id = s.id
      ORDER BY total_goals DESC, s.name ASC
    `);

  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`API disponible sur http://localhost:${port} !`);
});
