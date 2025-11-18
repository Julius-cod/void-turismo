import { useState } from "react";
import api from "../../services/api";
import { authHeader } from "../../services/api";

export default function ReviewSection({ poi }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function addReview(){
    const token = localStorage.getItem('token');
    if(!token){ alert('Login necessário'); return; }
    try {
      await api.post('/reviews', { poi_id: poi.id, rating, comment }, { headers: authHeader(token) });
      alert('Review adicionada — recarrega a página para ver');
      setComment('');
    } catch (e) {
      alert('Erro ao adicionar review');
      console.error(e);
    }
  }

  return (
    <div className="mt-4">
      <h5>Avaliações</h5>

      <div className="mb-3">
        <select className="form-select mb-2" value={rating} onChange={e=>setRating(e.target.value)}>
          <option value={5}>5</option>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
        </select>
        <textarea className="form-control mb-2" placeholder="Deixa um comentário" value={comment} onChange={e=>setComment(e.target.value)} />
        <button className="btn btn-primary" onClick={addReview}>Enviar avaliação</button>
      </div>

      <div>
        {poi.reviews?.length === 0 && <div>Nenhuma avaliação ainda.</div>}
        {poi.reviews?.map(r => (
          <div key={r.id} className="border p-2 mb-2">
            <div><b>{r.rating} ★</b> — {r.comment}</div>
            <div className="small-muted">por user {r.user_id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
