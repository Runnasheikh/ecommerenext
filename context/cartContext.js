"use client"
import { useRouter } from 'next/router';
import { createContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cart: [],
  setCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  subtotal: 0,
  setSubtotal: () => {},
  buyNow: () => {},
  user: () => {},
  key:Math.random(),
  logout:()=>{}
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [user, setUser] = useState({value:null})
  const [key, setKey] = useState(0)
  
  const router = useRouter(); 
  useEffect(() => {
    
    try {
      if (localStorage.getItem(JSON.parse(localStorage.getItem("myUser")).email)) {
        setCart(
          JSON.parse(localStorage.getItem(JSON.parse(localStorage.getItem("myUser")).email))
        );
        // saveCart(JSON.parse(localStorage.getItem('cart')));
      }
    } catch (err) {
      console.log(err);
      // localStorage.clear();
    }
    const myUser = JSON.parse(localStorage.getItem('myUser'))
    if (myUser) {
      setUser({value:myUser.token,email: myUser.email})
    }
    setKey(Math.random())
  }, [router]);
const logout = ()=>{
  localStorage.removeItem('myUser')
  setUser({value:null})
  setKey(Math.random())
  router.push('/')
}
  const saveCart = (myCart) => {
    localStorage.setItem(JSON.parse(localStorage.getItem("myUser")).email, JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setSubtotal(subt);
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty += qty;
    } else {
      newCart[itemCode] = { qty:1, price, name, size, variant };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const removeFromCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = JSON.parse(JSON.stringify(cart));
    if (itemCode in cart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCart(newCart);
  };
  const buyNow = (qty, price, name, size, variant)=>{
    
    let newCart = { itemCode:{qty:1, price, name, size, variant} };
    
    setCart(newCart);
    saveCart(newCart);
    router.push('/checkout')
  }
 
  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        subtotal,
        setSubtotal,
        buyNow,
        key,
        user,
        logout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
