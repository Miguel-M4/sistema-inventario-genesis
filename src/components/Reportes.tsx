import { useState } from "react";
import { useApp } from "../context";
import { SUCURSALES } from "../data";
import type { Sucursal } from "../types";

export default function Reportes() {
  const { usuarioActual, repuestos, herramientas } = useApp();
  if (!usuarioActual) return null;

  const esGerente = usuarioActual.rol === "gerente";
  const [sucursalFiltro, setSucursalFiltro] = useState<"todas" | Sucursal>(
    esGerente ? "todas" : usuarioActual.sucursal
  );

  const repsBase = sucursalFiltro === "todas" ? repuestos : repuestos.filter((r) => r.sucursal === sucursalFiltro);
  const herrsBase = sucursalFiltro === "todas" ? herramientas : herramientas.filter((h) => h.sucursal === sucursalFiltro);

  const agotados = repsBase.filter((r) => r.existencia === 0);
  const bajoStock = repsBase.filter((r) => r.existencia > 0 && r.existencia <= r.stockMinimo);
  const normales = repsBase.filter((r) => r.existencia > r.stockMinimo);

  const valorInventario = repsBase.reduce((a, r) => a + r.existencia * r.precioCompra, 0);
  const valorVenta = repsBase.reduce((a, r) => a + r.existencia * r.precioVenta, 0);
  const gananciaTotal = valorVenta - valorInventario;

  const herrsEnUso = herrsBase.filter((h) => h.estado === "en_uso");

  // Category breakdown
  const categorias = Array.from(new Set(repsBase.map((r) => r.categoria)));
  const porCategoria = categorias.map((cat) => {
    const items = repsBase.filter((r) => r.categoria === cat);
    return {
      categoria: cat,
      total: items.length,
      valor: items.reduce((a, r) => a + r.existencia * r.precioCompra, 0),
      alertas: items.filter((r) => r.existencia <= r.stockMinimo).length,
    };
  }).sort((a, b) => b.valor - a.valor);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl text-[var(--foreground)]">Reportes</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Alertas de stock y análisis de inventario</p>
          </div>
          {esGerente && (
            <div className="flex gap-1 bg-[var(--secondary)] p-1 rounded-lg">
              {(["todas", "sucursal1", "sucursal2"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSucursalFiltro(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${sucursalFiltro === s ? "bg-[var(--card)] text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}
                >
                  {s === "todas" ? "Todas" : SUCURSALES[s]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alert banners */}
        {agotados.length > 0 && (
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400 shrink-0">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-red-400 text-sm">{agotados.length} producto{agotados.length !== 1 ? "s" : ""} sin existencia</h3>
            </div>
            <div className="space-y-2">
              {agotados.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-1.5 border-t border-red-800/20">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{r.nombre}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{r.codigo} · {SUCURSALES[r.sucursal]} · {r.categoria} · Proveedor: {r.proveedor}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400">AGOTADO</span>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                      Mín: {r.stockMinimo} {esGerente ? `· P.compra: $${r.precioCompra.toLocaleString()}` : ""}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {bajoStock.length > 0 && (
          <div className="bg-yellow-950/20 border border-yellow-800/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-400 shrink-0">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-yellow-400 text-sm">{bajoStock.length} producto{bajoStock.length !== 1 ? "s" : ""} con stock bajo</h3>
            </div>
            <div className="space-y-2">
              {bajoStock.map((r) => {
                const pct = Math.round((r.existencia / r.stockMinimo) * 100);
                return (
                  <div key={r.id} className="flex items-center gap-3 py-1.5 border-t border-yellow-800/20">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{r.nombre}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{r.codigo} · {SUCURSALES[r.sucursal]} · {r.categoria}</p>
                    </div>
                    <div className="w-24 shrink-0">
                      <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mb-1">
                        <span>{r.existencia} / {r.stockMinimo}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1 bg-[var(--secondary)] rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400 shrink-0">BAJO</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {agotados.length === 0 && bajoStock.length === 0 && (
          <div className="bg-[var(--success)]/5 border border-[var(--success)]/20 rounded-xl p-6 mb-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--success)]/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[var(--success)]">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[var(--success)]">Sin alertas de stock</p>
              <p className="text-sm text-[var(--muted-foreground)]">Todos los productos tienen existencia suficiente.</p>
            </div>
          </div>
        )}

        {/* Financial summary (Solo Gerente) */}
        {esGerente && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Valor en inventario</p>
              <p className="text-xl font-bold font-mono-data text-[var(--foreground)]">
                ${valorInventario.toLocaleString("es-MX")}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)]">Costo de compra</p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Valor de venta</p>
              <p className="text-xl font-bold font-mono-data text-[var(--foreground)]">
                ${valorVenta.toLocaleString("es-MX")}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)]">Precio de lista</p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--success)]/20 rounded-xl p-4">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Ganancia potencial</p>
              <p className="text-xl font-bold font-mono-data text-[var(--success)]">
                ${gananciaTotal.toLocaleString("es-MX")}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                {valorInventario > 0
                  ? `${((gananciaTotal / valorInventario) * 100).toFixed(1)}% sobre costo`
                  : "—"}
              </p>
            </div>
          </div>
        )}


        {/* Status overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Inventory status */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">Estado del inventario</h3>
            <div className="space-y-3">
              {[
                { label: "Normal", count: normales.length, color: "bg-[var(--success)]", text: "text-[var(--success)]" },
                { label: "Stock bajo", count: bajoStock.length, color: "bg-yellow-500", text: "text-yellow-400" },
                { label: "Agotado", count: agotados.length, color: "bg-red-500", text: "text-red-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.color}`} />
                  <span className="text-sm text-[var(--muted-foreground)] flex-1">{s.label}</span>
                  <span className={`font-mono-data font-semibold text-sm ${s.text}`}>{s.count}</span>
                  <div className="w-24 h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${repsBase.length > 0 ? (s.count / repsBase.length) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools in use */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">Herramientas en uso</h3>
            {herrsEnUso.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)] py-4 text-center">Todas las herramientas están disponibles.</p>
            ) : (
              <div className="space-y-2">
                {herrsEnUso.map((h) => (
                  <div key={h.id} className="flex items-center gap-3 bg-[var(--secondary)] rounded-lg px-3 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--foreground)] truncate">{h.nombre}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">
                        {SUCURSALES[h.sucursal]}{h.asignadoA ? ` · ${h.asignadoA}` : ""}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono-data text-[var(--muted-foreground)]">{h.fechaAsignacion || ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="font-semibold text-[var(--foreground)] mb-4">Repuestos por categoría</h3>
          {porCategoria.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)] text-center py-6">Sin datos.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {["Categoría", "Productos", ...(esGerente ? ["Valor inventario"] : []), "Alertas"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {porCategoria.map((c) => (
                    <tr key={c.categoria} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/40 transition-colors">
                      <td className="px-3 py-3 text-xs font-medium text-[var(--foreground)]">{c.categoria}</td>
                      <td className="px-3 py-3 font-mono-data text-xs text-[var(--foreground)]">{c.total}</td>
                      {esGerente && (
                        <td className="px-3 py-3 font-mono-data text-xs text-[var(--foreground)]">${c.valor.toLocaleString("es-MX")}</td>
                      )}
                      <td className="px-3 py-3">
                        {c.alertas > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            {c.alertas}
                          </span>
                        ) : (
                          <span className="text-[var(--success)] font-mono-data text-xs">✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
