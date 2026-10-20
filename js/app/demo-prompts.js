import { getActiveAccount, getAccounts } from '../data/accounts.js';

export function renderDemoPrompts() {
  const container = document.querySelector('#demoPrompts');
  if (!container) return;

  container.querySelectorAll('[data-profile-prompt]').forEach(button => button.remove());

  const activeAccount = getActiveAccount();
  const template = container.querySelector('.demo-chip');
  if (!activeAccount || !template) return;

  getAccounts()
    .filter(account => account.isCustom && account.id !== activeAccount.id)
    .forEach(account => {
      const prompts = [
        `Where is ${account.name}?`,
        `Plan a route to ${account.name}`,
        `Send a radio message to ${account.name} that we should check in`,
      ];
      prompts.forEach((prompt, index) => {
        const button = template.cloneNode(false);
        button.dataset.prompt = prompt;
        button.dataset.profilePrompt = '';
        button.textContent = [`📍 Locate ${account.name}`, `⛷️ Route to ${account.name}`, `📻 Message ${account.name}`][index];
        container.append(button);
      });
    });
}
