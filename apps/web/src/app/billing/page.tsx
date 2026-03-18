/**
 * Billing Page
 * 
 * Página de facturación y planes.
 */

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Facturación</h1>
        <p className="text-muted-foreground">
          Gestiona tu suscripción y plan
        </p>
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Free Plan */}
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Gratis</h3>
          <p className="text-3xl font-bold">$0</p>
          <p className="text-sm text-muted-foreground">/mes</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✓ 10 sesiones/mes</li>
            <li>✓ Análisis básico</li>
            <li>✓ Ejercicios limitados</li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="rounded-lg border border-primary p-6">
          <h3 className="text-lg font-semibold">Pro</h3>
          <p className="text-3xl font-bold">$19.99</p>
          <p className="text-sm text-muted-foreground">/mes</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✓ Sesiones ilimitadas</li>
            <li>✓ Análisis avanzado</li>
            <li>✓ Todos los ejercicios</li>
            <li>✓ Seguimiento de progreso</li>
          </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Enterprise</h3>
          <p className="text-3xl font-bold">$49.99</p>
          <p className="text-sm text-muted-foreground">/mes</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✓ Todo lo del plan Pro</li>
            <li>✓ Coaching con IA</li>
            <li>✓ Ejercicios personalizados</li>
            <li>✓ Soporte dedicado</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
