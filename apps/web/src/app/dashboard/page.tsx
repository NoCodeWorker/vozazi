/**
 * Dashboard Page
 * 
 * Página principal del dashboard.
 */

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tu actividad vocal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Sesiones Totales
          </h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Tiempo Total
          </h3>
          <p className="text-2xl font-bold">0 min</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Puntuación Media
          </h3>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Racha Actual
          </h3>
          <p className="text-2xl font-bold">0 días</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-semibold">No hay actividad reciente</h3>
        <p className="text-muted-foreground">
          Comienza tu primera sesión de práctica para ver tu progreso aquí.
        </p>
      </div>
    </div>
  )
}
