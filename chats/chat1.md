# Login administrativo multiequipo

_Started 2026-04-23 17:41 UTC_

---

## User

Crea un sistema  de login para administrar grupos y usuarios.
Tengo un Back Office al que van a entrar 3 equipos distintos. 
Los equipos son: Integraciones, Tech y Producto.

Cada uno de esos equipos están compuestos por un grupo de personas. 
Quiero tener la posibilidad desde un super admin de agregar personas a equipos y que esas personas tengan permisos para su espacio en particular

## Assistant

Voy a ayudarte a diseñar este sistema de administración de usuarios y grupos. Antes de empezar, me gustaría hacerte algunas preguntas clave para asegurarme de crear algo que realmente se ajuste a tus necesidades.

_[tool: questions_v2]_

## User

Questions answered:
- scope: Login (pantalla de entrada), Dashboard del Super Admin, Lista/gestión de equipos, Detalle de un equipo (miembros + permisos), Crear/editar usuario, Crear/editar equipo, Gestión de permisos/roles, Vista del usuario normal (lo que ve alguien de Integraciones/Tech/Producto al entrar)
- design_context: No, empieza desde cero con estética moderna y profesional
- aesthetic: Minimal y profesional (mucho espacio en blanco, tipografía limpia)
- permissions_model: Cada equipo tiene su propio espacio; los miembros solo ven el suyo, Una persona puede pertenecer a varios equipos
- roles: Super Admin + Admin de equipo + Miembro + Lector/Invitado
- super_admin_features: Asignar usuarios a equipos, Crear/eliminar equipos, Cambiar permisos/roles de usuarios, Ver actividad/auditoría, Configurar permisos por equipo, Ver métricas globales, Suspender/desactivar usuarios, Invitar usuarios por email
- login_method: Email + contraseña
- variations: Sí, variaciones del modelo de permisos (cómo se visualiza)
- interactivity: Decide for me
- language: Español

## Assistant

Perfecto, tengo toda la información que necesito. Voy a construir un prototipo interactivo completo con todas las pantallas que pediste.

**Dirección de diseño** (estética definida desde cero):
- **Tipografía:** Inter para UI + IBM Plex Mono para datos/códigos (labels técnicos, IDs)
- **Paleta:** Neutros cálidos (blancos con tono muy leve), negro suave para texto, un acento índigo-violeta para acciones primarias
- **Sistema:** Minimal, mucho espacio en blanco, bordes 1px sutiles, sin sombras pesadas, radios pequeños (6-8px)
- **Densidad:** Equilibrada — admin profesional pero respirado

Lo voy a estructurar como un **prototipo navegable completo** en un solo archivo con sidebar, y ofreceré **3 variaciones del modelo de permisos** vía Tweaks (tabla/matriz, checkboxes agrupados, y cards con toggles).

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: read_file]_

Ahora voy a construir el prototipo. Lo divido en archivos para mantenerlo manejable.

_[tool: write_file]_

_[tool: snip]_

Now let me write the data and icon helpers, then the main app.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Listo. Armé un prototipo interactivo completo del Back Office con login y administración de usuarios/grupos.

**Lo que incluye:**

**Pantallas**
- **Login** — Email + contraseña con validación, mock visual de equipos a la derecha
- **Dashboard Super Admin** — Métricas globales, equipos con barras de ocupación, actividad reciente
- **Equipos** — Grid de tarjetas con miembros, admins y recursos por equipo
- **Detalle de equipo** — 3 pestañas: Miembros (con búsqueda y filtros), Permisos por rol, Ajustes
- **Usuarios** — Tabla con filtros (activos/pendientes/suspendidos), menú de acciones, invitar/editar/suspender
- **Roles y permisos** — Vista global de los 4 roles (Super Admin, Admin de equipo, Miembro, Lector)
- **Auditoría** — Log cronológico completo con IP/dispositivo
- **Vista de miembro** — Espacio específico por equipo, con selector de equipo (ya que una persona puede pertenecer a varios)

**Interacciones reales**
- Invitar usuario → agrega fila con estado "Pendiente" y muestra toast
- Asignar a múltiples equipos con rol inicial
- Editar pertenencia a equipos y cambiar rol por equipo
- Suspender/reactivar con feedback
- Cambio de rol toggle-able
- Crear equipo nuevo
- **Botón abajo a la izquierda del sidebar** cambia entre vista Super Admin ↔ vista Miembro

**3 variaciones del modelo de permisos** (activables vía el toggle **Tweaks** en la toolbar, o el segmented control dentro de cada pantalla de permisos):
1. **Matriz** — tabla con roles en columnas, ideal para comparar
2. **Grupos** — permisos colapsables por categoría (Recursos, Miembros, Configuración, Auditoría) con checkbox maestro indeterminado
3. **Cards** — grid con switches, más visual y moderno

**Sistema de diseño**
- Inter + JetBrains Mono, paleta neutra cálida, acento índigo (cambiable en Tweaks)
- Cada equipo tiene su color propio (Integraciones índigo, Tech verde, Producto ámbar)
- Roles pintados consistentemente en toda la app

Entrá con cualquier email válido y contraseña de 6+ caracteres. Decime si querés ajustar alguna pantalla, agregar SSO, o explorar otras variaciones.

## User

Save this design as a PDF: Sistema de Administracion.html

## Assistant

I'll create a print-ready version of the Back Office design, showing key screens as pages.

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: snip]_

_[tool: get_webview_logs]_

No errors. Opening for print.

_[tool: open_for_print]_

El PDF está listo — incluye las 11 pantallas (login, dashboard, equipos, detalle, las 3 variantes de permisos, usuarios, invitación, auditoría y vista de miembro). Si no se abrió el diálogo de impresión automáticamente, abrilo manualmente desde este link y usá Cmd/Ctrl+P → Guardar como PDF:

[Abrir para imprimir →](https://9bce994b-1fa6-4a57-8795-b51e29f63469.claudeusercontent.com/v1/design/projects/9bce994b-1fa6-4a57-8795-b51e29f63469/serve/Sistema%20de%20Administracion-print.html?t=801f08ead0c355c136871434d4cf1aaa5da84ac10d5d44e3e5949e045b4b8c6f.a18c516f-ad42-43be-b892-a7c310bba986.1fa7d592-27dc-416a-8a65-be307429acb4.1776969689)

