// Reutiliza el renderizador de menú y el carrito completos de la página del cliente.
import "./index.js";
import { cargarMenu, guardarMenu, escaparHTML } from "./menuData.js";

// Estas credenciales son solo para practicar el flujo de inicio de sesión.
// Al estar en JavaScript del navegador, no sirven como seguridad real para producción.
const USUARIO_ADMIN = "pepito2008";
const CONTRASENA_ADMIN = "hellodude!";
const CLAVE_SESION = "olivia_admin_activo";

let menu = cargarMenu();

// Guardamos referencias a los elementos HTML que el script necesita actualizar.
const loginPanel = document.getElementById("login-panel");
const adminPanel = document.getElementById("admin-panel");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const productForm = document.getElementById("product-form");
const categoryForm = document.getElementById("category-form");
const productCategory = document.getElementById("product-category");
const productList = document.getElementById("product-list");
const categoryList = document.getElementById("category-list");

// Alterna entre el formulario de ingreso y las herramientas de edición.
function mostrarPanelAdmin(estaAutenticado) {
  loginPanel.hidden = estaAutenticado;
  adminPanel.hidden = !estaAutenticado;
  if (estaAutenticado) dibujarPanel();
}

// Comprueba los datos escritos y recuerda el acceso hasta cerrar la pestaña.
loginForm.addEventListener("submit", evento => {
  evento.preventDefault(); // Evita que el formulario recargue la página.
  const usuario = document.getElementById("username").value.trim();
  const contrasena = document.getElementById("password").value;

  if (usuario === USUARIO_ADMIN && contrasena === CONTRASENA_ADMIN) {
    sessionStorage.setItem(CLAVE_SESION, "si");
    loginMessage.textContent = "";
    loginForm.reset();
    mostrarPanelAdmin(true);
  } else {
    loginMessage.textContent = "El usuario o la contraseña no son correctos.";
  }
});

// Al cerrar la sesión volvemos a mostrar el formulario de ingreso.
document.getElementById("logout-button").addEventListener("click", () => {
  sessionStorage.removeItem(CLAVE_SESION);
  mostrarPanelAdmin(false);
});

// Agrega una categoría nueva al menú.
categoryForm.addEventListener("submit", evento => {
  evento.preventDefault();
  const nombre = document.getElementById("category-name").value.trim();
  const subtitulo = document.getElementById("category-subtitle").value.trim();
  if (!nombre) return;

  menu.push({ categoria: nombre, subtitulo, platos: [] });
  guardarYActualizar();
  categoryForm.reset();
});

// Guarda un producto nuevo o los cambios de un producto existente.
productForm.addEventListener("submit", evento => {
  evento.preventDefault();
  const idActual = document.getElementById("product-id").value;
  const categoriaElegida = Number(productCategory.value);
  const nombre = document.getElementById("product-name").value.trim();
  const descripcion = document.getElementById("product-description").value.trim();
  const precio = Number(document.getElementById("product-price").value);
  const imagen = document.getElementById("product-image").value.trim() || "https://via.placeholder.com/50";

  // Validaciones sencillas para evitar datos vacíos o precios negativos.
  if (!menu[categoriaElegida] || !nombre || !Number.isFinite(precio) || precio < 0) {
    alert("Completá el nombre y un precio válido.");
    return;
  }

  if (idActual) {
    // Primero quitamos el producto de la categoría anterior al editarlo.
    menu.forEach(categoria => {
      categoria.platos = categoria.platos.filter(plato => String(plato.id) !== idActual);
    });
  }

  // Al editar conservamos el ID para que el producto siga identificado igual.
  const plato = {
    id: idActual ? Number(idActual) : Date.now(),
    nombre,
    descripcion,
    precio,
    imagen
  };
  menu[categoriaElegida].platos.push(plato);

  // Actualizamos también los datos guardados en el carrito, si ya estaba agregado.
  const carrito = JSON.parse(localStorage.getItem("carrito_olivia") || "{}");
  if (carrito[plato.id]) carrito[plato.id] = { ...plato, cantidad: carrito[plato.id].cantidad };
  localStorage.setItem("carrito_olivia", JSON.stringify(carrito));

  limpiarFormularioProducto();
  guardarYActualizar();
});

// Reinicia el formulario cuando se cancela una edición.
document.getElementById("cancel-edit-button").addEventListener("click", limpiarFormularioProducto);

// Guarda el menú y vuelve a dibujar todos los listados que dependen de él.
function guardarYActualizar() {
  guardarMenu(menu);
  // El evento avisa al renderizador del menú, que vive en este mismo documento.
  window.dispatchEvent(new Event("menuActualizado"));
  dibujarPanel();
}

// Actualiza el selector, las categorías, los productos y la vista previa.
function dibujarPanel() {
  dibujarSelectorCategorias();
  dibujarCategorias();
  dibujarProductos();
}

