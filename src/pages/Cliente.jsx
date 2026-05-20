// Cliente.jsx
import "./cliente.css";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";

import monica from "../assets/monica.jpg";
import logo from "../assets/logo.png";

import ayurvedica from "../assets/ayurvedica.jpg";
import bambu from "../assets/bambu.jpg";
import reflexologia from "../assets/reflexologia.jpg";
import shiatsu from "../assets/shiatsu.jpg";
import terapeutica from "../assets/terapeutica.jpg";
import velas from "../assets/velas.jpg";
import escaldapes from "../assets/escaldapes.jpg";
import desportiva from "../assets/desportiva.jpg";
import relaxante from "../assets/relaxante.jpg";
import drenagemlinfatica from "../assets/drenagemlinfatica.jpg";
import pedrasquentes from "../assets/pedrasquentes.jpg";
import toalhasquentes from "../assets/toalhasquentes.jpg";
import pindaschinesas from "../assets/pindaschinesas.jpg";
import gomagecorporal from "../assets/gomagecorporal.jpg";
import chakrahindu from "../assets/chakrahindu.jpg";
import conehindu from "../assets/conehindu.jpg";
import craniosacral from "../assets/craniosacral.jpg";

/* 🔥 DESCRIÇÕES */
import ayurvedicaDesc from "../assets/ayurvedica-descricao.jpg";
import craniosacralDesc from "../assets/craniosacral-descricao.jpg";
import escaldapesDesc from "../assets/escaldapes-descricao.jpg";
import bambuDesc from "../assets/bambu-descricao.jpg";
import chakrahinduDesc from "../assets/chakrahindu-descricao.jpg";
import conehinduDesc from "../assets/conehindu-descricao.jpg";
import gomageDesc from "../assets/gomage-descricao.jpg";
import pedrasDesc from "../assets/pedrasquentes-descricao.jpg";
import pindasDesc from "../assets/pindaschinesas-descricao.jpg";
import reflexologiaDesc from "../assets/reflexologia-descricao.jpg";
import shiatsuDesc from "../assets/shiatsu-descricao.jpg";
import terapeuticaDesc from "../assets/terapeutica-descricao.jpg";
import toalhasDesc from "../assets/toalhasquentes-descricao.jpg";
import velasDesc from "../assets/velas-descricao.jpg";
import relaxanteDesc from "../assets/relaxante-descricao.jpg";
import desportivaDesc from "../assets/desportiva-descricao.jpg";
import drenagemDesc from "../assets/drenagemlinfatica-descricao.jpg";
/* 🔥 FIM */

const telefone = "5535999134301";

