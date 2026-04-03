# 📘 Contexto de la Aplicación de Tareas

Este documento define el contexto y lineamientos para el desarrollo de la aplicación de tareas.  
La aplicación se construirá con **React** y **shadcn/ui**, utilizando un estilo **minimalista con acentos de color**.  
Los componentes estarán organizados en la carpeta `src`.

---

## 🎯 Objetivo
Crear una aplicación simple y reutilizable que ayude a organizar la vida diaria mediante:
1. **Calendario de menú de comidas** (solo nombres de platos por día).
2. **Lista de supermercado** como aplicación web interactiva.
3. **Recordatorios de tareas del hogar** integrados en el calendario.

---

## 🛠️ Tecnologías
- **Frontend**: React + shadcn/ui  
- **Estilos**: minimalistas, con paleta neutra y acentos de color para resaltar acciones importantes.  
- **Organización**: componentes en `src/components`, lógica en `src/context` y vistas en `src/pages`.  
- **Gestión de estado**: React Context API para compartir datos entre módulos.  

---

## 📂 Estructura sugerida
/src
 ├── components/       # Botones, inputs, tarjetas, modales
 ├── context/          # Contextos globales (estado de tareas, lista, calendario)
 ├── pages/            # Vistas principales (Calendario, Supermercado, Tareas)
 ├── utils/            # Funciones auxiliares
 └── App.jsx           # Punto de entrada

---

## 🔍 Detalles de cada módulo

### 📅 Calendario de menú de comidas
- Cada día muestra el **nombre del plato** asignado.  
- No se guardan ingredientes ni recetas.  
- Interfaz simple: selector de día + campo de texto.  
- Estado global: `MenuContext` para almacenar comidas por fecha.  

### 🛒 Lista de supermercado (web)
- Implementada como una **interfaz web** accesible desde el navegador.  
- Ítems se pueden **agregar y eliminar** dinámicamente.  
- Lista pensada para **reutilización**: ítems eliminados pueden volver a añadirse.  
- UI minimalista con botones claros y acentos de color.  
- Estado global: `GroceryContext` para manejar la lista de ítems.  

### ✅ Recordatorios de tareas del hogar
- Se integran en el calendario como **tareas pendientes**.  
- Ejemplos: “Sacar la basura”, “Limpiar el living”.  
- Se muestran en el día correspondiente con opción de marcar como completadas.  
- Estado global: `TasksContext` para manejar tareas y su estado (pendiente/completada).  

---

## 🎨 Lineamientos de diseño

### Paleta de colores
- **Base neutra**:  
  - Fondo: `#f9fafb` (gris muy claro)  
  - Texto principal: `#111827` (gris oscuro)  
  - Texto secundario: `#6b7280` (gris medio)  

- **Acentos de color**:  
  - Acción positiva (confirmar, agregar): `#10b981` (verde esmeralda)  
  - Acción negativa (eliminar, cancelar): `#ef4444` (rojo suave)  
  - Acción informativa (notificaciones, enlaces): `#3b82f6` (azul brillante)  

### Tipografía
- Fuente: **Inter** o **Roboto**, estilo limpio y legible.  
- Tamaños consistentes: títulos grandes, texto de cuerpo mediano, etiquetas pequeñas.  

### Componentes UI
- Botones minimalistas con acento de color.  
- Inputs con borde gris claro y foco en color acento.  
- Tarjetas para mostrar comidas, ítems y tareas.  
- Layout responsivo para escritorio y móvil.  

---

## 📌 Próximas mejoras
- Exportar lista de supermercado a PDF desde la web.  
- Notificaciones automáticas para recordatorios.  
- Sincronización con dispositivos móviles.  
- Integración con almacenamiento local o base de datos ligera (ej. SQLite, IndexedDB).  
