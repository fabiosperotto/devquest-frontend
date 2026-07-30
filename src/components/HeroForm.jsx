import { useState } from 'react';
import { api } from '../api/api';

const CLASSES = ['Front-end', 'Back-end', 'Mobile', 'Dados', 'Fullstack'];
const EMOJIS = ['🧙', '🥷', '🦸', '🧝', '🧛', '🤖'];

export default function HeroForm({ aoCriar }) {
  const [nome, setNome] = useState('');
  const [classe, setClasse] = useState('Fullstack');
  const [avatarEmoji, setAvatarEmoji] = useState('🧙');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (!nome.trim()) return;

    setCarregando(true);
    try {
      const novoHeroi = await api.criarHeroi({ nome, classe, avatarEmoji });
      aoCriar(novoHeroi);
      setNome('');
    } catch (erro) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="hero-form" onSubmit={handleSubmit}>
      <h2>Crie seu herói</h2>

      <div className="campo">
        <label>Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como te chamam na guilda?"
        />
      </div>

      <div className="campo">
        <label>Classe</label>
        <select value={classe} onChange={(e) => setClasse(e.target.value)}>
          {CLASSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label>Avatar</label>
        <div className="avatares">
          {EMOJIS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              className={avatarEmoji === emoji ? 'avatar selecionado' : 'avatar'}
              onClick={() => setAvatarEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={carregando} className="botao-primario">
        {carregando ? 'Invocando...' : 'Entrar na Guilda ⚔️'}
      </button>
    </form>
  );
}
