import { useEffect, useState } from "react";
import api from "../../services/api";
import { authHeader } from "../../services/api";

export default function MyBookings(){
  const [bookings, setBookings] = useState([]);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token) return;
    api.get('/bookings', { headers: authHeader(token) }).then(r => setBookings(r.data)).catch(e => console.error(e));
  },[]);

  return (
    <div className="container mt-4">
      <h3>Minhas Reservas</h3>
      {bookings.length === 0 && <div>Nenhuma reserva.</div>}
      {bookings.map(b => (
        <div key={b.id} className="card mb-2 p-2">
          <div><b>{b.poi?.title || 'POI #' + b.poi_id}</b></div>
          <div className="small-muted">Início: {b.start_at}</div>
          <div className="small-muted">Status: {b.status}</div>
        </div>
      ))}
    </div>
  );
}
