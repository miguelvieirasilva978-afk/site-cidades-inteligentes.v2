const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('aberto');
});

// fecha o menu ao clicar em um link (mobile)
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => menu.classList.remove('aberto'));
});
