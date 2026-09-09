import { useState } from "react";
import { useApp } from "../context";
import { SUCURSALES } from "../data";

type NavItem = {
  id: "dashboard" | "inventario" | "movimientos" | "herramientas" | "reportes" | "usuarios";
  label: string;
  icon: React.ReactNode;
  soloGerente?: boolean;
};

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
        <path d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM2.166 5.25a.75.75 0 0 1 1.024-.274l1.3.75a.75.75 0 1 1-.75 1.299l-1.3-.75A.75.75 0 0 1 2.166 5.25Zm13.344 8.5a.75.75 0 0 1 1.024-.274l1.3.75a.75.75 0 1 1-.75 1.298l-1.3-.75a.75.75 0 0 1-.274-1.024ZM2 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 2 10Zm13.25 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" />
      </svg>
    ),
  },
  {
    id: "inventario",
    label: "Inventario",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
        <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25l.01 9.5A2.25 2.25 0 0 1 16.76 17H3.26A2.267 2.267 0 0 1 1 14.74l-.01-9.5Zm8.26 9.52v-.001a.75.75 0 0 0 1.52 0l.01-4.998.504.006h.003a.75.75 0 0 0 .75-.75.75.75 0 0 0-.747-.753l-.51-.006-.01-2.5a.75.75 0 0 0-1.5.003l.01 2.5-.509-.007h-.007a.75.75 0 0 0-.75.75.75.75 0 0 0 .747.753l.514.006-.01 4.997Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "movimientos",
    label: "Movimientos / Kardex",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
        <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4.75a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 .375.65l3.5 2a.75.75 0 0 0 .75-1.3l-3.125-1.785V6.75Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "herramientas",
    label: "Herramientas",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
        <path fillRule="evenodd" d="M19 5.5a4.5 4.5 0 0 1-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 1 1-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 0 1 5.873-4.575c.324.105.405.49.163.731l-2.161 2.161a.601.601 0 0 0-.126.571l.528 1.88a.601.601 0 0 0 .426.426l1.88.528a.6.6 0 0 0 .571-.126l2.161-2.161c.241-.242.626-.161.731.163A4.51 4.51 0 0 1 19 5.5ZM3 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
        <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5V7A2.5 2.5 0 0 0 11 4.5H8.128a2.252 2.252 0 0 1 1.884-1.488L12.011 3l.001-.001 3.976.013ZM11.5 3.25A.25.25 0 0 0 11.25 3h-.5A.25.25 0 0 0 10.5 3.25V5h1V3.25Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M2 7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm2 3.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75ZM4 8.75A.75.75 0 0 1 4.75 8h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 4 8.75Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
      </svg>
    ),
    soloGerente: true,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    usuarioActual,
    vistaActual,
    setVista,
    logout,
    repuestos,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!usuarioActual) return null;

  const esGerente = usuarioActual.rol === "gerente";
  const items = navItems.filter((i) => !i.soloGerente || esGerente);

  const alertasCount = repuestos.filter(
    (r) => r.sucursal === usuarioActual.sucursal && r.existencia <= r.stockMinimo
  ).length;

  const handleSeleccionarVista = (id: NavItem["id"]) => {
    setVista(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[var(--background)]">
      {/* Header Superior Móvil */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-[var(--card)] border-b border-[var(--border)] shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-md text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/logo.jpeg"
              alt="Genesis"
              className="h-7 w-7 object-contain rounded-md"
            />
            <span className="font-bold text-sm text-[var(--foreground)] uppercase tracking-wide">
              Genesis
            </span>
          </div>
        </div>
      </header>

      {/* Fondo Traslúcido Móvil */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          w-64 ${sidebarOpen ? "md:w-56" : "md:w-14"}
          bg-[var(--card)] border-r border-[var(--border)]
          flex flex-col h-full transition-all duration-200 ease-in-out shrink-0 overflow-hidden
        `}
      >
        {/* Header del Sidebar */}
        <div className="h-14 flex items-center px-3 border-b border-[var(--border)] shrink-0 justify-between">
          <div className={`flex items-center gap-2 min-w-0 ${!sidebarOpen ? "md:hidden" : ""}`}>
            <img
              src="/logo.jpeg"
              alt="Genesis"
              className="h-8 w-8 object-contain shrink-0 rounded-md"
            />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-bold text-sm text-[var(--foreground)] truncate uppercase tracking-wide">
                Genesis
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)] truncate">
                Servicios Automotriz
              </span>
            </div>
          </div>

          {!sidebarOpen && (
            <img
              src="/logo.jpeg"
              alt="Genesis"
              className="hidden md:block h-7 w-7 object-contain mx-auto shrink-0 rounded-md"
            />
          )}

          {/* Botón contraer (PC) */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden md:flex p-1 rounded-md hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors shrink-0 ml-auto"
            title={sidebarOpen ? "Contraer menú" : "Expandir menú"}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 2 10Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Botón cerrar (Móvil) */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--secondary)] ml-auto"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Badge de Sucursal */}
        <div className={`px-3 py-2 border-b border-[var(--border)] ${!sidebarOpen ? "md:hidden" : ""}`}>
          <div className="flex items-center gap-2 bg-[var(--secondary)] rounded-md px-2.5 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] text-[var(--muted-foreground)]">Sucursal activa</p>
              <p className="text-xs font-medium text-[var(--foreground)] truncate">
                {SUCURSALES[usuarioActual.sucursal]}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const active = vistaActual === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSeleccionarVista(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  active
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className={`truncate ${!sidebarOpen ? "md:hidden" : ""}`}>
                  {item.label}
                </span>
                {item.id === "reportes" && alertasCount > 0 && (
                  <span className={`ml-auto shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-[var(--primary-foreground)] text-[var(--primary)]" : "bg-red-500/20 text-red-400"}`}>
                    {alertasCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Perfil / Cierre de Sesión */}
        <div className="p-3 border-t border-[var(--border)] shrink-0">
          <div className={`flex items-center gap-2.5 ${!sidebarOpen ? "md:hidden" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-[var(--primary)]">
                {usuarioActual.nombre.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--foreground)] truncate">{usuarioActual.nombre}</p>
              <p className="text-[10px] text-[var(--muted-foreground)] capitalize">{usuarioActual.rol}</p>
            </div>
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-1 rounded-md hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {!sidebarOpen && (
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="hidden md:flex w-full justify-center p-2 rounded-md hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}