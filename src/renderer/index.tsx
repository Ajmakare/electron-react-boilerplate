import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// Listen for the 'open-url' event
window.electron.ipcRenderer.on('open-url', (...args: unknown[]) => {
  const url = args[0] as string;
  // Handle the OAuth2 callback URL here
  console.log('Callback URL:', url);
});

window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
