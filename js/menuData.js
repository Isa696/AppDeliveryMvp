import { supabase } from "../backend/supabaseClient.js";

export const CLAVE_MENU = "menu_olivia";

// Obtiene productos y categorías en paralelo y adapta los datos al formato del renderizador.
export async function getMenuData() {
  const [menuResult, categoriesResult] = await Promise.all([
    supabase.from("Menu").select("*").order("id", { ascending: true }),
    supabase.from("categories").select("idCatTable, categoria").order("idCatTable", { ascending: true })
  ]);

  const errors = [
    menuResult.error && `Menu: ${menuResult.error.message}`,
    categoriesResult.error && `categories: ${categoriesResult.error.message}`
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(`No se pudieron cargar los datos de Supabase. ${errors.join(" | ")}`);
  }

  const categorias = categoriesResult.data.map(categoria => ({
    idCatTable: categoria.idCatTable,
    categoria: categoria.categoria,
    subtitulo: "",
    platos: []
  }));
  const categoriasPorId = new Map(
    categorias.map(categoria => [String(categoria.idCatTable), categoria])
  );

  for (const producto of menuResult.data) {
    const categoria = categoriasPorId.get(String(producto.idCat));
    if (!categoria) {
      throw new Error(`El producto "${producto.nombre}" referencia una categoría inexistente.`);
    }

    categoria.platos.push({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: producto.precio,
      imagen: producto.imagen ?? "https://via.placeholder.com/50"
    });
  }

  return categorias;
}

// Conserva el almacenamiento local usado por el panel de administración.
export function cargarMenu() {
  try {
    const menuGuardado = localStorage.getItem(CLAVE_MENU);
    return menuGuardado ? JSON.parse(menuGuardado) : [];
  } catch (error) {
    console.error("No se pudo leer el menú guardado:", error);
    return [];
  }
}

export function guardarMenu(menu) {
  localStorage.setItem(CLAVE_MENU, JSON.stringify(menu));
}

// Escapa los valores dinámicos antes de insertarlos en el HTML.
export function escaparHTML(texto = "") {
  return String(texto).replace(/[&<>"']/g, caracter => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[caracter]);
}
