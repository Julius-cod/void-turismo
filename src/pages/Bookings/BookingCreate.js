import { useState } from "react";
import api from "../../services/api";
import { authHeader } from "../../services/api";

export default function BookingCreate({ poiId }){
  const [start, setStart] = useState("");

  async function submit(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    if(!token){ alert('Login needed'); return; }
    try {
      await api.post('/bookings', { poi_id: poiId, start_at: start }, { headers: authHeader(token) });
      alert('Reserva criada');
    } catch(e){
      alert('Erro ao criar reserva');
    }
  }

  return (
    <form onSubmit={submit}>
      <input className="form-control mb-2" placeholder="YYYY-MM-DD HH:MM" value={start} onChange={e=>setStart(e.target.value)} />
      <button className="btn btn-success">Reservar</button>
    </form>
  );
}
