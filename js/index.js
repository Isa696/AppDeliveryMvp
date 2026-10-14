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

function renderizarMenu() {
  const container = document.getElementById("menu-container");
  if (!container) return;

  const htmlFinal = menuOlivia.map(cat => {
    const platosHTML = cat.platos.map(plato => {
      const cantidad = carrito[plato.id] ? carrito[plato.id].cantidad : 0;

      return `
        <div class="item-plato">
          <div class="plato-info-flex">
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
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <section>
        <div class="banner-categoria">
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

  actualizarBotonCarrito();
  window.dispatchEvent(new Event('carritoActualizado'));
}

function actualizarBotonCarrito() {
  let total = 0;
  Object.values(carrito).forEach(item => {
    total += item.precio * item.cantidad;
  });

  const cartBtn = document.getElementById("open-cart-btn");
  if (cartBtn) {
    cartBtn.textContent = `🛒 Ver tu pedido $${total}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarMenu();
  actualizarBotonCarrito();
});