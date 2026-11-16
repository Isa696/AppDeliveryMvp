// La página del cliente comparte el menú guardado con el panel de administración.
import './slideCart.js';
import { cargarMenu, escaparHTML, getMenuData } from './menuData.js';

let menuOlivia = [];
let carrito = JSON.parse(localStorage.getItem('carrito_olivia')) || {};

// Dibuja cada categoría y producto dentro del contenedor del menú.
function renderizarMenu() {
  const container = document.getElementById("menu-container");
  if (!container) return;

  container.innerHTML = menuOlivia.map(categoria => {
    const platosHTML = categoria.platos.map(plato => {
      const cantidad = carrito[plato.id] ? carrito[plato.id].cantidad : 0;
      const nombre = escaparHTML(plato.nombre);
      const descripcion = escaparHTML(plato.descripcion);

      return `
        <div class="item-plato">
          <div class="plato-info-flex">
            <img src="${escaparHTML(plato.imagen)}" alt="${nombre}" class="plato-img">
            <div>
              <h3 class="plato-titulo">${nombre}</h3>
              ${descripcion ? `<p class="plato-desc">${descripcion}</p>` : ''}
            </div>
          </div>
          <div>
            <div class="precio">$ ${Number(plato.precio).toLocaleString("es-AR")}</div>
            <div class="contador">
              <button data-action="restar" data-id="${plato.id}" aria-label="Restar ${nombre}">-</button>
              <span id="cant-${plato.id}">${cantidad}</span>
              <button data-action="sumar" data-id="${plato.id}" aria-label="Sumar ${nombre}">+</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <section>
        <div class="banner-categoria">
          <h2>${escaparHTML(categoria.categoria)}</h2>
          ${categoria.subtitulo ? `<p>${escaparHTML(categoria.subtitulo)}</p>` : ''}
        </div>
        <div>${platosHTML}</div>
      </section>
    `;
  }).join("");
}

// Encuentra qué producto se tocó y cambia la cantidad del carrito.
function manejarBotonesContador(evento) {
  const boton = evento.target.closest("button[data-action]");
  if (!boton) return;

  const accion = boton.dataset.action;
  const id = Number(boton.dataset.id);
  const plato = menuOlivia.flatMap(categoria => categoria.platos).find(item => item.id === id);
  if (!plato) return;

  if (!carrito[id]) carrito[id] = { ...plato, cantidad: 0 };
  if (accion === "sumar") carrito[id].cantidad += 1;
  if (accion === "restar" && carrito[id].cantidad > 0) carrito[id].cantidad -= 1;
  if (carrito[id].cantidad === 0) delete carrito[id];

  localStorage.setItem('carrito_olivia', JSON.stringify(carrito));
  const contador = document.getElementById(`cant-${id}`);
  if (contador) contador.textContent = carrito[id] ? carrito[id].cantidad : 0;
  actualizarBotonCarrito();
  window.dispatchEvent(new Event('carritoActualizado'));
}

// Calcula el total y lo muestra en el botón flotante del carrito.
function actualizarBotonCarrito() {
  const total = Object.values(carrito).reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const botonCarrito = document.getElementById("open-cart-btn");
  if (botonCarrito) botonCarrito.textContent = `🛒 Ver tu pedido $${total.toLocaleString("es-AR")}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("menu-container");
  if (!container) return;

  container.textContent = "Cargando menú...";
  getMenuData()
    .then(menu => {
      menuOlivia = menu;
      renderizarMenu();
    })
    .catch(error => {
      console.error("No se pudo cargar el menú desde Supabase:", error);
      container.textContent = "No se pudo cargar el menú. Por favor, intenta nuevamente más tarde.";
    });

  actualizarBotonCarrito();
  // Un solo listener en el contenedor sirve para todos los botones del menú.
  container.addEventListener("click", manejarBotonesContador);
});

// Si el panel cambia el menú en otra pestaña, vuelve a cargarlo automáticamente.
window.addEventListener("storage", evento => {
  if (evento.key === "menu_olivia") {
    menuOlivia = cargarMenu();
    renderizarMenu();
  }
});

// El panel emite este evento cuando guarda cambios en la misma pestaña.
window.addEventListener("menuActualizado", () => {
  menuOlivia = cargarMenu();
  renderizarMenu();
});

