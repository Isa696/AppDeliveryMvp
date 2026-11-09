<<<<<<< HEAD
// import './admin.js'; // Comentado hasta que crees la sección de administración
import './slideCart.js';

// import './admin.js';
import './slideCart.js';

// =========================================
// MENÚ DE EMPANADAS
// =========================================

const menuOlivia = [
  {
    categoria: "Aprovechá nuestras PROMOS exclusivas para vos!",
    subtitulo: "No incluyen Soufflé ni Fatay",
    platos: [
      {
        id: 101,
        nombre: "18 EMPANADAS A ELECCION",
        descripcion: "",
        precio: 51100,
        imagen: "https://via.placeholder.com/50"
      }
    ]
  },
  {
    categoria: "Empanadas Clásicas - 120 grs. (HOJALDRE)",
    subtitulo: "",
    platos: [
      {
        id: 1,
        nombre: "CARNE SUAVE",
        descripcion: "Carne picada, cebolla, huevo, morrón rojo y verdeo.",
        precio: 3300,
        imagen: "https://via.placeholder.com/50"
      },
      {
        id: 2,
        nombre: "JAMÓN Y QUESO",
        descripcion: "Jamón cocido y muzzarella",
        precio: 3300,
        imagen: "https://via.placeholder.com/50"
      },
      {
        id: 3,
        nombre: "HUMITA",
        descripcion: "Choclo amarillo, cebolla, salsa blanca y queso reggianito.",
        precio: 3300,
        imagen: "https://via.placeholder.com/50"
      },
      {
        id: 4,
        nombre: "POLLO",
        descripcion: "Pollo, cebolla, huevo, verdeo, morrón rojo",
        precio: 3300,
        imagen: "https://via.placeholder.com/50"
      }
    ]
  }
];

let carrito = JSON.parse(localStorage.getItem('carrito_olivia')) || {};

=======
// La página del cliente comparte el menú guardado con el panel de administración.
import './slideCart.js';
import { cargarMenu, escaparHTML } from './menuData.js';

let menuOlivia = cargarMenu();
let carrito = JSON.parse(localStorage.getItem('carrito_olivia')) || {};

// Dibuja cada categoría y producto dentro del contenedor del menú.
>>>>>>> karimBranch
function renderizarMenu() {
  const container = document.getElementById("menu-container");
  if (!container) return;

<<<<<<< HEAD
  const htmlFinal = menuOlivia.map(cat => {
    const platosHTML = cat.platos.map(plato => {
      const cantidad = carrito[plato.id] ? carrito[plato.id].cantidad : 0;
=======
  container.innerHTML = menuOlivia.map(categoria => {
    const platosHTML = categoria.platos.map(plato => {
      const cantidad = carrito[plato.id] ? carrito[plato.id].cantidad : 0;
      const nombre = escaparHTML(plato.nombre);
      const descripcion = escaparHTML(plato.descripcion);
>>>>>>> karimBranch

      return `
        <div class="item-plato">
          <div class="plato-info-flex">
<<<<<<< HEAD
            <img src="${plato.imagen}" alt="${plato.nombre}" class="plato-img">
            <div>
              <h3 class="plato-titulo">${plato.nombre}</h3>
              ${plato.descripcion ? `<p class="plato-desc">${plato.descripcion}</p>` : ''}
            </div>
          </div>
          <div>
            <div class="precio">$ ${plato.precio}</div>
            <div class="contador">
              <button data-action="restar" data-id="${plato.id}">-</button>
              <span id="cant-${plato.id}">${cantidad}</span>
              <button data-action="sumar" data-id="${plato.id}">+</button>
=======
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
>>>>>>> karimBranch
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <section>
        <div class="banner-categoria">
<<<<<<< HEAD
          <h2>${cat.categoria}</h2>
          ${cat.subtitulo ? `<p>${cat.subtitulo}</p>` : ''}
        </div>
        <div>
          ${platosHTML}
        </div>
      </section>
    `;
  }).join("");

  container.innerHTML = htmlFinal;
  container.addEventListener("click", manejarBotonesContador);
}

function manejarBotonesContador(e) {
  const target = e.target;
  const action = target.getAttribute("data-action");
  const id = parseInt(target.getAttribute("data-id"));

  if (!action || isNaN(id)) return;

  let platoEncontrado = null;
  menuOlivia.forEach(cat => {
    const p = cat.platos.find(item => item.id === id);
    if (p) platoEncontrado = p;
  });

  if (!platoEncontrado) return;

  if (!carrito[id]) {
    carrito[id] = { ...platoEncontrado, cantidad: 0 };
  }

  if (action === "sumar") {
    carrito[id].cantidad += 1;
  } else if (action === "restar" && carrito[id].cantidad > 0) {
    carrito[id].cantidad -= 1;
  }

  if (carrito[id].cantidad === 0) {
    delete carrito[id];
  }

  localStorage.setItem('carrito_olivia', JSON.stringify(carrito));

  const spanCant = document.getElementById(`cant-${id}`);
  if (spanCant) {
    spanCant.textContent = carrito[id] ? carrito[id].cantidad : 0;
  }

=======
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
>>>>>>> karimBranch
  actualizarBotonCarrito();
  window.dispatchEvent(new Event('carritoActualizado'));
}

<<<<<<< HEAD
function actualizarBotonCarrito() {
  let total = 0;
  Object.values(carrito).forEach(item => {
    total += item.precio * item.cantidad;
  });

  const cartBtn = document.getElementById("open-cart-btn");
  if (cartBtn) {
    cartBtn.textContent = `🛒 Ver tu pedido $${total}`;
  }
=======
// Calcula el total y lo muestra en el botón flotante del carrito.
function actualizarBotonCarrito() {
  const total = Object.values(carrito).reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const botonCarrito = document.getElementById("open-cart-btn");
  if (botonCarrito) botonCarrito.textContent = `🛒 Ver tu pedido $${total.toLocaleString("es-AR")}`;
>>>>>>> karimBranch
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarMenu();
  actualizarBotonCarrito();
<<<<<<< HEAD
});
=======
  // Un solo listener en el contenedor sirve para todos los botones del menú.
  document.getElementById("menu-container")?.addEventListener("click", manejarBotonesContador);
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
>>>>>>> karimBranch
