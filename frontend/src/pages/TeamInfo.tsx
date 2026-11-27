import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./TeamInfo.css";

type Team = {
  id: number;
  name: string;
  short_name: string;
};

type Scorer = {
  id: number;
  scorer_name: string;
  total_goals: number;
};

export default function TeamInfo() {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadTeamInfo() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`http://localhost:3010/teams/${id}/scorers`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTeam(data.team);
        setScorers((data.scorers as Scorer[]).slice(0, 10));
      } catch {
        setError("Impossible de charger les buteurs de cette équipe.");
      } finally {
        setLoading(false);
      }
    }

    loadTeamInfo();
  }, [id]);

  if (loading) {
    return <p className="team-info-status">Chargement...</p>;
  }

  if (error) {
    return (
      <div className="team-info-page">
        <p className="team-info-status team-info-status--error">{error}</p>
        <Link to="/allTeams" className="back-link">
          Retour aux équipes
        </Link>
      </div>
    );
  }

  return (
    <main className="team-info-page">
      <Link to="/allTeams" className="back-link">
        Retour aux équipes
      </Link>

      {team && (
        <header className="team-info-header">
          <h1>
            {team.name}
            <span className="team-short-badge">{team.short_name}</span> — Top 10
            des buteurs
          </h1>
        </header>
      )}

      {scorers.length === 0 ? (
        <p className="team-info-status">
          Aucun buteur enregistré pour cette équipe.
        </p>
      ) : (
        <ul className="scorers-list">
          {scorers.map((scorer, index) => (
            <li key={scorer.id} className="scorer-item">
              <span className="scorer-left">
                <span className="scorer-rank">{index + 1}</span>
                <span className="scorer-name">{scorer.scorer_name}</span>
              </span>
              <span className="scorer-goals">{scorer.total_goals} buts</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
