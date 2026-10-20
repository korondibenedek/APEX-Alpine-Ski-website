async function loadIncludes(root = document) {
  const placeholders = [...root.querySelectorAll('[data-include]')];
  if (!placeholders.length) return;

  await Promise.all(placeholders.map(async placeholder => {
    const path = placeholder.dataset.include;
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`);
    }

    const template = document.createElement('template');
    template.innerHTML = await response.text();
    placeholder.replaceWith(template.content);
  }));

  await loadIncludes(root);
}

try {
  await loadIncludes();
  await import('../main.js');
} catch (error) {
  console.error('APEX failed to load its application views:', error);
  const message = document.createElement('p');
  message.setAttribute('role', 'alert');
  message.textContent = 'APEX could not load its interface. Run the app from a local web server and check the console for details.';
  Object.assign(message.style, {
    position: 'fixed',
    inset: '1rem',
    zIndex: '9999',
    padding: '1rem',
    color: '#fff',
    background: '#7f1d1d',
    font: '14px system-ui, sans-serif',
  });
  document.body.append(message);
}
