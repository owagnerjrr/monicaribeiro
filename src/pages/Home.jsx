import ServiceCard from "../components/ServiceCard";

const services = [
  {
    id: "limpeza_pele",
    nome: "Limpeza de Pele",
    preco: 200,
  },
  {
    id: "massagem",
    nome: "Massagem Relaxante",
    preco: 150,
  },
];

export default function Home() {
  return (
    <div className="container">
      <h1>Espaço Monica Ribeiro</h1>
      <p>Beleza, cuidado e bem-estar</p>

      <div className="grid">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}