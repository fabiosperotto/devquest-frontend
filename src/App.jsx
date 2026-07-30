import { useEffect, useState } from 'react';
import { api } from './api/api';
import HeroForm from './components/HeroForm';
import HeroCard from './components/HeroCard';

export default function App() {
  const [herois, setHerois] = useState([]);
  const [skills, setSkills] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    try {
      const [heroisApi, skillsApi] = await Promise.all([
        api.listarHerois(),
        api.listarSkills(),
      ]);
      setHerois(heroisApi);
      setSkills(skillsApi);
      setErro(null);
    } catch (e) {
      setErro('Não foi possível conectar à API. Ela está rodando em http://localhost:3001?');
    } finally {
      setCarregando(false);
    }
  }

  function handleHeroiCriado(novoHeroi) {
    setHerois((atuais) => [{ ...novoHeroi, skills: [] }, ...atuais]);
  }

  function handleHeroiAtualizado(heroiAtualizado) {
    setHerois((atuais) => atuais.map((h) => (h.id === heroiAtualizado.id ? heroiAtualizado : h)));
  }

  async function handleRemover(id) {
    if (!confirm('Remover este herói da guilda?')) return;
    await api.removerHeroi(id);
    setHerois((atuais) => atuais.filter((h) => h.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ DevQuest</h1>
        <p>A Guilda dos Desenvolvedores — Curso Técnico em Desenvolvimento de Sistemas</p>
      </header>

      {erro && <div className="alerta-erro">{erro}</div>}

      <main className="app-conteudo">
        <HeroForm aoCriar={handleHeroiCriado} />

        <section className="lista-herois">
          <h2>Membros da Guilda</h2>
          {carregando && <p>Carregando aventureiros...</p>}
          {!carregando && herois.length === 0 && <p>Nenhum herói cadastrado ainda. Seja o primeiro!</p>}

          <div className="grade-herois">
            {herois.map((heroi) => (
              <HeroCard
                key={heroi.id}
                heroi={heroi}
                todasSkills={skills}
                aoAtualizar={handleHeroiAtualizado}
                aoRemover={handleRemover}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
