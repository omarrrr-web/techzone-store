"use client";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
    "Todos",
    "Tarjetas de Video",
    "Procesadores",
    "Memorias RAM",
    "Almacenamiento",
    "Monitores"
];

export default function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category") || "Todos";

    const handleFilter = (category: string) => {
        if (category === "Todos") {
            router.push("/"); // Limpia los filtros
        } else {
            // Mantiene la búsqueda de texto si existía, pero cambia la categoría
            // O para hacerlo simple: reseteamos la búsqueda y filtramos solo por categoría
            router.push(`/?category=${encodeURIComponent(category)}`);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 justify-center my-6">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleFilter(cat)}
                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}