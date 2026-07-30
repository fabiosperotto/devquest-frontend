import { useState } from 'react';
import { api } from '../api/api';

export default function HeroCard({ heroi, todasSkills, aoAtualizar, aoRemover }) {
  const [conselho, setConselho] = useState(null);
  const [consultando, setConsultando] = useState(false);

  const skillsDesbloqueadas = new Set(heroi.skills.map((s) => s.id));
  const proximaSkill = todasSkills.find((s) => !skillsDesbloqueadas.has(s.id));

  async function handleDesbloquear() {
    try {
      const heroiAtualizado = await api.desbloquearSkill(heroi.id, proximaSkill.id);
      aoAtualizar(heroiAtualizado);
      setConselho(null);
    } catch (erro) {
      alert(erro.message);
    }
  }

  async function handleOraculo() {
    setConsultando(true);
    try {
      const resposta = await api.consultarOraculo(heroi.id);
      setConselho(resposta.conselho);
    } catch (erro) {
      alert(erro.message);
    } finally {
      setConsultando(false);
    }
  }

  return (
    <div className="hero-card">
      <div className="hero-card-topo">
        <span className="hero-avatar">{heroi.avatarEmoji}</span>
        <div>
          <h3>{heroi.nome}</h3>
          <span className="hero-classe">{heroi.classe}</span>
        </div>
        <button className="botao-remover" onClick={() => aoRemover(heroi.id)} title="Remover">✕</button>
      </div>

      <div className="hero-stats">
        <span>Nível {heroi.nivel}</span>
        <span>{heroi.xp} XP</span>
      </div>

      <div className="hero-skills">
        {heroi.skills.length === 0 && <p className="vazio">Nenhuma skill desbloqueada ainda.</p>}
        {heroi.skills.map((skill) => (
          <span key={skill.id} className="skill-badge" title={skill.descricao}>
            {skill.icone} {skill.nome}
          </span>
        ))}
      </div>

      {proximaSkill ? (
        <button className="botao-secundario" onClick={handleDesbloquear}>
          Desbloquear {proximaSkill.icone} {proximaSkill.nome}
        </button>
      ) : (
        <p className="vazio">🏆 Todas as skills desbloqueadas!</p>
      )}

      <button className="botao-oraculo" onClick={handleOraculo} disabled={consultando}>
        {consultando ? 'Consultando...' : '🔮 Consultar o Oráculo'}
      </button>

      {conselho && <p className="conselho-oraculo">{conselho}</p>}
    </div>
  );
}