function dibujarSelectorCategorias() {
  productCategory.innerHTML = menu.map((categoria, indice) =>
    `<option value="${indice}">${escaparHTML(categoria.categoria)}</option>`
  ).join("");
}

// Dibuja las categorías con controles para cambiarles el nombre o quitarlas.
function dibujarCategorias() {
  categoryList.innerHTML = menu.map((categoria, indice) => `
    <li>
      <span>${escaparHTML(categoria.categoria)}</span>
      <span class="category-actions">
        <button type="button" data-rename-category="${indice}" class="small-button">Renombrar</button>
        <button type="button" data-delete-category="${indice}" class="small-button danger-button">Eliminar</button>
      </span>
    </li>
  `).join("") || "<li>Todavía no hay categorías.</li>";
}

// Dibuja cada producto con botones para editarlo o eliminarlo.
function dibujarProductos() {
  const productos = menu.flatMap((categoria, indiceCategoria) =>
    categoria.platos.map(plato => ({ ...plato, nombreCategoria: categoria.categoria, indiceCategoria }))
  );

  productList.innerHTML = productos.map(plato => `
    <article class="managed-product">
      <div>
        <h4>${escaparHTML(plato.nombre)}</h4>
        <p>${escaparHTML(plato.nombreCategoria)} · $${Number(plato.precio).toLocaleString("es-AR")}</p>
        <p>${escaparHTML(plato.descripcion)}</p>
      </div>
      <div class="product-actions">
        <button type="button" class="admin-button secondary-button" data-edit-product="${plato.id}">Editar</button>
        <button type="button" class="admin-button danger-button" data-delete-product="${plato.id}">Eliminar</button>
      </div>
    </article>
  `).join("") || "<p>Todavía no hay productos en el menú.</p>";
}

// Los botones se manejan desde el contenedor porque las filas se crean dinámicamente.
productList.addEventListener("click", evento => {
  const botonEditar = evento.target.closest("[data-edit-product]");
  const botonEliminar = evento.target.closest("[data-delete-product]");

  if (botonEditar) editarProducto(Number(botonEditar.dataset.editProduct));
  if (botonEliminar) eliminarProducto(Number(botonEliminar.dataset.deleteProduct));
});

categoryList.addEventListener("click", evento => {
  const botonRenombrar = evento.target.closest("[data-rename-category]");
  const botonEliminar = evento.target.closest("[data-delete-category]");

  if (botonRenombrar) renombrarCategoria(Number(botonRenombrar.dataset.renameCategory));
  if (botonEliminar) eliminarCategoria(Number(botonEliminar.dataset.deleteCategory));
});

function editarProducto(id) {
  const indiceCategoria = menu.findIndex(categoria => categoria.platos.some(plato => plato.id === id));
  const plato = menu[indiceCategoria]?.platos.find(item => item.id === id);
  if (!plato) return;

  document.getElementById("product-id").value = plato.id;
  productCategory.value = indiceCategoria;
  document.getElementById("product-name").value = plato.nombre;
  document.getElementById("product-description").value = plato.descripcion;
  document.getElementById("product-price").value = plato.precio;
  document.getElementById("product-image").value = plato.imagen.startsWith("https://via.placeholder.com") ? "" : plato.imagen;
  document.getElementById("product-form-title").textContent = "Editar producto";
  document.getElementById("cancel-edit-button").hidden = false;
  document.getElementById("product-name").focus();
}

function eliminarProducto(id) {
  if (!confirm("¿Querés eliminar este producto del menú?")) return;
  menu.forEach(categoria => {
    categoria.platos = categoria.platos.filter(plato => plato.id !== id);
  });
  const carrito = JSON.parse(localStorage.getItem("carrito_olivia") || "{}");
  delete carrito[id];
  localStorage.setItem("carrito_olivia", JSON.stringify(carrito));
  guardarYActualizar();
}

function renombrarCategoria(indice) {
  const nuevoNombre = prompt("Nuevo nombre para la categoría:", menu[indice].categoria);
  if (nuevoNombre === null || !nuevoNombre.trim()) return;
  menu[indice].categoria = nuevoNombre.trim();
  guardarYActualizar();
}

function eliminarCategoria(indice) {
  if (menu[indice].platos.length > 0) {
    alert("Primero eliminá o mové los productos de esta categoría.");
    return;
  }
  if (!confirm("¿Querés eliminar esta categoría vacía?")) return;
  menu.splice(indice, 1);
  guardarYActualizar();
}

function limpiarFormularioProducto() {
  productForm.reset();
  document.getElementById("product-id").value = "";
  document.getElementById("product-form-title").textContent = "Agregar producto";
  document.getElementById("cancel-edit-button").hidden = true;
}

// Si ya se inició sesión en esta pestaña, muestra directamente el panel.
mostrarPanelAdmin(sessionStorage.getItem(CLAVE_SESION) === "si");
