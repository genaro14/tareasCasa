# 📝 Aplicación de Tareas

Una aplicación sencilla y práctica para organizar la vida diaria con tres funciones principales:  
- **Calendario de menú de comidas**  
- **Lista de supermercado (web)**  
- **Recordatorios de tareas del hogar**

---

## 🚀 Funcionalidades

### 📅 Calendario de menú de comidas
- Asigna un **nombre de comida por día** (ejemplo: “Pizza”, “Ensalada”, “Milanesas”).  
- No se incluyen ingredientes ni recetas, solo el título del plato.  
- Ideal para planificar la semana de manera rápida.

### 🛒 Lista de supermercado (web)
- Implementada como una **interfaz web** accesible desde el navegador.  
- Permite **agregar y quitar ítems** de manera dinámica.  
- Pensada para reutilizar: los ítems eliminados pueden volver a añadirse sin necesidad de escribirlos de nuevo.  
- Ejemplo: “Leche”, “Pan”, “Arroz”.

### ✅ Recordatorios de tareas del hogar
- Se integran en el calendario como **tareas pendientes**.  
- Ejemplos: “Sacar la basura”, “Limpiar el living”, “Regar las plantas”.  
- Los recordatorios aparecen en el día correspondiente para no olvidarlos.

---

## 📂 Estructura del proyecto
/app
 ├── calendar/        # Función de calendario de comidas
 ├── grocery-web/     # Lista de supermercado como aplicación web
 ├── tasks/           # Recordatorios de tareas del hogar
 └── README.md        # Documentación del proyecto

---

## ⚙️ Instalación
1. Clonar el repositorio:
   git clone https://github.com/usuario/tareas-app.git
   cd tareas-app

2. Instalar dependencias:
   npm install

3. Ejecutar la aplicación:
   npm start

---

## 🎯 Uso
- **Calendario**: seleccionar un día y asignar el nombre de la comida.  
- **Lista de supermercado (web)**: abrir la interfaz en el navegador, agregar ítems con el botón “+” y eliminarlos con “x”.  
- **Recordatorios**: crear una tarea y asignarla a un día en el calendario.

---

## 📌 Próximas mejoras
- Exportar la lista de supermercado a PDF desde la web.  
- Notificaciones automáticas para recordatorios.  
- Sincronización con dispositivos móviles.
