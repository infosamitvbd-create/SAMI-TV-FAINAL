import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Guard against browser DOMException when media elements unmount during pending play()
if (typeof window !== 'undefined') {
  if (typeof HTMLMediaElement !== 'undefined' && HTMLMediaElement.prototype.play) {
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args: any[]) {
      const promise = originalPlay.apply(this, args);
      if (promise && typeof promise.catch === 'function') {
        return promise.catch((err: any) => {
          if (
            err?.name === 'AbortError' ||
            err?.name === 'NotAllowedError' ||
            (typeof err?.message === 'string' && err.message.includes('interrupted'))
          ) {
            // Benign error caused by unmounting or navigating away while media is buffering/playing
            return;
          }
          throw err;
        });
      }
      return promise;
    };
  }

  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || (typeof event.reason === 'string' ? event.reason : '');
    if (
      event.reason?.name === 'AbortError' ||
      message.includes('The play() request was interrupted') ||
      message.includes('media was removed from the document')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

