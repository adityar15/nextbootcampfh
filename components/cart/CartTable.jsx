import { useEffect, useContext, useState } from "react";
import { Table, TH, TR, TD, Button } from "@adiranids/react-tailwind";
import { CartContext } from "../context/CartContext";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Cart } from "../../assets/cart";

const Payment = dynamic(() =>
  import(/*webpackChunkName:"payment"*/ "./Payment")
);

export function CartHeader() {
  return (
    <TR>
      <TH>Item</TH>
      <TH>Quantity</TH>
      <TH>Unit Price</TH>
      <TH>Options</TH>
    </TR>
  );
}

function CartBody({ cartDisplayProducts }) {
  return (
    cartDisplayProducts &&
    cartDisplayProducts.map((cartItem, index) => (
      <CartRow key={index} item={cartItem} />
    ))
  );
}

function CartRow({ item }) {
  return (
    <TR>
      <TD>{item.product_name}</TD>
      <TD>{item.quantity}</TD>
      <TD>
        GBP {item.price}{" "}
        {item.extra > 0 && (
          <>
            <span>
              <br /> +{item.extra}
            </span>
          </>
        )}
      </TD>
      <TD>
        <CartItemAttributes attributes={item.attributes} />
      </TD>
    </TR>
  );
}

function CartItemAttributes({ attributes }) {
  return attributes.length > 0 ? (
    attributes.map(
      (attr, index) =>
        attr && (
          <div className="flex flex-col space-y-2" key={`attr ${index}`}>
            <div className="flex space-x-3">
              <span>Name: </span>
              <span>{attr.attribute_name}</span>
            </div>
            <div>
              <span>Selected: </span>
              <span>
                {attr &&
                  attr.selected_options
                    .map((item, index) => item.subattr)
                    .join(", ")}
              </span>
            </div>
          </div>
        )
    )
  ) : (
    <span>NA</span>
  );
}

function CartFooter({ subTotal }) {
  return (
    <TR>
      <TD></TD> <TD>SubTotal</TD> <TD>GBP {subTotal}</TD> <TD></TD>
    </TR>
  );
}

export default function CartTable({ loggedIn, showPayment = true }) {
  const [cart, setCart] = useContext(CartContext);
  const [cartDisplayProducts, setCartDisplayProducts] = useState([]);
  const [cartSubTotal, setCartSubTotal] = useState(0);

  useEffect(() => {
    if (!cart || cart.length == 0) return;

    // let uniqueProductIDs = cart.map((item) => item.product_id);
    // uniqueProductIDs = [...new Set(uniqueProductIDs)];

    // localapi
    //   .post("/getcartproducts", { products: uniqueProductIDs })
    //   .then((res) => {
    //     const displayCart = cart.map((cartItem) => {
    //       const requiredProduct = res.data.products.filter(
    //         (item) => item.id == cartItem.product_id
    //       );

    //       let attributePrice = 0;

    //       if (cartItem.attributes.length > 0) {
    //         attributePrice = cartItem.attributes.reduce((prev, current) => {
    //           if (current)
    //             return (
    //               prev +
    //               current.selected_options.reduce(
    //                 (sum, curr) => sum + curr.price,
    //                 0
    //               )
    //             );
    //         }, 0);
    //       }

    //       return {
    //         ...cartItem,
    //         price: requiredProduct[0].price * cartItem.quantity,
    //         extra: attributePrice,
    //       };
    //     });

    //   setCartDisplayProducts(displayCart);
    // });

    const cartObj = new Cart();
    cartObj.getDisplayCart().then((cartData) => {
      setCartDisplayProducts(cartData);

      if (!cartData || cartData.length == 0) return;

      const subTotal = cartData.reduce(
        (subtotal, curr) => subtotal + curr.price + (curr.extra || 0),
        0
      );

      setCartSubTotal(subTotal);
    });
  }, [cart]);

  // useEffect(() => {

  // }, [cartDisplayProducts]);

  return (
    <>
      <Table
        header={<CartHeader />}
        body={<CartBody cartDisplayProducts={cartDisplayProducts} />}
        footer={<CartFooter subTotal={cartSubTotal} />}
      />

      {showPayment && (
        <div className="mx-auto w-11/12">
          {loggedIn ? (
            <Payment total={cartSubTotal} />
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}
