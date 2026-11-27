import { Link, NavLink } from "react-router-dom";
import plLogo from "../components/Premier-League.png";
import "./Header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/allTeams" className="app-header__brand">
          <img
            src={plLogo}
            alt="Logo Premier League"
            className="app-header__logo"
          />
          <span>Premier League Stats</span>
        </Link>

        <nav className="app-header__nav" aria-label="Navigation principale">
          <NavLink
            to="/allTeams"
            className={({ isActive }) =>
              `app-header__link ${isActive ? "app-header__link--active" : ""}`
            }
          >
            Équipes
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
