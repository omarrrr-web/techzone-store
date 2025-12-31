"use client";
import Link from "next/link";
import { useCart } from "@/app/store/useCart";
import SearchBox from "./SearchBox";

export default function Header() {
    const cart = useCart((state) => state.cart);

    return (
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* El logo te lleva al inicio */}
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:opacity-80 transition">
                    TechZone ⚡
                </Link>
                <SearchBox />
                {/* El botón ahora es un Link a /cart */}
                <Link
                    href="/cart"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex gap-2 font-bold items-center"
                >
                    🛒 Carrito ({cart.length})
                </Link>
            </div>
        </header>
    );
}