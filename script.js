const button = document.querySelector('#cta-button');
const yearSpan = document.querySelector('#year');

const toggleButtonText = () => {
  const defaultText = 'Click me';
  const activeText = 'Thanks for clicking!';

  if (button.textContent === defaultText) {
    button.textContent = activeText;
    button.classList.add('active');
  } else {
    button.textContent = defaultText;
    button.classList.remove('active');
  }
};

button?.addEventListener('click', toggleButtonText);

yearSpan.textContent = new Date().getFullYear();
