document.addEventListener('DOMContentLoaded', () => {
  const d = document.createElement('div');
  d.textContent = 'Smalltest loaded';
  d.style.position = 'fixed';
  d.style.top = '10px';
  d.style.left = '10px';
  d.style.background = 'purple';
  d.style.color = 'white';
  d.style.padding = '4px 8px';
  document.body.appendChild(d);
});
