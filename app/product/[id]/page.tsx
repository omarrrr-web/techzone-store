import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import Header from "@/app/Components/Header";

// Esta función obtiene un solo producto por ID
async function getProduct(id: string) {
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching product:", error); // Esto nos ayudará a ver errores en la consola
        return null;
    }

    return product;
}

//Definimos params como una Promesa
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {

    //Esperamos (await) a que params esté listo
    const { id } = await params;

    console.log("Buscando producto con ID:", id); // Para depurar

    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado 😢</h1>
                <p className="text-gray-500 mb-6">El ID buscado es: {id}</p>
                <Link href="/" className="text-blue-600 hover:underline">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-10">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <Link href="/" className="text-slate-500 hover:text-blue-600 mb-6 inline-block font-medium">
                    ← Volver a la tienda
                </Link>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

                    <div className="h-96 md:h-[500px] bg-white flex items-center justify-center p-8 border-r border-gray-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="object-contain w-full h-full max-h-[400px]"
                        />
                    </div>

                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <span className="text-sm font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase w-fit mb-4">
                            {product.category}
                        </span>

                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                            {product.description}
                            <br /><br />
                            Garantía de fábrica incluida. Envío gratis a todo el Perú.
                        </p>

                        <div className="flex items-center gap-6 mb-8 border-t border-b py-6 border-gray-100">
                            <div className="text-3xl font-bold text-gray-900">
                                {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(product.price * 3.7)}
                            </div>
                            <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-lg">
                                Stock Disponible
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                                Comprar Ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}