import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function PoiCreate(){
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    const token = localStorage.getItem("token");
    if(!token){ alert('Faz login'); return; }

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("category", category);
    if(image) form.append("photo", image);

    try {
      await api.post("/pois", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      nav('/pois');
    } catch(err){
      alert('Erro ao criar POI');
      console.error(err);
    }
  }

  return (
    <div className="container mt-4" style={{maxWidth:700}}>
      <h3>Criar POI</h3>
      <form onSubmit={submit}>
        <input className="form-control mb-2"
               placeholder="Título"
               value={title}
               onChange={e=>setTitle(e.target.value)}
               required />

        <textarea className="form-control mb-2"
                  placeholder="Descrição"
                  value={description}
                  onChange={e=>setDescription(e.target.value)} />

        <select className="form-control mb-2"
                value={category}
                onChange={e=>setCategory(e.target.value)}
                required>
          <option value="">Selecione a categoria</option>
          <option value="historical">Histórico</option>
          <option value="hotel">Hotel</option>
          <option value="restaurant">Restaurante</option>
          <option value="school">Escola</option>
        </select>

        <input type="file"
               className="form-control mb-3"
               onChange={e=>setImage(e.target.files[0])} />

        <button className="btn btn-success">Salvar</button>
      </form>
    </div>
  );
}
