import { useEffect, useState } from "react";
import "./App.css";

type Scorer = {
  id: number;
  scorer_name: string;
  team_name: string;
  short_name: string;
  total_goals: number;
};

export default function App() {
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScorers = async () => {
      try {
        const response = await fetch("http://localhost:3001/scorers");
        if (!response.ok) {
          throw new Error("Erreur lors de la réponse du serveur");
        }
        const data: Scorer[] = await response.json();
        setScorers(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les buteurs depuis l'API.");
      } finally {
        setLoading(false);
      }
    };

    fetchScorers();
  }, []);

  if (loading) {
    return <p className="status-message">Chargement des buteurs...</p>;
  }

  if (error) {
    return <p className="status-message status-message--error">{error}</p>;
  }

  return (
    <main className="page">
      <h1 className="page-title">Classement des buteurs — Premier League</h1>

      <table className="scorers-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Buteur</th>
            <th>Équipe</th>
            <th className="goals-col">Buts</th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((scorer, index) => (
            <tr key={scorer.id}>
              <td>{index + 1}</td>
              <td className="scorer-name">{scorer.scorer_name}</td>
              <td>
                <span className="team-badge">{scorer.short_name}</span>
                {scorer.team_name}
              </td>
              <td className="goals-cell">{scorer.total_goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
