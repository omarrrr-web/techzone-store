"use client"; // <--- Esto permite usar onClick
import { useCart } from "@/app/store/useCart";
import { toast } from "sonner";
import Link from "next/link";

// Definimos qué datos recibe la tarjeta
interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        image: string;
        category: string;
        description: string;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    // Traemos la función del carrito
    const addToCart = useCart((state) => state.addToCart);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full">
            <div className="h-64 overflow-hidden relative bg-white flex items-center justify-center p-4">
                <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-300"
                    />
                </Link>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase">
                        {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mt-2 leading-tight">
                        {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {product.description}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4">
                    <span className="text-xl font-bold text-gray-900">
                        {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(product.price * 3.7)}
                    </span>

                    <button
                        onClick={() => {
                            addToCart(product);
                            toast.success(`Agregaste ${product.name}`, {
                                description: "Se añadió al carrito correctamente 🛒"
                            });
                        }}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition active:scale-95 cursor-pointer"
                    >
                        Agregar +
                    </button>
                </div>
            </div>
        </div>
    );
}