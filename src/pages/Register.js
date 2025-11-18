import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      await api.post("/register", { name, email, password });
      alert("Conta criada!");
      nav("/login");
    } catch(e){
      alert("Erro ao registar");
    }
  }

  return (
    <div className="container mt-5" style={{maxWidth:"450px"}}>
      <h2>Registar</h2>

      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Nome"
          value={name} onChange={e=>setName(e.target.value)} />

        <input className="form-control mb-2" placeholder="Email"
          value={email} onChange={e=>setEmail(e.target.value)} />

        <input className="form-control mb-2" placeholder="Password" type="password"
          value={password} onChange={e=>setPassword(e.target.value)} />

        <button className="btn btn-success w-100">Criar Conta</button>

        <div className="mt-2">
          <a href="/login">Já tenho conta</a>
        </div>
      </form>
    </div>
  );
}
