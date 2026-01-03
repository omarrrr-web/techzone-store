"use client";
import { useCart } from "@/app/store/useCart";
import { toast } from "sonner";
import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
        category: string;
        description: string;
        stock: number;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const addToCart = useCart((state) => state.addToCart);
    const isOutOfStock = Number(product.stock) <= 0;

    return (
        <div className={`group bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full relative overflow-hidden ${isOutOfStock ? 'opacity-60' : ''}`}>

            {/* Badge de Stock */}
            {isOutOfStock && (
                <div className="absolute top-3 left-3 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full border border-red-100 z-10">
                    AGOTADO
                </div>
            )}

            {/* Imagen*/}
            <div className="h-64 p-6 flex items-center justify-center bg-white relative">
                <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                </Link>
            </div>

            {/* Contenido */}
            <div className="p-5 flex flex-col flex-grow bg-white">
                <div className="mb-auto">
                    <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                        {product.category}
                    </p>
                    <Link href={`/product/${product.id}`} className="cursor-pointer">
                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Precio y Botón */}
                <div className="flex items-end justify-between pt-4 border-t border-gray-50 mt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">Precio</span>
                        <span className="text-xl font-extrabold text-slate-900">
                            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(product.price * 3.7)}
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            if (!isOutOfStock) {
                                addToCart(product);
                                toast.success("Producto agregado", {
                                    description: `${product.name} ya está en tu carrito`,
                                    icon: <ShoppingCart className="w-4 h-4" />
                                });
                            }
                        }}
                        disabled={isOutOfStock}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm ${isOutOfStock
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-blue-600 hover:scale-110 cursor-pointer shadow-slate-900/20"
                            }`}
                        title="Agregar al carrito"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}