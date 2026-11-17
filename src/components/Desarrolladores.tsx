interface PerfilDesarrollador {
  nombre: string;
  puesto: string;
  informacion: string;
  foto: string;
}

const DESCRIPCION_EQUIPO =
  "Somos estudiantes de la Universidad Luterana Salvadoreña y desarrollamos este sistema de inventario como parte de nuestro proyecto académico, para apoyar la organización y el control de inventario.";

const PERFILES_INICIALES: PerfilDesarrollador[] = [
  {
    nombre: "Salvador Josué Cisneros Hernández",
    puesto: "Estudiante de la ULS",
    informacion:
      "Estudiante de la Universidad Luterana Salvadoreña y parte del equipo que desarrolló este sistema de inventario.",
    foto: "/desarrollador-1.jpeg",
  },
  {
    nombre: "Karen Abigail Deleón Sánchez",
    puesto: "Estudiante de la ULS",
    informacion:
      "Estudiante de la Universidad Luterana Salvadoreña y parte del equipo que desarrolló este sistema de inventario.",
    foto: "/desarrollador-2.jpeg",
  },
  {
    nombre: "Miguel Ángel Nolasco Osorio",
    puesto: "Estudiante de la ULS",
    informacion:
      "Estudiante de la Universidad Luterana Salvadoreña y parte del equipo que desarrolló este sistema de inventario.",
    foto: "/desarrollador-3.jpeg",
  },
  {
    nombre: "Sebastián Emilio Vásquez Mejía",
    puesto: "Estudiante de la ULS",
    informacion:
      "Estudiante de la Universidad Luterana Salvadoreña y parte del equipo que desarrolló este sistema de inventario.",
    foto: "/desarrollador-4.jpeg",
  },
];

export default function Desarrolladores() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--card)] to-[var(--card)] px-5 py-7 shadow-sm sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--primary)] sm:text-xs">
                <span className="h-px w-6 bg-[var(--primary)]" />
                Sistema Génesis · Universidad Luterana
              </p>
              <h1 className="font-display text-3xl leading-tight text-[var(--foreground)] sm:text-4xl">
                Las personas detrás de la{" "}
                <span className="text-[var(--primary)]">creación del sistema</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base sm:leading-7">
                {DESCRIPCION_EQUIPO}
              </p>
            </div>
            <div className="inline-flex w-fit shrink-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)]/80 px-4 py-3 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                </svg>
              </span>
              <span>
                <span className="block text-lg font-semibold leading-tight text-[var(--foreground)]">4</span>
                <span className="mt-1 block text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">desarrolladores</span>
              </span>
            </div>
          </div>
        </header>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-[var(--foreground)] sm:text-2xl">Equipo desarrollador</h2>
            <p className="mt-1 text-xs text-[var(--muted-foreground)] sm:text-sm">
              Conoce a quienes participaron en la creación de este sistema.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PERFILES_INICIALES.map((perfil, indice) => (
            <article
              key={indice}
              className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-black/10"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--secondary)] via-[var(--card)] to-[var(--secondary)] p-2">
                {perfil.foto ? (
                  <img
                    src={perfil.foto}
                    alt={`Foto de ${perfil.nombre || `desarrollador ${indice + 1}`}`}
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 text-[var(--muted-foreground)]/30">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 1 1 14 0H5Z" />
                  </svg>
                )}
                <span className="absolute left-3 top-3 rounded-full border border-[var(--border)] bg-[var(--card)]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)] shadow-sm backdrop-blur">
                  Desarrollador {String(indice + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-5">
                <h3 className="min-h-12 break-words text-lg font-semibold leading-6 tracking-tight text-[var(--foreground)]">
                  {perfil.nombre || `Desarrollador ${indice + 1}`}
                </h3>
                <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-[var(--primary)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  {perfil.puesto || "Equipo de desarrollo"}
                </p>
                <p className="mt-3 min-h-[4.5rem] whitespace-pre-line text-xs leading-5 text-[var(--muted-foreground)] sm:text-sm sm:leading-6">
                  {perfil.informacion || "Estudiante de la Universidad Luterana Salvadoreña y parte del equipo que desarrolló este sistema de inventario."}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted-foreground)]">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-[var(--primary)]">
            <path fillRule="evenodd" d="M10 1.75a.75.75 0 0 1 .75.75v.51a7.003 7.003 0 0 1 6.24 6.24h.51a.75.75 0 0 1 0 1.5h-.51a7.003 7.003 0 0 1-6.24 6.24v.51a.75.75 0 0 1-1.5 0v-.51a7.003 7.003 0 0 1-6.24-6.24H2.5a.75.75 0 0 1 0-1.5h.51a7.003 7.003 0 0 1 6.24-6.24V2.5a.75.75 0 0 1 .75-.75Zm0 4a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5Z" clipRule="evenodd" />
          </svg>
          Presentación del equipo que desarrolló el sistema de inventario.
        </div>
      </div>
    </div>
  );
}
