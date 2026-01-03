"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBox() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Si está vacío, volvemos al inicio sin filtros
        if (!query.trim()) {
            router.push("/");
        } else {
            router.push(`/?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            className={`relative w-full transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}
        >
            {/* INPUT ESTILIZADO */}
            <input
                type="text"
                placeholder="Buscar productos o categorías..." 
                className={`
          w-full py-3 pl-5 pr-12 
          bg-gray-100 border-2 border-transparent 
          text-slate-900 placeholder-slate-400 font-medium
          rounded-xl outline-none transition-all duration-300
          focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-500/10
        `}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {/* BOTÓN LUPA*/}
            <button
                type="submit"
                className={`
          absolute right-2 top-1/2 -translate-y-1/2 
          p-2 rounded-lg transition-colors duration-200
          ${isFocused || query ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}
        `}
                aria-label="Buscar"
            >
                <Search className="w-5 h-5 cursor-pointer" />
            </button>
        </form>
    );
}