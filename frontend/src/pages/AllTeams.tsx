import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AllTeams.css";

type Team = {
  id: number;
  name: string;
  short_name: string;
  total_goals: number;
};

export default function AllTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [top10Only, setTop10Only] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTeams() {
      try {
        const res = await fetch("http://localhost:3010/teams");
        if (!res.ok) throw new Error();
        const data: Team[] = await res.json();
        setTeams(data);
      } catch {
        setError("Impossible de charger les équipes.");
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, []);

  if (loading) {
    return <p className="teams-status">Chargement...</p>;
  }

  if (error) {
    return <p className="teams-status teams-status--error">{error}</p>;
  }

  const displayedTeams = top10Only ? teams.slice(0, 10) : teams;

  return (
    <main className="teams-page">
      <header className="teams-header">
        <div className="teams-header-row">
          <div>
            <h1>{top10Only ? "Top 10 des équipes" : "Toutes les équipes"}</h1>
            <p className="teams-subtitle">
              {displayedTeams.length} club{displayedTeams.length > 1 ? "s" : ""}{" "}
              affiché
              {displayedTeams.length > 1 ? "s" : ""} — cliquez sur une équipe
              pour voir ses buteurs.
            </p>
          </div>

          <button
            type="button"
            className={`top10-btn ${top10Only ? "top10-btn--active" : ""}`}
            onClick={() => setTop10Only((prev) => !prev)}
          >
            {top10Only ? "Afficher toutes les équipes" : "Top 10 équipes"}
          </button>
        </div>
      </header>

      <ul className="teams-list">
        {displayedTeams.map((team, index) => (
          <li key={team.id}>
            <Link to={`/teamInfo/${team.id}`} className="team-item-link">
              <span className="team-main">
                <span className="team-rank">#{index + 1}</span>
                <span className="team-name">{team.name}</span>
                <span className="team-short">{team.short_name}</span>
              </span>
              <span className="team-goals">{team.total_goals} buts</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
