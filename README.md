# 🛵 AppDelivery MVP


> MVP de plataforma de delivery para conectar clientes, comercios y repartidores. Proyecto académico enfocado en validar el flujo completo de un pedido.

![Status](https://img.shields.io/badge/Status-En%20Desarrollo-yellow)
![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20JS%20%7C%20MariaDB-blue)

### 📑 Documentación visual del proyecto

![Presentación del Proyecto](./docs/images/presentacion.jpeg)

### 📋 2. Priorización MoSCoW

![Tabla MoSCoW](./docs/images/moscow-table.jpeg)

### 📸 1. Preview de la App

<!-- REEMPLAZAR RUTA CUANDO SUBAN LA IMAGEN -->
![Preview AppDelivery](./docs/images/app-preview.jpg)


## 🎯 Objetivo del MVP

Crear un flujo mínimo y funcional donde un cliente pueda hacer un pedido, el comercio lo reciba y se notifique por WhatsApp, sin depender de plataformas con altas comisiones.

## ✨ Funcionalidades (Alcance MVP)

- **Cliente:** Ver catálogo, armar carrito y enviar pedido.
- **Comercio:** Recibir pedido y cambiar estado (Pendiente / En preparación / Listo) manual via whats app.

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3
- JavaScript (Vanilla)

**Backend:**
- JavaScript
- Base de datos: MariaDB

**Otros:**
- WhatsApp API para envio de formularios

## 📁 Estructura del Proyecto

```bash
/appdelivery-mvp
├── /docs
│ └── /images
├──  css
│ └── /admin.css
│ └── /index.css
│ └── /slideCart.css
├──  js
│ └── /admin.js
│ └── /idex.js
│ └── /menuData.js
│ └── /slideCart.js
├── /backend
├──  index.html
├──  admin.html
└── README.md
## 🚀 Cómo correr el proyecto local

1. Clonar
git clone https://github.com/Isa696/AppDeliveryMvp.git

4. Frontend
Abrir `index.html` con Live Server o abrir directo en el navegador.

### Panel de administración (modo de práctica)

1. Iniciar el proyecto con Live Server para que el navegador pueda cargar los módulos JavaScript.
2. Abrir `admin.html`.
3. Ingresar con el usuario `pepito2008` y la contraseña `hellodude!`.
4. Agregar, editar o eliminar productos y categorías. Los cambios se guardan en `localStorage` y la página `index.html` los lee desde el mismo navegador.

Este acceso es solo una demostración de frontend: las credenciales están en JavaScript y cualquiera puede verlas desde el navegador. Para usarlo en una web publicada hace falta validar el inicio de sesión en un backend y guardar el menú en una base de datos para compartir los cambios con otros dispositivos.

---

## 👥 Integrantes

- *Lautaro Karim Lopez*
- *Nicolas Trotti*
- *Isaias Romero*

## 🗺️ Próximos Pasos

- Mockups y presentación
- [ ] Conexión Frontend - Backend
- [ ] Integración MariaDB
- [ ] Integración WhatsApp API
