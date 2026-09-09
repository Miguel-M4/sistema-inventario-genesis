import { useState } from "react";
import { useApp } from "../context";
import { SUCURSALES } from "../data";
import type { Sucursal, TipoMovimiento } from "../types";

export default function Movimientos() {
  const { usuarioActual, movimientos, repuestos } = useApp();
  if (!usuarioActual) return null;

  const esGerente = usuarioActual.rol === "gerente";
  const [sucursalTab, setSucursalTab] = useState<"todas" | Sucursal>(
    esGerente ? "todas" : usuarioActual.sucursal
  );
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | TipoMovimiento>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 12;

  const movsSucursal = movimientos.filter((m) =>
    sucursalTab === "todas" ? true : m.sucursal === sucursalTab
  );

  const filtrados = movsSucursal.filter((m) => {
    const matchTipo = tipoFiltro === "todos" || m.tipo === tipoFiltro;
    const q = busqueda.toLowerCase();
    const matchQ =
      !q ||
      m.repuestoNombre.toLowerCase().includes(q) ||
      m.repuestoCodigo.toLowerCase().includes(q) ||
      m.usuarioNombre.toLowerCase().includes(q) ||
      m.motivo.toLowerCase().includes(q) ||
      (m.folioReferencia && m.folioReferencia.toLowerCase().includes(q));
    return matchTipo && matchQ;
  });

  const totalPaginas = Math.ceil(filtrados.length / elementosPorPagina) || 1;
  const paginaValida = Math.min(paginaActual, totalPaginas);
  const paginados = filtrados.slice(
    (paginaValida - 1) * elementosPorPagina,
    paginaValida * elementosPorPagina
  );

  const totalEntradas = movsSucursal
    .filter((m) => m.tipo === "entrada")
    .reduce((acc, m) => acc + m.cantidad, 0);

  const totalSalidas = movsSucursal
    .filter((m) => m.tipo === "salida")
    .reduce((acc, m) => acc + m.cantidad, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl text-[var(--foreground)]">
              Kardex y Movimientos
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              Registro de auditoría de todas las entradas (compras) y salidas (ventas)
            </p>
          </div>
          {esGerente && (
            <div className="flex gap-1 bg-[var(--secondary)] p-1 rounded-lg">
              {(["todas", "sucursal1", "sucursal2"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSucursalTab(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    sucursalTab === s
                      ? "bg-[var(--card)] text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {s === "todas" ? "Todas las sucursales" : SUCURSALES[s]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Movimientos registrados</p>
              <p className="text-2xl font-bold font-mono-data text-[var(--foreground)]">
                {movsSucursal.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--muted-foreground)]">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4.75a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 .375.65l3.5 2a.75.75 0 0 0 .75-1.3l-3.125-1.785V6.75Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Total piezas ingresadas</p>
              <p className="text-2xl font-bold font-mono-data text-[var(--success)]">
                +{totalEntradas}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Total piezas despachadas</p>
              <p className="text-2xl font-bold font-mono-data text-red-400">
                -{totalSalidas}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-48">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por repuesto, código, motivo o folio..."
              className="input-field pl-9"
            />
          </div>

          <div className="flex gap-1 bg-[var(--secondary)] p-1 rounded-lg">
            {(["todos", "entrada", "salida"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTipoFiltro(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  tipoFiltro === t
                    ? "bg-[var(--card)] text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {t === "todos" ? "Todos los tipos" : t === "entrada" ? "Entradas (+)" : "Salidas (-)"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--secondary)]/30">
                  {[
                    "Fecha y hora",
                    "Tipo",
                    "Repuesto",
                    "Cantidad",
                    "Stock (Antes -> Ahora)",
                    "Motivo / Folio",
                    "Sucursal",
                    "Usuario",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-[var(--muted-foreground)] text-sm"
                    >
                      No se encontraron movimientos registrados con esos filtros.
                    </td>
                  </tr>
                ) : (
                  paginados.map((m) => {
                    const esEntrada = m.tipo === "entrada";
                    return (
                      <tr
                        key={m.id}
                        className="border-b border-[var(--border)] hover:bg-[var(--secondary)]/40 transition-colors"
                      >
                        {/* Fecha */}
                        <td className="px-4 py-3 font-mono-data text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                          {m.fecha}
                        </td>

                        {/* Tipo Badge */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              esEntrada
                                ? "bg-[var(--success)]/15 text-[var(--success)]"
                                : "bg-red-500/15 text-red-400"
                            }`}
                          >
                            {esEntrada ? (
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
                              </svg>
                            )}
                            {esEntrada ? "ENTRADA" : "SALIDA"}
                          </span>
                        </td>

                        {/* Repuesto */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-[var(--foreground)] text-xs">
                              {m.repuestoNombre}
                            </p>
                            <p className="font-mono-data text-[10px] text-[var(--muted-foreground)]">
                              {m.repuestoCodigo}
                            </p>
                          </div>
                        </td>

                        {/* Cantidad */}
                        <td className="px-4 py-3 font-mono-data font-bold text-sm whitespace-nowrap">
                          <span className={esEntrada ? "text-[var(--success)]" : "text-red-400"}>
                            {esEntrada ? `+${m.cantidad}` : `-${m.cantidad}`}
                          </span>
                        </td>

                        {/* Stock antes y después */}
                        <td className="px-4 py-3 font-mono-data text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                          <span className="text-[var(--foreground)] font-medium">
                            {m.stockAnterior}
                          </span>{" "}
                          →{" "}
                          <span
                            className={`font-semibold ${
                              m.stockResultante === 0
                                ? "text-red-400"
                                : "text-[var(--foreground)]"
                            }`}
                          >
                            {m.stockResultante}
                          </span>
                        </td>

                        {/* Motivo y Folio */}
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-[var(--foreground)]">
                            {m.motivo}
                          </p>
                          {m.folioReferencia && (
                            <p className="font-mono-data text-[10px] text-[var(--primary)] font-medium">
                              Ref: {m.folioReferencia}
                            </p>
                          )}
                          {m.notas && (
                            <p className="text-[10px] text-[var(--muted-foreground)] italic">
                              "{m.notas}"
                            </p>
                          )}
                        </td>

                        {/* Sucursal */}
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                          {SUCURSALES[m.sucursal]}
                        </td>

                        {/* Usuario */}
                        <td className="px-4 py-3 text-xs text-[var(--foreground)] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[9px] font-bold text-[var(--primary)] shrink-0">
                              {m.usuarioNombre.charAt(0)}
                            </div>
                            <span>{m.usuarioNombre}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación Movimientos */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
          <p className="text-xs text-[var(--muted-foreground)]">
            Mostrando {filtrados.length === 0 ? 0 : (paginaValida - 1) * elementosPorPagina + 1} a{" "}
            {Math.min(paginaValida * elementosPorPagina, filtrados.length)} de {filtrados.length} movimientos
          </p>
          {totalPaginas > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaValida === 1}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--muted)] transition-colors"
              >
                Anterior
              </button>
              <span className="text-xs font-mono-data px-2 text-[var(--muted-foreground)]">
                Página {paginaValida} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaValida === totalPaginas}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--muted)] transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
