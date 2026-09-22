import { useState } from "react";
import { useApp } from "../context";

export default function Login() {
  const { login, tema, toggleTema } = useApp();
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
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 relative">
      <button
        onClick={toggleTema}
        title={tema === "oscuro" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        className="absolute top-4 right-4 p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors flex items-center gap-2 text-xs font-medium shadow-sm"
      >
        {tema === "oscuro" ? (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400">
              <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2Zm0 13a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15Zm-8-5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 2 10Zm13 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 15 10Zm-10.364-5.636a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm9.193 9.193a.75.75 0 0 1 1.06 0l1.06 1.061a.75.75 0 0 1-1.06 1.06l-1.06-1.061a.75.75 0 0 1 0-1.06ZM4.636 15.364a.75.75 0 0 1 0-1.06l1.06-1.061a.75.75 0 1 1 1.061 1.06l-1.06 1.061a.75.75 0 0 1-1.061 0Zm9.193-9.193a.75.75 0 0 1 0-1.06l1.061-1.06a.75.75 0 0 1 1.06 1.06l-1.06 1.061a.75.75 0 0 1-1.061 0ZM10 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
            </svg>
            <span>Modo claro</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
              <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .862.243 7.5 7.5 0 0 0 10.436 10.436.75.75 0 0 1 1.006.96 9.5 9.5 0 1 1-12.063-12.063a.75.75 0 0 1 .759.424Z" clipRule="evenodd" />
            </svg>
            <span>Modo oscuro</span>
          </>
        )}
      </button>
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
        <footer style={{ textAlign: "center", padding: "1rem", fontSize: "0.9rem" }} className="text-[var(--muted-foreground)] mt-6">
          <p>© 2026 Sistema. Desarrollado por estudiantes de la <strong>Universidad Luterana Salvadoreña (ULS)</strong>.</p>
        </footer>
      </div>
    </div>
  );
}