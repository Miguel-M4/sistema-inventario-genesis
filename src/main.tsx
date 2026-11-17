import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

interface TrustedTypesPolicy {
  createScriptURL(value: string): string
}

interface TrustedTypesPolicyFactory {
  createPolicy(
    name: string,
    rules: { createScriptURL(value: string): string }
  ): TrustedTypesPolicy
}

declare global {
  interface Window {
    trustedTypes?: TrustedTypesPolicyFactory
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

function getServiceWorkerScriptUrl(): string {
  const scriptPath = '/sw.js'
  if (!window.trustedTypes) return scriptPath

  const policy = window.trustedTypes.createPolicy('genesis-service-worker', {
    createScriptURL: (value) => {
      const url = new URL(value, window.location.origin)
      if (url.origin !== window.location.origin || url.pathname !== scriptPath) {
        throw new TypeError('URL del service worker no permitida.')
      }
      return url.href
    },
  })

  return policy.createScriptURL(scriptPath)
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(getServiceWorkerScriptUrl()).catch((error: unknown) => {
      console.error("No se pudo registrar el service worker:", error);
    });
  });
}

if (import.meta.env.DEV && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const wasControlled = Boolean(navigator.serviceWorker.controller);
    void navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .then(() => caches.keys())
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("genesis-app-"))
          .map((key) => caches.delete(key))
      ))
      .then(() => {
        if (wasControlled) window.location.reload();
      })
      .catch((error: unknown) => {
        console.error("No se pudo limpiar el service worker de desarrollo:", error);
      });
  });
}
