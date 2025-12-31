import { supabase } from "@/app/lib/supabase";
import ProductCard from "./Components/ProductCard";
import Header from "./Components/Header";
import CategoryFilter from "./Components/CategoryFilter";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. Modificamos la función para aceptar "query" (búsqueda)
async function getProducts(query: string = "", category: string = "") {
  let supabaseQuery = supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  // 2. Si hay texto de búsqueda, filtramos usando "ilike" (case insensitive like)
  if (query) {
    // Busca productos donde el nombre contenga el texto (ej: %Nvidia%)
    supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
  }
  if (category && category !== "Todos") {
    supabaseQuery = supabaseQuery.eq('category', category);
  }

  const { data: products } = await supabaseQuery;
  return products || [];
}

// 3. Recibimos searchParams (Promesa en Next.js 15)
export default async function Home({ searchParams }: { searchParams: Promise<{ q: string, category: string }> }) {

  // Esperamos los parámetros
  const { q, category } = await searchParams;

  // Pasamos la búsqueda a la base de datos
  const products = await getProducts(q, category);

  return (
    <main className="min-h-screen bg-gray-100 pb-10">
      <Header />

      {/* Banner Hero (Solo lo mostramos si NO estamos buscando) */}
      {!q && (
        <div className="bg-blue-600 text-white py-12 mb-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-2">Mejora tu setup</h2>
            <p className="text-blue-100">Los mejores componentes al mejor precio.</p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4">

        {/* 5. Agregamos la barra de Categorías AQUÍ */}
        <CategoryFilter />

        {/* Título de resultados */}
        {(q || category) && (
          <div className="py-4">
            <h2 className="text-xl font-bold text-gray-800">
              {q && <span>Resultados para "{q}"</span>}
              {q && category && <span> en </span>}
              {category && <span className="text-blue-600">{category}</span>}
            </h2>
          </div>
        )}

        {/* Grid de Productos */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No encontramos productos en esta categoría 😢</p>
            <a href="/" className="text-blue-600 hover:underline mt-2 inline-block">Ver todo</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </main>
  );
}