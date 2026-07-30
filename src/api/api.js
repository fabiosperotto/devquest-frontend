// Centraliza todas as chamadas para a API do back-end.
// Assim, em aula, dá pra mostrar claramente onde o React "conversa"
// com o Node/Express - é só nesse arquivo.
const BASE_URL = 'http://localhost:3001';

async function tratarResposta(resposta) {
  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || 'Erro na requisição à API.');
  }
  return resposta.status === 204 ? null : resposta.json();
}

export const api = {
  listarHerois: () => fetch(`${BASE_URL}/herois`).then(tratarResposta),

  criarHeroi: (heroi) =>
    fetch(`${BASE_URL}/herois`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroi),
    }).then(tratarResposta),

  listarSkills: () => fetch(`${BASE_URL}/skills`).then(tratarResposta),

  desbloquearSkill: (heroId, skillId) =>
    fetch(`${BASE_URL}/herois/${heroId}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId }),
    }).then(tratarResposta),

  consultarOraculo: (heroId) =>
    fetch(`${BASE_URL}/herois/${heroId}/oraculo`).then(tratarResposta),

  removerHeroi: (heroId) =>
    fetch(`${BASE_URL}/herois/${heroId}`, { method: 'DELETE' }).then(tratarResposta),
};
