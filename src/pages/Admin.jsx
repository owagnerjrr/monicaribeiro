// Admin.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  onSnapshot
} from "firebase/firestore";

export default function Admin() {

  const [agendamentos, setAgendamentos] = useState([]);
  const [bloqueios, setBloqueios] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [novoPreco, setNovoPreco] = useState("");

  useEffect(() => {

    const unsub1 = onSnapshot(collection(db, "appointments"), (snap) => {
      setAgendamentos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsub2 = onSnapshot(collection(db, "bloqueios"), (snap) => {
      setBloqueios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsub3 = onSnapshot(collection(db, "servicos"), (snap) => {
      setServicos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };

  }, []);

  const excluir = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
  };

  const editarHorario = async (id) => {
    const novoHorario = prompt("Novo horário:");
    if (!novoHorario) return;

    await updateDoc(doc(db, "appointments", id), {
      hora: novoHorario
    });
  };

  const bloquearPeriodo = async () => {
    if (!dataInicio || !dataFim) return;

    await addDoc(collection(db, "bloqueios"), {
      inicio: dataInicio,
      fim: dataFim
    });

    setDataInicio("");
    setDataFim("");
  };

  const removerBloqueio = async (id) => {
    await deleteDoc(doc(db, "bloqueios", id));
  };

  const alterarPreco = async (id, preco) => {
    if (!id || !preco) return;

    await updateDoc(doc(db, "servicos", id), {
      preco
    });

    setNovoPreco("");
    setServicoSelecionado("");
  };

  return (
    <div className="pagina">

      <section className="servicos-container">
        <video className="video-bg" autoPlay muted loop>
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "20px",
            color: "#fff",
            width: "100%",
            position: "relative",
            zIndex: 10
          }}
        >

          <h1
            style={{
              textAlign: "center",
              marginBottom: "30px",
              background: "rgba(0, 0, 0, 0.65)",
              padding: "15px",
              borderRadius: "15px",
              backdropFilter: "blur(6px)"
            }}
          >
            Administração
          </h1>

          <h2 style={{
            background: "rgba(0,0,0,0.6)",
            padding: "8px 12px",
            borderRadius: "10px",
            display: "inline-block"
          }}>
            Agendamentos
          </h2>

          {agendamentos.map(a => (
            <div key={a.id} style={{
              background: "rgba(44, 26, 46, 0.95)",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "15px"
            }}>
              <p><strong>{a.servico}</strong></p>
              <p>💰 {a.preco}</p>
              <p>📅 {a.data}</p>
              <p>⏰ {a.hora}</p>
              <p>👤 {a.nome}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => editarHorario(a.id)} style={{
                  background: "#9333ea",
                  padding: "10px",
                  borderRadius: "10px",
                  color: "#fff",
                  flex: 1
                }}>
                  Editar
                </button>

                <button onClick={() => excluir(a.id)} style={{
                  background: "#ef4444",
                  padding: "10px",
                  borderRadius: "10px",
                  color: "#fff",
                  flex: 1
                }}>
                  Excluir
                </button>
              </div>
            </div>
          ))}

          <h2 style={{
            marginTop: "30px",
            background: "rgba(0,0,0,0.6)",
            padding: "8px 12px",
            borderRadius: "10px",
            display: "inline-block"
          }}>
            Bloquear período
          </h2>

          <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            background: "rgba(0,0,0,0.7)",
            padding: "15px",
            borderRadius: "15px"
          }}>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} style={{ padding: "12px", borderRadius: "10px", flex: 1 }} />
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} style={{ padding: "12px", borderRadius: "10px", flex: 1 }} />

            <button onClick={bloquearPeriodo} style={{
              background: "#facc15",
              padding: "12px",
              borderRadius: "10px"
            }}>
              Bloquear
            </button>
          </div>

          {bloqueios.map(b => (
            <div key={b.id} style={{
              background: "rgba(60, 20, 60, 0.9)",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>🚫 {b.inicio} até {b.fim}</span>

              <button
                onClick={() => removerBloqueio(b.id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Remover
              </button>
            </div>
          ))}

          <h2 style={{
            marginTop: "30px",
            background: "rgba(0,0,0,0.6)",
            padding: "8px 12px",
            borderRadius: "10px",
            display: "inline-block"
          }}>
            Alterar preços
          </h2>

          <div style={{
            background: "rgba(44, 26, 46, 0.95)",
            padding: "20px",
            borderRadius: "15px",
            marginTop: "10px"
          }}>
            <select
              value={servicoSelecionado}
              onChange={(e) => setServicoSelecionado(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                width: "100%",
                marginBottom: "10px"
              }}
            >
              <option value="">Selecione o serviço</option>
              {servicos.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>

            <input
              placeholder="Novo preço (ex: R$150,00)"
              value={novoPreco}
              onChange={(e) => setNovoPreco(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                width: "100%",
                marginBottom: "10px"
              }}
            />

            <button
              onClick={() => alterarPreco(servicoSelecionado, novoPreco)}
              style={{
                background: "#22c55e",
                color: "#fff",
                padding: "12px",
                borderRadius: "10px",
                width: "100%"
              }}
            >
              Atualizar
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}