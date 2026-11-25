import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Pool } from "pg";

dotenv.config();

const app = express();

const port = Number(process.env.PORT);
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Premier League Tracker public" });
});

app.get("/teams", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.name,
        t.short_name,
        COALESCE(SUM(gc.total_goals), 0)::INT AS total_goals
      FROM teams t
      LEFT JOIN scorers s ON s.team_id = t.id
      LEFT JOIN goals_count gc ON gc.scorer_id = s.id
      GROUP BY t.id
      ORDER BY total_goals DESC, t.name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur GET /teams :", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des équipes" });
  }
});

app.get("/teams/:id/scorers", async (req, res) => {
  const teamId = Number(req.params.id);
  if (!Number.isInteger(teamId) || teamId <= 0) {
    res.status(400).json({ error: "ID d'équipe invalide" });
    return;
  }

  try {
    const teamRes = await pool.query(
      "SELECT id, name, short_name FROM teams WHERE id = $1",
      [teamId],
    );
    if (teamRes.rowCount === 0) {
      res.status(404).json({ error: "Équipe introuvable" });
      return;
    }

    const scorersRes = await pool.query(
      `
      SELECT
        s.id,
        s.name AS scorer_name,
        COALESCE(gc.total_goals, 0)::INT AS total_goals
      FROM scorers s
      LEFT JOIN goals_count gc ON gc.scorer_id = s.id
      WHERE s.team_id = $1
      ORDER BY total_goals DESC, s.name ASC
      `,
      [teamId],
    );

    res.json({
      team: teamRes.rows[0],
      scorers: scorersRes.rows,
    });
  } catch (err) {
    console.error("Erreur GET /teams/:id/scorers :", err);
    res.status(500).json({ error: "Erreur serveur sur /teams/:id/scorers" });
  }
});

app.listen(port, () => {
  console.log(`Backend lancé sur http://localhost:${port}`);
});
