import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCartIcon } from "@heroicons/react/solid";
import Link from 'next/link'


function CartDot() {
  const [cart, setCart] = useContext(CartContext);

  const [count, setCount] = useState(0)

  useEffect(()=>{
    if(cart)  
    setCount(cart.length)

  }, [cart])

  return count > 0 && <div className="absolute h-6 w-6 text-sm -top-2 -right-2
  text-gray-50 bg-blue-500 rounded-full grid place-items-center"> {count} </div>;
}

export default function NavCart({ className }) {
  return (
    <Link href="/cart">
    <div className={`relative ${className} cursor-pointer`}>
      <ShoppingCartIcon className="h-14 w-14 md:h-9 md:w-9 fill-gray-50" />
      <CartDot />
    </div>
    </Link>
  );
}
