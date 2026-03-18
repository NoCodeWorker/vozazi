/**
 * Library Page
 * 
 * Biblioteca de ejercicios y recursos.
 */

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Biblioteca</h1>
        <p className="text-muted-foreground">
          Explora ejercicios y recursos vocales
        </p>
      </div>

      {/* Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Técnicas</h3>
          <p className="text-sm text-muted-foreground">
            Ejercicios por técnica vocal
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Anatomía</h3>
          <p className="text-sm text-muted-foreground">
            Aprende sobre tu instrumento vocal
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Problemas Comunes</h3>
          <p className="text-sm text-muted-foreground">
            Soluciones para problemas vocales
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Salud Vocal</h3>
          <p className="text-sm text-muted-foreground">
            Cuida tu voz y previene lesiones
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Recursos</h3>
          <p className="text-sm text-muted-foreground">
            Herramientas y guías adicionales
          </p>
        </div>
      </div>
    </div>
  )
}
