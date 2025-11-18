import { Link } from "react-router-dom";

export default function PoiCard({ poi }) {
  const img = poi.photo ? `http://127.0.0.1:8000/storage/${poi.photo}` : null;
  return (
    <div className="card mb-3">
      {img && <img src={img} className="card-img-top" alt={poi.title} />}
      <div className="card-body">
        <h5 className="card-title">{poi.title}</h5>
        <p className="small-muted">{poi.address}</p>
        <p className="card-text">{poi.description?.slice(0, 120)}</p>
        <Link to={`/pois/${poi.id}`} className="btn btn-sm btn-primary">Ver</Link>
      </div>
    </div>
  );
}
