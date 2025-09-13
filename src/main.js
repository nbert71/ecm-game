// Ici vous pouvez écrire votre javascript

function changeColor() {
  const title = document.querySelector('h1');
  if (!title) {
    console.error('Title is not defined');
  }

  const randomHexaColor =
    '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');

  title.style.color = randomHexaColor;
}
