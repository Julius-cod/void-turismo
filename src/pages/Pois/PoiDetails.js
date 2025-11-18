import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, Link } from "react-router-dom";
import ReviewSection from "../Reviews/ReviewSection";

export default function PoiDetails(){
  const { id } = useParams();
  const [poi,setPoi] = useState(null);

  useEffect(()=>{
    api.get(`/pois/${id}`).then(r => setPoi(r.data)).catch(e => console.error(e));
  },[id]);

  if(!poi) return <div className="container mt-4">Carregando...</div>;

  const img = poi.photo ? `http://127.0.0.1:8000/storage/${poi.photo}` : null;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3">
            {img && <img src={img} className="card-img-top" alt={poi.title} />}
            <div className="card-body">
              <h3>{poi.title}</h3>
              <p className="small-muted">{poi.address}</p>
              <p>{poi.description}</p>

              <div className="d-flex gap-2">
                <Link to={`/pois/${poi.id}/edit`} className="btn btn-outline-primary btn-sm">Editar</Link>
                <Link to="/bookings" className="btn btn-success btn-sm">Reservar visita</Link>
              </div>
            </div>
          </div>

          <ReviewSection poi={poi} />
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Info</h5>
            <p><b>Categoria:</b> {poi.category}</p>
            <p><b>Latitude:</b> {poi.latitude}</p>
            <p><b>Longitude:</b> {poi.longitude}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
