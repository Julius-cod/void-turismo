import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function PoiEdit() {
  const { id } = useParams();
  const [poi, setPoi] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get(`/pois/${id}`)
      .then(r => {
        setPoi(r.data);
        setTitle(r.data.title || "");
        setDescription(r.data.description || "");
      })
      .catch(e => console.error(e));
  }, [id]);

  async function submit(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Login required');
      return;
    }

    const form = new FormData();

    form.append("title", title);
    form.append("description", description);

    if (image) {
      form.append("photo", image);
    }

    // method spoofing (faz PUT via POST)
    form.append("_method", "PUT");

    try {
      await api.post(`/pois/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      nav(`/pois/${id}`);
    } catch (err) {
      alert("Erro ao atualizar");
      console.error(err);
    }
  }

  if (!poi) {
    return <div className="container mt-4">Carregando...</div>;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h3>Editar POI</h3>
      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="file"
          className="form-control mb-3"
          onChange={e => setImage(e.target.files[0])}
        />

        <button className="btn btn-primary">Atualizar</button>
      </form>
    </div>
  );
}
