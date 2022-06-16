import "../styles/globals.css";
import MainLayout from "../layouts/MainLayout";
import { CartContext } from "../components/context/CartContext";
import { useEffect, useState } from "react";
import { Cart } from "../assets/cart";

const layoutList = {
  MainLayout: MainLayout,
};

function MyApp({ Component, pageProps }) {
  const Layout = layoutList[Component.layout] || MainLayout;

  const [cart, setCart] = useState([]);

  useEffect(() => {
    let cartInstance = new Cart();
    setCart(cartInstance.cart);
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartContext.Provider>
  );
}




export default MyApp;
