import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });

      if(res.data?.token){
        localStorage.setItem("token", res.data.token);
        nav("/dashboard");
      } else {
        alert("Credenciais inválidas");
      }
    } catch(e){
      alert("Erro de login");
    }
  }

  return (
    <div className="container mt-5" style={{maxWidth:"450px"}}>
      <h2>Login</h2>

      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Email"
          value={email} onChange={e=>setEmail(e.target.value)} />

        <input className="form-control mb-2" placeholder="Password" type="password"
          value={password} onChange={e=>setPassword(e.target.value)} />

        <button className="btn btn-primary w-100">Entrar</button>

        <div className="mt-2">
          <a href="/register">Criar Conta</a>
        </div>
      </form>
    </div>
  );
}