export default function Cliente() {

  const [servicos, setServicos] = useState([]);
  const [bloqueios, setBloqueios] = useState([]);
  const [pausas, setPausas] = useState([]);

  // 🔥 ADICIONADO
  const [agendamentos, setAgendamentos] = useState([]);

  const [descricaoAberta, setDescricaoAberta] = useState(null);

  const [modalAgenda, setModalAgenda] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const [step, setStep] = useState("data");
  const [dataSelecionada, setDataSelecionada] = useState("");

  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [nome, setNome] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");

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

  const formatarDataBR = (data) => {
    const dataNormalizada = normalizarData(data);
    if (!dataNormalizada) return "";

    const [ano, mes, dia] = dataNormalizada.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const horarioParaMinutos = (horario) => {
    const [hora, minuto] = horario.split(":").map(Number);
    return hora * 60 + minuto;
  };

  const horarioEmPausa = (data, horario) => {
    const horarioMinutos = horarioParaMinutos(horario);

    return pausas.some(p => {
      if (normalizarData(p.data) !== data || !p.inicio || !p.fim) return false;

      return horarioMinutos >= horarioParaMinutos(p.inicio) &&
        horarioMinutos < horarioParaMinutos(p.fim);
    });
  };

  const temPausaNoDia = (data) => {
    return pausas.some(p => normalizarData(p.data) === data);
  };

  const gerarHorarios = (data) => {

const dataAtual = new Date(data + "T12:00:00");

const bloqueado = bloqueios.find(b => {
  const inicio = new Date(normalizarData(b.inicio) + "T12:00:00");
  const fim = new Date(normalizarData(b.fim) + "T12:00:00");

  return dataAtual >= inicio && dataAtual <= fim;
});
  if (bloqueado) return [];

  const dia = new Date(data + "T00:00:00").getDay();
  if (dia === 0) return [];

  const inicio = 9;
  const fim = dia === 6 ? 12 : 18;

  const agora = new Date();
  const hoje = dataLocalHoje();

  // 🔥 REGRA DE 2 HORAS
const horaAtual = agora.getHours();
const limite = horaAtual + 2;

  // 🔥 BLOQUEIA DIA COM 5 AGENDAMENTOS
const totalNoDia = agendamentos.filter(a => {
  return normalizarData(a.data) === data;
});

  if (totalNoDia.length >= 5) {
    return [];
  }

  

  const lista = [];

  for (let i = inicio; i < fim; i++) {
    if (data === hoje && i < limite) continue;
    const horaFormatada = `${i.toString().padStart(2, "0")}:00`;

    const jaAgendado = agendamentos.find(a =>
      normalizarData(a.data) === data && a.hora === horaFormatada
    );

    if (jaAgendado) continue;
    if (horarioEmPausa(data, horaFormatada)) continue;

    if (data === hoje && i <= agora.getHours()) continue;

    lista.push(horaFormatada);
  }

  return lista;
      };

  const horariosDisponiveis = dataSelecionada ? gerarHorarios(dataSelecionada) : [];
  const dataSelecionadaBloqueada = dataSelecionada && bloqueios.some(b => {
    const dataAtual = new Date(dataSelecionada + "T12:00:00");
    const inicio = new Date(normalizarData(b.inicio) + "T12:00:00");
    const fim = new Date(normalizarData(b.fim) + "T12:00:00");

    return dataAtual >= inicio && dataAtual <= fim;
  });
  const dataSelecionadaDomingo = dataSelecionada &&
    new Date(dataSelecionada + "T00:00:00").getDay() === 0;
  const totalNoDiaSelecionado = agendamentos.filter(a =>
    normalizarData(a.data) === dataSelecionada
  ).length;
  const mensagemSemHorarios = dataSelecionadaBloqueada || dataSelecionadaDomingo
    ? "Não atenderemos neste dia"
    : totalNoDiaSelecionado >= 5
      ? "Agenda cheia neste dia"
      : temPausaNoDia(dataSelecionada)
        ? "Horário de pausa ou almoço neste dia"
        : "Não há horários disponíveis neste dia";

  // 🔥 PREÇOS TEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "servicos"), (snapshot) => {
      const dadosFirebase = snapshot.docs.map(doc => doc.data());

      const base = [
        { nome: "MASSAGEM AYURVÉDICA", preco: "R$140,00", img: ayurvedica, desc: ayurvedicaDesc },
        { nome: "TERAPIA CRÂNIO SACRAL", preco: "R$135,00", img: craniosacral, desc: craniosacralDesc },
        { nome: "ESCALDA-PÉS", preco: "R$70,00", img: escaldapes, desc: escaldapesDesc },
        { nome: "MASSAGEM COM TOALHAS QUENTES", preco: "R$120,00", img: toalhasquentes, desc: toalhasDesc },
        { nome: "MASSAGEM COM PEDRAS QUENTES", preco: "R$120,00", img: pedrasquentes, desc: pedrasDesc },
        { nome: "MASSAGEM COM PINDAS", preco: "R$135,00", img: pindaschinesas, desc: pindasDesc },
        { nome: "MASSAGEM COM VELAS", preco: "R$135,00", img: velas, desc: velasDesc },
        { nome: "RELAXANTE", preco: "R$110,00", img: relaxante, desc: relaxanteDesc },
        { nome: "BAMBUTERAPIA", preco: "R$120,00", img: bambu, desc: bambuDesc },
        { nome: "DRENAGEM LINFÁTICA", preco: "R$120,00", img: drenagemlinfatica, desc: drenagemDesc },
        { nome: "GOMAGE CORPORAL", preco: "R$110,00", img: gomagecorporal, desc: gomageDesc },
        { nome: "REALINHAMENTO DOS CHAKRAS COM CONE HINDU", preco: "R$125,00", img: chakrahindu, desc: chakrahinduDesc },
        { nome: "TERAPÊUTICA", preco: "R$145,00", img: terapeutica, desc: terapeuticaDesc },
        { nome: "SHIATSU", preco: "R$130,00", img: shiatsu, desc: shiatsuDesc },
        { nome: "DESPORTIVA", preco: "R$145,00", img: desportiva, desc: desportivaDesc },
        { nome: "CONE HINDU", preco: "R$115,00", img: conehindu, desc: conehinduDesc },
        { nome: "REFLEXOLOGIA", preco: "R$80,00", img: reflexologia, desc: reflexologiaDesc },
      ];

      const final = base.map(b => {
        const encontrado = dadosFirebase.find(f => f.nome === b.nome);
        return {
          ...b,
          preco: encontrado ? encontrado.preco : b.preco
        };
      });

      setServicos(final);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 BLOQUEIOS TEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bloqueios"), (snapshot) => {
      setBloqueios(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pausas"), (snapshot) => {
      setPausas(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  // 🔥 ADICIONADO (escuta agendamentos)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "appointments"), (snapshot) => {
      setAgendamentos(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  const salvarAgendamento = async () => {
    const snapshot = await getDocs(collection(db, "appointments"));
    const lista = snapshot.docs.map(doc => doc.data());

    const jaExiste = lista.find(a =>
      normalizarData(a.data) === dataSelecionada && a.hora === horarioSelecionado
    );

    if (jaExiste) {
      alert("Esse horário já foi reservado. Escolha outro.");
      return false;
    }

    const totalNoDia = lista.filter(a =>
  normalizarData(a.data) === dataSelecionada
);

if (totalNoDia.length >= 5) {
  alert("Limite de atendimentos atingido para este dia.");
  return false;
}

    await addDoc(collection(db, "appointments"), {
      nome,
      telefone: telefoneCliente,
      servico: servicoSelecionado.nome,
      preco: servicoSelecionado.preco,
      data: formatarDataBR(dataSelecionada),
      hora: horarioSelecionado,
      criadoEm: new Date()
    });

    return true;
  };

  return (
    <div className="pagina">

      <section className="hero">
        <div className="hero-esquerda">
          <h1>ESPAÇO MÔNICA <br /> RIBEIRO</h1>
          <p className="subtitulo">Beleza, cuidado e bem-estar</p>
        </div>

        <div className="hero-centro">
          <img src={logo} alt="Logo" className="logo-grande" />
        </div>

        <div className="hero-direita">
          <img src={monica} alt="Monica" className="foto-monica" />
        </div>
      </section>

      <section className="servicos-container">
        <video className="video-bg" autoPlay muted loop>
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <div className="servicos">
          {servicos.map((s, i) => (
            <div key={i} className="bloco">
              <h3>{s.nome}:</h3>
              <p>{s.preco}</p>
              {s.img && <img src={s.img} alt={s.nome} className="img-servico" />}

              <div className="botoes-servico">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setServicoSelecionado(s);
                    setModalAgenda(true);
                    setStep("data");
                    setDataSelecionada("");
                    setNome("");
                    setTelefoneCliente("");
                    setHorarioSelecionado("");
                  }}
                  className="btn-agendar-servico"
                >
                  Agenda
                </a>

                <button className="btn-descricao" onClick={() => setDescricaoAberta(i)}>
                  Descrição
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {descricaoAberta !== null && (
        <div className="modal-overlay" onClick={() => setDescricaoAberta(null)}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <img src={servicos[descricaoAberta].desc} className="modal-img" />
            <button className="modal-fechar" onClick={() => setDescricaoAberta(null)}>✕</button>
          </div>
        </div>
      )}

      {modalAgenda && (
        <div className="modal-overlay" onClick={() => setModalAgenda(false)}>
          <div
            className="modal-conteudo"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #2c1a2e, #4b2c52)",
              color: "#fff",
              borderRadius: "20px",
              padding: "25px",
              maxWidth: "350px",
              width: "90%",
              boxShadow: "0 0 25px rgba(0,0,0,0.6)"
            }}
          >

            <h3 style={{ textAlign: "center" }}>{servicoSelecionado?.nome}</h3>

            {step === "data" && (
              <div style={{ textAlign: "center" }}>
                <h2>Escolha uma data</h2>
<div 
style={{ 
  display: "flex", 
  justifyContent: "center", 
  marginTop: "10px", 
  marginBottom: "15px",
   }}
   
   >
  <button
    onClick={() => window.location.href = "/minhas-marcacoes"}
    style={{
      background: "#9b59b6",
  color: "#fff",
  padding: "12px 30px",
  borderRadius: "30px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
  width: "220px"
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = "scale(1.05)";
      e.target.style.background = "linear-gradient(135deg, #9b59b6, ##9b59b6)";
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(1)";
      e.target.style.background = "linear-gradient(135deg, #d4af37, #b8962e)";
    }}
  >
    Meus agendamentos
  </button>
</div>
                <input
                  type="date"
                  min={dataLocalHoje()}
                  value={dataSelecionada}
                  onChange={(e) => {
                    setDataSelecionada(e.target.value);
                    setHorarioSelecionado("");
                  }}
                  style={{ padding: "10px", borderRadius: "10px", width: "100%", margin: "10px 0" }}
                />

                <button
                  onClick={() => setStep("horario")}
                  disabled={!dataSelecionada}
                  style={{ background: "#a855f7", color: "#fff", padding: "10px", borderRadius: "10px", width: "100%" }}
                >
                  Continuar
                </button>
              </div>
            )}

            {step === "horario" && (
              <div style={{ textAlign: "center" }}>
                {horariosDisponiveis.length === 0 ? (
                  <p>{mensagemSemHorarios}</p>
                ) : (
                  <>
                    <p>Escolha um horário:</p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                     {!horarioSelecionado && horariosDisponiveis.map((h, i) => (
                        
                        <button
                          key={i}
                          style={{ padding: "10px", borderRadius: "10px", background: "#9333ea", color: "#fff" }}
                          onClick={() => setHorarioSelecionado(h)}
                        >
                          {h}
                        </button>
                      ))}
                    </div>

                    {horarioSelecionado && (
                      <div style={{ marginTop: "15px" }}>
                        <input
                          placeholder="Nome completo"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "10px", marginBottom: "10px" }}
                        />

                        <input
                          placeholder="Telefone"
                          value={telefoneCliente}
                          onChange={(e) => setTelefoneCliente(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "10px", marginBottom: "10px" }}
                        />

                        <button
                          disabled={!nome || !telefoneCliente}
                          onClick={async () => {
                            const sucesso = await salvarAgendamento();
                            if (!sucesso) return;

                            const mensagem = `Olá, me chamo ${nome}
📞 ${telefoneCliente}
🧘 Serviço: ${servicoSelecionado.nome}
💰 Valor: ${servicoSelecionado.preco}
📅 Data: ${formatarDataBR(dataSelecionada)}
⏰ Horário: ${horarioSelecionado}

Estou ciente que o agendamento será confirmado após pagamento de 50%.`;

const msg = encodeURIComponent(mensagem);

window.location.href = `https://api.whatsapp.com/send?phone=${telefone}&text=${msg}`;
                          }}
                          style={{
                            background: "#22c55e",
                            color: "#fff",
                            padding: "10px",
                            borderRadius: "10px",
                            width: "100%",
                            fontWeight: "bold"
                          }}
                        >
                          Confirmar e ir para WhatsApp
                        </button>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() => setStep("data")}
                  style={{ marginTop: "10px", background: "#444", color: "#fff", padding: "8px", borderRadius: "10px", width: "100%" }}
                >
                  Voltar
                </button>
              </div>
            )}

            <button className="modal-fechar" onClick={() => setModalAgenda(false)}>✕</button>

          </div>
        </div>
      )}

      <section className="infos">
        <div className="coluna">

          <div className="coluna-esquerda">
            <h3>NOSSO ESPAÇO:</h3>

            <div className="icones">
              
              <a
                href="https://www.google.com/maps/place/R.+S%C3%A3o+Francisco,+30+-+S%C3%A3o+Benedito,+Po%C3%A7os+de+Caldas+-+MG,+37701-455"
                target="_blank"
                rel="noreferrer"
                className="icone-mapa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#e74c3c" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
                </svg>
              </a>

              <a href="mailto:monicamfribeiro40@gmail.com" className="icone-email">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#9b59b6" viewBox="0 0 24 24">
                  <path d="M2 4h20v16H2V4zm10 7L3 6v12h18V6l-9 5z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/monicaribeirotermalista"
                target="_blank"
                rel="noreferrer"
                className="icone-instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="#E1306C">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zm9.5 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                </svg>
              </a>

            </div>

            <div className="endereco-box">
              <p>📍 Rua São Francisco, Nº 30</p>
              <p>🔔 Interfone 5</p>
              <p>🏙️ Bairro São Benedito</p>
              <p>📌 Poços de Caldas</p>
            </div>
          </div>

          <div className="coluna-direita">
            <h3>FORMAS DE PAGAMENTO:</h3>
            <ul>
              <li>Cartões de crédito e débito</li>
              <li>Pix</li>
              <li>Dinheiro</li>
            </ul>
          </div>

        </div>

        <div className="coluna atendimento"></div>
      </section>

    </div>
  );

  }
