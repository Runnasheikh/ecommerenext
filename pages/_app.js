import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import CartContext, { CartProvider } from "@/context/cartContext";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import LoadingBar from 'react-top-loading-bar'

export default function App({ Component, pageProps }) {
  const [progress, setProgress] = useState(0)
  
  const router = useRouter();
  const {key} = useContext(CartContext)
  useEffect(() => {
    router.events.on('routeChangeComplete',()=>{
      setProgress(100)
    })
  }, [router.query])
  
  return <>
   <LoadingBar
        color='#f11946'
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />
  <CartProvider>
 {key && <Navbar/>}
   <Component {...pageProps} />;
   <Footer/>
  </CartProvider>
  </>
}
