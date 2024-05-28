import Image from "next/image";
import { Inter } from "next/font/google";
import CartContext from "@/context/cartContext";
import { useContext } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart("item1", 1, 100, "T-shirt", "M", "Red");
  };
  return (
    <section className="body-font">
    <div className="container px-5 py-24 mx-auto">
      <div className="flex flex-wrap -m-4">
        <div className="xl:w-1/3 md:w-1/2 p-4">
          <div className="border border-gray-200 p-6 rounded-lg">
            <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-pink-100 text-pink-500 mb-4">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
            <p className="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
            <button onClick={handleAddToCart} className="mt-4 text-white bg-pink-500 border-0 py-2 px-8 focus:outline-none hover:bg-pink-600 rounded text-lg">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
