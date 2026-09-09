import { useState } from "react";
import { useApp } from "../context";

export default function Login() {
  const { login, supabaseConectado, sincronizando } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(email, password);
      if (!res.ok) {
        setError(res.error || "Credenciales incorrectas o usuario inactivo.");
      }
    } catch {
      setError("Error de conexión al intentar iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <img 
            src="/logo.jpeg" 
            alt="Genesis Servicios Automotriz" 
            className="w-auto h-36 mx-auto mb-2 object-contain"
          />
          <p className="text-[var(--muted-foreground)] text-xs tracking-wide uppercase font-medium">
            Sistema de inventario automotriz
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-base font-semibold text-[var(--foreground)] mb-6">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="usuario@taller.com"
                required
                className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-md px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                required
                className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-md px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/50 rounded-md px-3 py-2.5">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400 shrink-0">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm py-2.5 rounded-md hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? "Verificando..." : "Entrar al sistema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}