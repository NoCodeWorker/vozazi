/**
 * Settings Page
 * 
 * Página de configuración.
 */

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tus preferencias
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Perfil</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona tu información personal
          </p>
        </div>

        {/* Preferences */}
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Preferencias</h3>
          <p className="text-sm text-muted-foreground">
            Configura tu experiencia
          </p>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Notificaciones</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona tus notificaciones
          </p>
        </div>
      </div>
    </div>
  )
}
