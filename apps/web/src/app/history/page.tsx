/**
 * History Page
 * 
 * Historial de sesiones.
 */

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historial</h1>
        <p className="text-muted-foreground">
          Revisa tus sesiones anteriores
        </p>
      </div>

      {/* Empty State */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-semibold">No hay sesiones</h3>
        <p className="text-muted-foreground">
          Completa tu primera sesión para ver tu historial aquí.
        </p>
      </div>
    </div>
  )
}
