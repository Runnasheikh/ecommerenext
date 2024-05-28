"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Stickers = () => {
    const [stickers, setStickers] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getProduct`);
                const data = await res.json();
    
                if (data && typeof data.tshirts === 'object') {
                    // Convert tshirts object to an array
                    const tshirtArray = Object.values(data.tshirts);
                    const filteredStickers = tshirtArray.filter(
                        (product) => product.category === "sticker"
                    );
                    setStickers(filteredStickers);
                } else {
                    console.error('Product data is not available or is not an object:', data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                // Handle errors here, e.g., display an error message to the user
            }
        };
    
        fetchProducts();
    }, []);

    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-35 py-24 mx-auto w-2/3">
                    <div className="flex flex-wrap -m-4">
                        <>
                            {/* Products will be rendered here only if there are products */}
                            {stickers.length > 0 ? (
                                stickers.map((product) => (
                                    <div
                                        key={product._id}
                                        className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer shadow-lg"
                                    >
                                        <Link passHref={true} href={`/product/${product.slug}`} className="block relative rounded overflow-hidden">
                                            <img key={product.slug}
                                                alt="ecommerce"
                                                className="m-auto h-[30vh] block"
                                                src={product.img || "https://rukminim2.flixcart.com/image/612/612/kmccosw0/t-shirt/x/2/s/xl-12117246-roadster-original-imagf9fnt37pzwrx.jpeg?q=70"}
                                            />
                                            <div className="mt-4 text-center">
                                                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1" key={product.title}>
                                                    {product.title}
                                                </h3>
                                                <h2 className="text-gray-900 title-font text-lg font-medium">{product.title}</h2>
                                                <p className="text-black mt-1" key={product.price}>{product.price}</p>
                                                <div className="mt-1">
                                                  {product.size.includes('S') && <span className='border border-gray-300 px-1 mx-1'>S</span> }
                                                  {product.size.includes('M') && <span className='border border-gray-300 px-1 mx-1'>M</span> }
                                                  {product.size.includes('L') && <span className='border border-gray-300 px-1 mx-1'>L</span> }
                                                  {product.size.includes('Xl') && <span className='border border-gray-300 px-1 mx-1'>XL</span> }
                                                  {product.size.includes('XXL') && <span className='border border-gray-300 px-1 mx-1'>XXL</span> }
                                                </div>
                                                <div className="mt-1">
                                                  {product.color.includes('red') && <button className='border-2 border-gray-300 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none'></button> }
                                                  {product.color.includes('blue') && <button className='border-2 border-gray-300 ml-1 bg-blue-700 rounded-full w-6 h-6 focus:outline-none'></button> }
                                                  {product.color.includes('green') && <button className='border-2 border-gray-300 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none'></button> }
                                                  {product.color.includes('yellow') && <button className='border-2 border-gray-300 ml-1 bg-yellow-700 rounded-full w-6 h-6 focus:outline-none'></button> }
                                                  {product.color.includes('white') && <button className='border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none'></button> }
                                                </div>

                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p>No products available</p>
                            )}
                        </>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Stickers;
