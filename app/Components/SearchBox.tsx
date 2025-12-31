"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Inicializamos con lo que ya esté en la URL (para no perder el texto al recargar)
    const [query, setQuery] = useState(searchParams.get("q") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página parpadee
        // Cambiamos la URL a /?q=termino
        router.push(`/?q=${encodeURIComponent(query)}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2">
            <input
                type="text"
                placeholder="Buscar hardware..."
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                className="cursor-pointer bg-slate-600 text-white px-4 py- rounded-lg hover:bg-slate-800 transition"
            >
                Buscar 🔍
            </button>
        </form>
    );
}