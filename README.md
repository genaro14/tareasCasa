# Tareas Casa 🏠

Aplicación para organizar la vida diaria con calendario de comidas, lista de supermercado y tareas del hogar.

## 🚀 Quick Start con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **MySQL**: localhost:3306

## 👤 Usuarios por defecto

| Usuario | Contraseña |
|---------|------------|
| user1    | changeme   |
| user2 | changeme   |

⚠️ **Importante**: Cambia las contraseñas después del primer login en Ajustes.

## 🛠️ Desarrollo Local

### Requisitos
- Node.js 20+
- Docker & Docker Compose (para MySQL)

### Setup

```bash
# 1. Iniciar solo la base de datos
docker-compose up -d db

# 2. Instalar dependencias del API
cd api && npm install

# 3. Instalar dependencias del frontend
cd .. && npm install

# 4. Iniciar API (en una terminal)
cd api && npm run dev

# 5. Iniciar Frontend (en otra terminal)
npm run dev
```

### Variables de Entorno

**API** (`api/.env`):
```env
DB_HOST=localhost
DB_USER=tareas_user
DB_PASSWORD=tareas_password
DB_NAME=tareas_casa
DB_PORT=3306
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Estructura del Proyecto

```
tareas-casa/
├── api/                    # Backend Express
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, error handling
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── index.js       # Entry point
│   └── tests/             # API tests
├── src/                    # Frontend React
│   ├── components/        # UI components
│   ├── context/           # React contexts
│   ├── pages/             # Page components
│   └── services/          # API client
├── db/
│   ├── init.sql           # Schema & users
│   └── seeds/             # Example data
└── docker-compose.yml
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/login` - Login (público)
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/change-password` - Cambiar contraseña

### Meals
- `GET /api/meals` - Listar comidas
- `POST /api/meals` - Crear comida
- `PUT /api/meals/:id` - Actualizar comida
- `DELETE /api/meals/:id` - Eliminar comida

### Grocery Items
- `GET /api/grocery-items` - Listar items
- `POST /api/grocery-items` - Crear item
- `PATCH /api/grocery-items/:id/toggle` - Toggle comprado
- `DELETE /api/grocery-items/:id` - Eliminar item

### Tasks
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `PATCH /api/tasks/:id/toggle` - Toggle completada
- `DELETE /api/tasks/:id` - Eliminar tarea

### Health
- `GET /api/health` - Health check (público)

## 🧪 Tests

```bash
cd api && npm test
```

## 📝 Seeds (Datos de ejemplo)

Los datos de ejemplo están en `db/seeds/`. Para recargar:

```bash
# Reset completo (elimina datos existentes)
docker-compose down -v
docker-compose up -d
```

## 🔒 Seguridad

- JWT para autenticación
- Bcrypt para hash de contraseñas
- Todos los endpoints (excepto health y login) requieren token

## 📦 Producción

```bash
# Build y deploy
docker-compose -f docker-compose.yml up -d --build

# Sin override de desarrollo
docker-compose -f docker-compose.yml up -d
```
