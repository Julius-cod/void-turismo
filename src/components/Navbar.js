import { Link } from "react-router-dom";

export default function Navbar({ token, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">VOID Tourism</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/pois">POIs</Link></li>
          </ul>

          <div className="d-flex">
            {!token && (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                <Link to="/register" className="btn btn-success">Registar</Link>
              </>
            )}

            {token && (
              <>
                <Link to="/dashboard" className="btn btn-primary me-2">Dashboard</Link>
                <button className="btn btn-danger" onClick={onLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
