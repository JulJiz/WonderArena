# Parcial Práctico — WonderArena

**Tiempo:** 2 horas | **Individual** 

---

## Contexto

La empresa **ArenaLabs** lo ha contratado para desarrollar el backend y parte del frontend de **WonderArena**, un minijuego multijugador en tiempo real para dispositivos móviles.

La mecánica es la siguiente: cada jugador controla un círculo en una arena compartida inclinando su teléfono. Al colisionar con otro jugador, los círculos se empujan entre sí. Si un jugador sale de los límites de la arena, queda eliminado. El último en pie gana.

Su trabajo es implementar la autenticación, la comunicación en tiempo real mediante sockets, y la integración con el sensor de movimiento del dispositivo. **La lógica visual del juego (renderizado, arena, colisiones) ya está resuelta en el scaffolding entregado**.

---

## Scaffolding entregado

Descargue el repositorio de inicio y analícelo antes de comenzar.
**RECUERDE CONECTARSE A SUPABASE**

**Backend (Express + TypeScript)**
- Servidor HTTP funcional con CORS y body parser configurados.
- `POST /auth/signup` implementado y funcionando.
- Middleware de autenticación implementado en su propio archivo, pero **no aplicado** a ninguna ruta.
- Endpoint `GET /game/state` implementado y registrado, pero **sin protección de autenticación**.
- Socket.IO instalado como dependencia, sin configurar.
- Módulo de juego con la lógica de movimiento, colisiones y detección de límites ya implementada. Usted invoca sus métodos desde los eventos de socket.

**Frontend (React + TypeScript)**
- Aplicación que levanta correctamente.
- React Router configurado con rutas `/login`, `/signup` y `/game`.
- Página y lógica de `/signup` completamente implementadas.
- `AuthContext` montado sin lógica interna.
- Utilidad de `localStorage` (`saveTokens` / `getTokens`) implementada, lista para usar.
- Componente `Login` con formulario de UI, sin lógica.
- Componente `GameCanvas` que renderiza la arena y los jugadores según el estado recibido. **No debe modificarse.**
- Componente `Game` con estructura base. Usted implementa la conexión al socket, la activación del sensor y la función `moverJugador(dx, dy)`.

---

## Requerimientos

### REQ 1 — Autenticación (Backend)

**R1.1** `POST /auth/login`
- Recibe: `{ email, password }`
- Autentica al usuario con Supabase.
- Devuelve: `{ accessToken }`

**R1.2** Aplicar middleware
- El middleware de autenticación ya existe. Aplíquelo a las rutas del servidor que deban ser de acceso restringido.

---

### REQ 2 — Autenticación (Frontend)

**R2.1** Sesión
- Haga que la sesión sobreviva recargas.

**R2.2** Lógica de login
- Después de login exitoso, redirigir al juego.

**R2.3** Ruta protegida
- La ruta de juego debe ser privada.
- Las rutas `/login` y `/signup` deben redirigir al si el usuario ya está autenticado.

---

### REQ 3 — Sockets (Backend)

**R3.1** Configuración
- Adjunte Socket.IO al servidor HTTP de Express en el puerto existente, con seguridad y una ruta nueva.

**R3.2** Conexión
- Al conectarse un cliente, el servidor lo registra con una posición inicial y emite `game-update` a todos con el estado completo del juego.

**R3.3** Evento: `player-move` _(cliente → servidor)_
- Payload: `{ dx, dy }`
- El servidor mueve al jugador usando el módulo de juego, resuelve las colisiones y emite `game-update` a todos con el nuevo estado.

**R3.4** Eliminación
- Después de mover al jugador, si el módulo de juego detecta que salió de la arena, el servidor emite `player-eliminated` a todos con `{ id: socket.id }`.

**R3.5** Fin del juego
- Después de cada movimiento, si solo queda un jugador, el servidor emite `game-over` a todos con `{ winner: socket.id }`.

**R3.6** Desconexión
- Al desconectarse un cliente, el servidor lo elimina del estado y emite `game-update` con el estado actualizado.

---

### REQ 4 — Sensor + Sockets (Frontend)

**R4.1** Activación del acelerómetro
- La pantalla de juego incluye un botón para activar el sensor. Al presionarlo, solicite permiso al usuario según la plataforma, como fue visto en clase.

**R4.2** Lectura y emisión
- En cada evento del acelerómetro, almacene los valores `x` e `y` de la aceleración en una referencia.
- Use un intervalo periódico para leer esa referencia y mover al jugador.
- al mover el jugador debe emitir el evento `player-move` al servidor.

**R4.3** Escuchar `player-eliminated`
- Muestre un mensaje visible en pantalla indicando que un jugador fue eliminado.

**R4.4** Escuchar `game-over`
- Compare el `winner` recibido con el `socket.id` propio para mostrar "¡Ganaste!" o "¡Perdiste!" según corresponda.

**R4.5** Conexión al servidor
- Al montar la pantalla de juego, conéctese al servidor de Socket.IO.
- Al desmontar la pantalla, desconecte el socket.

---

## Eventos de socket — resumen

| Nombre | Dirección | Payload |
|---|---|---|
| `player-move` | cliente → servidor | `{ dx, dy }` |
| `game-update` | servidor → todos | `{ players: [{ id, x, y }] }` |
| `player-eliminated` | servidor → todos | `{ id }` |
| `game-over` | servidor → todos | `{ winner: id }` |

---

## Rúbrica de calificación

| Criterio | % |
|---|---|
| R1 — Auth backend (login, aplicar middleware) | 15% |
| R2 — Auth frontend (contexto, login, ruta privada) | 15% |
| R3 — Socket.IO backend (setup + eventos + estado) | 35% |
| R4 — Acelerómetro + integración socket en cliente | 25% |
| Patrones vistos en clase aplicados correctamente | 10% |
| **Total** | **100%** |