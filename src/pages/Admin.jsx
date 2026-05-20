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

const dataLocalHoje = () => {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

const normalizarData = (data) => {
  if (!data) return "";

  if (data.includes("/")) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }

  return data.split("T")[0];
};

const formatarData = (data) => {
  const dataNormalizada = normalizarData(data);
  if (!dataNormalizada) return "";

  const [ano, mes, dia] = dataNormalizada.split("-");
  return `${dia}/${mes}/${ano}`;
};

export default function Admin() {

  const [agendamentos, setAgendamentos] = useState([]);
  const [bloqueios, setBloqueios] = useState([]);
  const [pausas, setPausas] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [pausaData, setPausaData] = useState("");
  const [pausaInicio, setPausaInicio] = useState("");
  const [pausaFim, setPausaFim] = useState("");
  const [pausaMotivo, setPausaMotivo] = useState("Almoço");

  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [novoPreco, setNovoPreco] = useState("");

  useEffect(() => {

    const unsub1 = onSnapshot(collection(db, "appointments"), (snap) => {
      const hoje = dataLocalHoje();
      const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const agendamentosAtuais = lista.filter(a => normalizarData(a.data) >= hoje);
      const agendamentosPassados = lista.filter(a => {
        const data = normalizarData(a.data);
        return data && data < hoje;
      });

      setAgendamentos(agendamentosAtuais);

      if (agendamentosPassados.length > 0) {
        Promise.all(
          agendamentosPassados.map(a => deleteDoc(doc(db, "appointments", a.id)))
        ).catch((error) => {
          console.error("Erro ao apagar agendamentos passados:", error);
        });
      }
    });

    const unsub2 = onSnapshot(collection(db, "bloqueios"), (snap) => {
      setBloqueios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsub3 = onSnapshot(collection(db, "pausas"), (snap) => {
      setPausas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsub4 = onSnapshot(collection(db, "servicos"), (snap) => {
      setServicos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };

  }, []);

  // 🔥 ORDENAR DATAS
  const datasOrdenadas = Object.keys(
    agendamentos.reduce((acc, item) => {
      const data = normalizarData(item.data);
      if (!acc[data]) acc[data] = [];
      acc[data].push(item);
      return acc;
    }, {})
  ).sort((a, b) => new Date(a + "T12:00:00") - new Date(b + "T12:00:00"));

  // 🔥 AGRUPAR POR DATA
  const agendamentosPorData = agendamentos.reduce((acc, item) => {
    const data = normalizarData(item.data);
    if (!acc[data]) acc[data] = [];
    acc[data].push(item);
    return acc;
  }, {});

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
      inicio: formatarData(dataInicio),
      fim: formatarData(dataFim)
    });

    setDataInicio("");
    setDataFim("");
  };

  const removerBloqueio = async (id) => {
    await deleteDoc(doc(db, "bloqueios", id));
  };

  const adicionarPausa = async () => {
    if (!pausaData || !pausaInicio || !pausaFim) return;

    await addDoc(collection(db, "pausas"), {
      data: formatarData(pausaData),
      inicio: pausaInicio,
      fim: pausaFim,
      motivo: pausaMotivo || "Pausa"
    });

    setPausaData("");
    setPausaInicio("");
    setPausaFim("");
    setPausaMotivo("Almoço");
  };

  const removerPausa = async (id) => {
    await deleteDoc(doc(db, "pausas", id));
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

        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
          color: "#fff",
          width: "100%",
          position: "relative",
          zIndex: 10
        }}>

          <h1 style={{
            textAlign: "center",
            marginBottom: "30px",
            background: "rgba(0, 0, 0, 0.65)",
            padding: "15px",
            borderRadius: "15px",
            backdropFilter: "blur(6px)"
          }}>
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

          {/* 🔥 AGORA ORDENADO + FORMATADO */}
          {datasOrdenadas.map((data) => (
            <div key={data}>

              <h3 style={{
                background: "#ccc",
                color: "#000",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "15px"
              }}>
                📅 {formatarData(data)}
              </h3>

              {agendamentosPorData[data].map(a => (
                <div key={a.id} style={{
                  background: "rgba(44, 26, 46, 0.95)",
                  padding: "20px",
                  borderRadius: "20px",
                  marginBottom: "10px"
                }}>
                  <p><strong>{a.servico}</strong></p>
                  <p>💰 {a.preco}</p>
                  <p>⏰ {a.hora}</p>
                  <p>👤 {a.nome}</p>

                  <div style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px"
                  }}>
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

            </div>
          ))}

          {/* BLOQUEIOS */}
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
              justifyContent: "space-between"
            }}>
              <span>🚫 {formatarData(b.inicio)} até {formatarData(b.fim)}</span>

              <button onClick={() => removerBloqueio(b.id)} style={{
                background: "#ef4444",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "8px"
              }}>
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
            Pausa do dia
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "10px",
            marginBottom: "15px",
            background: "rgba(0,0,0,0.7)",
            padding: "15px",
            borderRadius: "15px"
          }}>
            <input type="date" value={pausaData} onChange={(e) => setPausaData(e.target.value)} style={{ padding: "12px", borderRadius: "10px" }} />
            <input type="time" value={pausaInicio} onChange={(e) => setPausaInicio(e.target.value)} style={{ padding: "12px", borderRadius: "10px" }} />
            <input type="time" value={pausaFim} onChange={(e) => setPausaFim(e.target.value)} style={{ padding: "12px", borderRadius: "10px" }} />
            <input placeholder="Motivo" value={pausaMotivo} onChange={(e) => setPausaMotivo(e.target.value)} style={{ padding: "12px", borderRadius: "10px" }} />

            <button onClick={adicionarPausa} style={{
              background: "#38bdf8",
              padding: "12px",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: "bold"
            }}>
              Adicionar pausa
            </button>
          </div>

          {pausas.map(p => (
            <div key={p.id} style={{
              background: "rgba(20, 60, 80, 0.9)",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px"
            }}>
              <span>⏸ {formatarData(p.data)} - {p.inicio} até {p.fim} ({p.motivo || "Pausa"})</span>

              <button onClick={() => removerPausa(p.id)} style={{
                background: "#ef4444",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "8px"
              }}>
                Remover
              </button>
            </div>
          ))}

          {/* PREÇOS */}
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
              placeholder="Novo preço"
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
