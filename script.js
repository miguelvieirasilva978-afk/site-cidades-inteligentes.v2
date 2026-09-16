// menu mobile
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => menu.classList.toggle('aberto'));
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('aberto'));
  });
}

// busca simples: leva para a página cujo nome bate com o termo digitado
const paginas = {
  'sobre': 'sobre.html',
  'curso': 'sobre.html',
  'videoaula': 'videoaulas.html',
  'video': 'videoaulas.html',
  'aula': 'videoaulas.html',
  'exercicio': 'exercicios.html',
  'exercício': 'exercicios.html',
  'simulador': 'simuladores.html',
  'tinkercad': 'simuladores.html',
  'kicad': 'simuladores.html',
  'easyeda': 'simuladores.html',
  'autocad': 'simuladores.html',
  'projeto': 'projetos.html',
  'jogo': 'jogos.html',
  'quiz': 'jogos.html',
  'fonte': 'fontes.html',
  'referencia': 'fontes.html',
  'referência': 'fontes.html'
};

const buscaForm = document.getElementById('buscaForm');
if (buscaForm) {
  buscaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const termo = document.getElementById('buscaInput').value.trim().toLowerCase();
    const chaveEncontrada = Object.keys(paginas).find(chave => termo.includes(chave));
    if (chaveEncontrada) {
      window.location.href = paginas[chaveEncontrada];
    } else {
      alert('Não encontrei nada com esse termo. Tente: sobre, videoaula, exercício, simulador, projeto, jogo ou fonte.');
    }
  });
}
