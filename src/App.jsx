import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Agendamento from "./pages/Agendamento";
import Cliente from "./pages/Cliente";
import MinhasMarcacoes from "./pages/MinhasMarcacoes";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal (site da Mônica) */}
        <Route path="/" element={<Cliente />} />

        {/* 🔥 ROTA BONITA (NOVA) */}
        <Route path="/espaco-monica" element={<Cliente />} />

        {/* Página opcional */}
        <Route path="/home" element={<Home />} />

        {/* Página de agendamento */}
        <Route path="/agendamento/:serviceId" element={<Agendamento />} />

        {/* Minhas marcações */}
        <Route path="/minhas-marcacoes" element={<MinhasMarcacoes />} />

        {/* ADMIN */}
        <Route path="/gestao-agenda-monica" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}