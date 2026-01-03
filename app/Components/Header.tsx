"use client";
import Link from "next/link";
import { useCart } from "@/app/store/useCart";
import SearchBox from "./SearchBox";
import { Suspense } from "react";
import { ShoppingBag, Menu } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Header() {
    const cart = useCart((state) => state.cart);

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-8">

                {/* 1. Logo (Más minimalista) */}
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                        T
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">TechZone</span>
                </Link>

                {/* 2. Buscador (Centro y amplio) */}
                {/* Buscador (Centro y amplio) */}
                <div className="flex-1 max-w-2xl hidden md:block px-8"> {/* Agregué px-8 para separarlo del logo */}
                    <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-full animate-pulse" />}>
                        <SearchBox />
                    </Suspense>
                </div>

                {/* 3. Acciones */}
                <UserMenu />
                <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                <div className="flex items-center gap-6">
                    <Link
                        href="/cart"
                        className="relative group cursor-pointer"
                    >
                        <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ShoppingBag className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                        </div>
                        {cart.length > 0 && (
                            <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {/* Menú móvil (decorativo por ahora) */}
                    <button className="md:hidden p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                        <Menu className="w-6 h-6 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Buscador Móvil (Aparece abajo en pantallas pequeñas) */}
            <div className="md:hidden px-4 pb-4">
                <Suspense><SearchBox /></Suspense>
            </div>
        </header>
    );
}