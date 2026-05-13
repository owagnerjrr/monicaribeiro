// MinhasMarcacoes.jsx
import { useState } from "react";
import { db } from "../firebase"; // ajuste se necessário
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function MinhasMarcacoes() {
  const [telefone, setTelefone] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);

  const buscarAgendamentos = async () => {
    const snapshot = await getDocs(collection(db, "appointments"));

    const lista = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(a => a.telefone === telefone);

    setAgendamentos(lista);
  };

  const cancelar = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
    buscarAgendamentos();
  };

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h2>Minhas Marcações</h2>

      <input
        placeholder="Digite seu telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "10px",
          width: "100%",
          marginBottom: "10px"
        }}
      />

      <button
        onClick={buscarAgendamentos}
        style={{
          background: "#9333ea",
          color: "#fff",
          padding: "10px",
          borderRadius: "10px",
          width: "100%",
          marginBottom: "20px"
        }}
      >
        Buscar
      </button>

      {agendamentos.length === 0 && <p>Nenhum agendamento encontrado</p>}

      {agendamentos.map((a) => (
        <div
          key={a.id}
          style={{
            background: "#2c1a2e",
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "10px"
          }}
        >
          <p><strong>{a.servico}</strong></p>
          <p>📅 {a.data}</p>
          <p>⏰ {a.hora}</p>

          <button
            onClick={() => cancelar(a.id)}
            style={{
              marginTop: "10px",
              background: "#ef4444",
              color: "#fff",
              padding: "8px",
              borderRadius: "10px",
              width: "100%"
            }}
          >
            Cancelar
          </button>
        </div>
      ))}
    </div>
  );
}