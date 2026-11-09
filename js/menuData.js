// Este archivo guarda los datos compartidos por la página del cliente y el panel.
// Así, las dos pantallas trabajan sobre el mismo menú.

export const CLAVE_MENU = "menu_olivia";

// Menú inicial: se usa la primera vez o cuando todavía no hay cambios guardados.
export const menuInicial = [
  {
    categoria: "Aprovechá nuestras PROMOS exclusivas para vos!",
    subtitulo: "No incluyen Soufflé ni Fatay",
    platos: [
      { id: 101, nombre: "18 EMPANADAS A ELECCION", descripcion: "", precio: 51100, imagen: "https://via.placeholder.com/50" }
    ]
  },
  {
    categoria: "Empanadas Clásicas - 120 grs. (HOJALDRE)",
    subtitulo: "",
    platos: [
      { id: 1, nombre: "CARNE SUAVE", descripcion: "Carne picada, cebolla, huevo, morrón rojo y verdeo.", precio: 3300, imagen: "https://via.placeholder.com/50" },
      { id: 2, nombre: "JAMÓN Y QUESO", descripcion: "Jamón cocido y muzzarella", precio: 3300, imagen: "https://via.placeholder.com/50" },
      { id: 3, nombre: "HUMITA", descripcion: "Choclo amarillo, cebolla, salsa blanca y queso reggianito.", precio: 3300, imagen: "https://via.placeholder.com/50" },
      { id: 4, nombre: "POLLO", descripcion: "Pollo, cebolla, huevo, verdeo, morrón rojo", precio: 3300, imagen: "https://via.placeholder.com/50" }
    ]
  }
];

// Lee el menú guardado; si no existe, devuelve una copia del menú inicial.
export function cargarMenu() {
  try {
    const menuGuardado = localStorage.getItem(CLAVE_MENU);
    return menuGuardado ? JSON.parse(menuGuardado) : structuredClone(menuInicial);
  } catch (error) {
    console.error("No se pudo leer el menú guardado:", error);
    return structuredClone(menuInicial);
  }
}

// Guarda el arreglo completo convertido a texto para que localStorage pueda almacenarlo.
export function guardarMenu(menu) {
  localStorage.setItem(CLAVE_MENU, JSON.stringify(menu));
}

// Convierte texto a entidades HTML para evitar que nombres o descripciones
// ingresados en el panel se interpreten como etiquetas al dibujar la página.
export function escaparHTML(texto = "") {
  return String(texto).replace(/[&<>"']/g, caracter => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[caracter]);
}
