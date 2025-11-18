import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <p>Escolhe uma funcionalidade:</p>

      <div className="list-group">
        <Link to="/pois" className="list-group-item list-group-item-action">POIs</Link>
        <Link to="/bookings" className="list-group-item list-group-item-action">Minhas Reservas</Link>
      </div>
    </div>
  );
}
