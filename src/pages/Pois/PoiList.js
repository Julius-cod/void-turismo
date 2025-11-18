import { useEffect, useState } from "react";
import api from "../../services/api";
import PoiCard from "../../components/PoiCard";
import { Link } from "react-router-dom";

export default function PoiList(){
  const [pois, setPois] = useState([]);

  useEffect(()=>{
    api.get('/pois').then(res => {
      const list = res.data?.data || res.data;
      setPois(list);
    }).catch(e => console.error(e));
  },[]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>POIs</h2>
        <Link to="/pois/create" className="btn btn-success">Criar POI</Link>
      </div>

      {pois.length === 0 && <div>Nenhum POI encontrado.</div>}
      {pois.map(p => <PoiCard key={p.id} poi={p} />)}
    </div>
  );
}
