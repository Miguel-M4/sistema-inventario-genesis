import { useApp } from "../context";
import { SUCURSALES } from "../data";
import type { Sucursal } from "../types";

function StatCard({
  label,
  value,
  sub,
  color = "text-[var(--foreground)]",
  badgeColor = "bg-[var(--secondary)] text-[var(--muted-foreground)]",
  icon,
}: {  
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  badgeColor?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--secondary)]/30 border border-[var(--border)] hover:border-[var(--primary)]/40 rounded-xl p-5 shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg ${badgeColor} transition-transform group-hover:scale-110 duration-200`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold font-mono-data tracking-tight ${color}`}>{value}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)] mt-1 font-medium">{sub}</p>}
    </div>
  );
}

function SucursalPanel({ sucursal }: { sucursal: Sucursal }) {
  const { repuestos, herramientas } = useApp();
  const reps = repuestos.filter((r) => r.sucursal === sucursal);
  const herrs = herramientas.filter((h) => h.sucursal === sucursal);

  const sinStock = reps.filter((r) => r.existencia === 0);
  const bajoStock = reps.filter((r) => r.existencia > 0 && r.existencia <= r.stockMinimo);
  const enUso = herrs.filter((h) => h.estado === "en_uso");

  const valorTotal = reps.reduce((acc, r) => acc + r.existencia * r.precioCompra, 0);

  return (
    <div className="bg-gradient-to-br from-[var(--card)] to-[var(--secondary)]/40 border border-[var(--border)] hover:border-[var(--border)]/80 rounded-xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary)]"></span>
          </div>
          <h3 className="font-bold text-[var(--foreground)] text-sm uppercase tracking-wide">{SUCURSALES[sucursal]}</h3>
        </div>
        <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]">
          {reps.length} Repuestos
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-[var(--secondary)]/80 border border-[var(--border)]/50 rounded-lg p-3">
          <p className="text-[10px] font-medium text-[var(--muted-foreground)] mb-0.5">Catálogo registrado</p>
          <p className="text-lg font-bold font-mono-data text-[var(--foreground)]">{reps.length}</p>
        </div>
        <div className="bg-[var(--secondary)]/80 border border-[var(--border)]/50 rounded-lg p-3">
          <p className="text-[10px] font-medium text-[var(--muted-foreground)] mb-0.5">Valor del inventario</p>
          <p className="text-lg font-bold font-mono-data text-[var(--primary)]">
            ${valorTotal.toLocaleString("es-MX")}
          </p>
        </div>
        <div className={`rounded-lg p-3 border ${sinStock.length > 0 ? "bg-red-950/40 border-red-800/50" : "bg-[var(--secondary)]/80 border-[var(--border)]/50"}`}>
          <p className="text-[10px] font-medium text-[var(--muted-foreground)] mb-0.5">Agotados (0 stock)</p>
          <p className={`text-lg font-bold font-mono-data ${sinStock.length > 0 ? "text-red-400" : "text-[var(--success)]"}`}>
            {sinStock.length}
          </p>
        </div>
        <div className={`rounded-lg p-3 border ${bajoStock.length > 0 ? "bg-amber-950/40 border-amber-800/50" : "bg-[var(--secondary)]/80 border-[var(--border)]/50"}`}>
          <p className="text-[10px] font-medium text-[var(--muted-foreground)] mb-0.5">Stock bajo (Mínimo)</p>
          <p className={`text-lg font-bold font-mono-data ${bajoStock.length > 0 ? "text-amber-400" : "text-[var(--success)]"}`}>
            {bajoStock.length}
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[var(--muted-foreground)]">Herramientas asignadas</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
            <span className="text-xs font-mono-data text-[var(--foreground)]">{herrs.length - enUso.length} libres</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-xs font-mono-data text-[var(--foreground)]">{enUso.length} en uso</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { usuarioActual, repuestos, herramientas, setVista } = useApp();
  if (!usuarioActual) return null;

  const esGerente = usuarioActual.rol === "gerente";
  const sucursalFiltro = esGerente ? null : usuarioActual.sucursal;

  const repsVista = sucursalFiltro
    ? repuestos.filter((r) => r.sucursal === sucursalFiltro)
    : repuestos;

  const herrsVista = sucursalFiltro
    ? herramientas.filter((h) => h.sucursal === sucursalFiltro)
    : herramientas;

  const alertas = repsVista.filter((r) => r.existencia <= r.stockMinimo);
  const enUsoTotal = herrsVista.filter((h) => h.estado === "en_uso").length;
  const valorInventario = repsVista.reduce((a, r) => a + r.existencia * r.precioCompra, 0);

  const topAlertas = [...alertas]
    .sort((a, b) => (a.existencia === 0 ? -1 : b.existencia === 0 ? 1 : 0))
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl text-[var(--foreground)]">
            Bienvenido, {usuarioActual.nombre.split(" ")[0]}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {esGerente ? "Vista de todas las sucursales" : `${SUCURSALES[usuarioActual.sucursal]} · Rol: Vendedor`}
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total repuestos"
            value={repsVista.length}
            sub={esGerente ? "Ambas sucursales" : SUCURSALES[usuarioActual.sucursal]}
            badgeColor="bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30"
            icon={<svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" /><path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5Zm5.22 1.72a.75.75 0 0 1 1.06 0L10 10.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L11.06 12l1.72 1.72a.75.75 0 1 1-1.06 1.06L10 13.06l-1.72 1.72a.75.75 0 0 1-1.06-1.06L8.94 12 7.22 10.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>}
          />
          {esGerente ? (
            <StatCard
              label="Valor inventario"
              value={`$${(valorInventario / 1000).toFixed(1)}k`}
              sub="Precio de compra"
              badgeColor="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              icon={<svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.33.596Z" /><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 0 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.292.19.681.345 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z" clipRule="evenodd" /></svg>}
            />
          ) : (
            <StatCard
              label="Piezas en stock"
              value={repsVista.reduce((a, r) => a + r.existencia, 0)}
              sub="Unidades disponibles"
              badgeColor="bg-blue-500/15 text-blue-400 border border-blue-500/30"
              icon={<svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" /><path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5Zm5.22 1.72a.75.75 0 0 1 1.06 0L10 10.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L11.06 12l1.72 1.72a.75.75 0 1 1-1.06 1.06L10 13.06l-1.72 1.72a.75.75 0 0 1-1.06-1.06L8.94 12 7.22 10.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>}
            />
          )}

          <StatCard
            label="Alertas activas"
            value={alertas.length}
            sub={`${alertas.filter((r) => r.existencia === 0).length} sin existencia`}
            color={alertas.length > 0 ? "text-red-400" : "text-[var(--success)]"}
            badgeColor={alertas.length > 0 ? "bg-red-500/15 text-red-400 border border-red-500/30" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"}
            icon={<svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" /></svg>}
          />
          <StatCard
            label="Herramientas en uso"
            value={`${enUsoTotal}/${herrsVista.length}`}
            sub="del taller activas"
            badgeColor="bg-amber-500/15 text-amber-400 border border-amber-500/30"
            icon={<svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M19 5.5a4.5 4.5 0 0 1-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 1 1-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 0 1 5.873-4.575c.324.105.405.49.163.731l-2.161 2.161a.601.601 0 0 0-.126.571l.528 1.88a.601.601 0 0 0 .426.426l1.88.528a.6.6 0 0 0 .571-.126l2.161-2.161c.241-.242.626-.161.731.163A4.51 4.51 0 0 1 19 5.5ZM3 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" /></svg>}
          />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sucursales overview (gerente only) */}
          {esGerente ? (
            <>
              <SucursalPanel sucursal="sucursal1" />
              <SucursalPanel sucursal="sucursal2" />
            </>
          ) : null}

          {/* Alertas recientes */}
          <div className={`bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 ${esGerente ? "" : "lg:col-span-2"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--foreground)]">Alertas de stock</h3>
              <button
                onClick={() => setVista("reportes")}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                Ver todas
              </button>
            </div>
            {topAlertas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--success)]/10 flex items-center justify-center mb-3">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[var(--success)]">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[var(--foreground)]">Sin alertas activas</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Todos los productos tienen stock suficiente</p>
              </div>
            ) : (
              <div className="space-y-2">
                {topAlertas.map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${r.existencia === 0 ? "bg-red-950/30 border border-red-800/30" : "bg-yellow-950/20 border border-yellow-800/20"}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.existencia === 0 ? "bg-red-500" : "bg-yellow-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--foreground)] truncate">{r.nombre}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">
                        {SUCURSALES[r.sucursal]} · Existencia: {r.existencia} / Mín: {r.stockMinimo}
                      </p>
                    </div>
                    <span className={`text-xs font-bold font-mono-data shrink-0 ${r.existencia === 0 ? "text-red-400" : "text-yellow-400"}`}>
                      {r.existencia === 0 ? "AGOTADO" : "BAJO"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent activity or cross-branch comparison for gerente */}
          {esGerente && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-4">Comparativo sucursales</h3>
              {(["sucursal1", "sucursal2"] as const).map((s) => {
                const reps = repuestos.filter((r) => r.sucursal === s);
                const alertasS = reps.filter((r) => r.existencia <= r.stockMinimo).length;
                const herrs = herramientas.filter((h) => h.sucursal === s);
                const enUsoS = herrs.filter((h) => h.estado === "en_uso").length;
                return (
                  <div key={s} className="mb-4 last:mb-0">
                    <p className="text-xs font-semibold text-[var(--foreground)] mb-2">{SUCURSALES[s]}</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--muted-foreground)]">Repuestos</span>
                        <span className="font-mono-data text-[var(--foreground)]">{reps.length}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--muted-foreground)]">Alertas</span>
                        <span className={`font-mono-data font-semibold ${alertasS > 0 ? "text-red-400" : "text-[var(--success)]"}`}>{alertasS}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--muted-foreground)]">Herr. en uso</span>
                        <span className="font-mono-data text-[var(--foreground)]">{enUsoS}/{herrs.length}</span>
                      </div>
                    </div>
                    {s === "sucursal1" && <div className="border-t border-[var(--border)] mt-3" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
