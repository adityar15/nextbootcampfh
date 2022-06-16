import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { CartContext } from "../context/CartContext";
import { Cart } from "../../assets/cart";
import { localapi } from "../../assets/api";
import { CartHeader } from "./CartTable";
import { Title, Table, TH, TR, TD } from "@adiranids/react-tailwind";

function InvoiceTableBody({ lineItems }) {
  return (
    lineItems &&
    lineItems.map((lineItem, index) => (
      <InvoiceTableRow key={index} lineItem={lineItem} />
    ))
  );
}

function InvoiceTableRow({ lineItem }) {
  return (
    <TR>
      <TD>{lineItem.products.name}</TD>
      <TD>{lineItem.quantity}</TD>
      <TD>GBP {lineItem.products.price * lineItem.quantity}</TD>
      <TD>
        {lineItem.options ? (
          <InvoiceTableProductAttributes
            attributes={JSON.parse(lineItem.options)} 
            quantity = {lineItem.quantity}
          />
        ) : (
          "NA"
        )}
      </TD>
    </TR>
  );
}

function InvoiceTableProductAttributes({ attributes, quantity }) {
  const attributeJSXArray = [];
  console.log("attributes", attributes)
  for (var k in attributes) {
    attributeJSXArray.push(
      <div className="flex flex-col space-y-2" key={k}>
        <div className="flex space-x-3">
          <span>Name: </span>
          <span>{k}</span>
        </div>
        <div>
          <span>Selected: </span>
          <span>
            {attributes[k] &&
              attributes[k]
                .map((item, index) => item.subattr + "(+" + item.price * quantity + ")")
                .join(", ")}
          </span>
        </div>
      </div>
    );
  }

  return <>{attributeJSXArray}</>;
}

export default function InvoiceTable() {
  const [cart, setCart] = useContext(CartContext);

  const [invoice, setInvoice] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("lastinvoice") && !router.query.payment_intent)
      return;

    if (!localStorage.getItem("lastinvoice")) {
      //create order
      // const paymentIntent = router.query.payment_intent
      const cartInstance = new Cart();

      //calculates subtotal based on cart products
      cartInstance.getDisplayCart().then((data) => {
        const subtotal = data.reduce(
          (subtotal, curr) => subtotal + curr.price + (curr.extra || 0),
          0
        );

        localapi
          .post("/order", {
            cart_items: cartInstance.cart,
            payment_intent: router.query.payment_intent,
            total: subtotal,
          })
          .then((response) => {
            // set invoice number in localstorage
            localStorage.setItem(
              "lastinvoice",
              response.data.order[0]?.invoice
            );
            setInvoice(response.data.order[0]);
            localStorage.removeItem("cart");
            setCart([]);
          });
      });

      return;
    }

    localapi
      .get(`/order?invoice_number=${localStorage.getItem("lastinvoice")}`)
      .then((response) => {
        // set invoice number in localstorage
        setInvoice(response.data.order[0]);

        console.log(response.data.order[0]);
      });
  }, [router.query?.payment_intent]);

  return (
    invoice && (
      <div className="">
        <Title size="h3" className="text-gray-400 font-semibold ml-5 my-7">
          # {invoice.invoice}
        </Title>
        <Table
          header={<CartHeader />}
          body={<InvoiceTableBody lineItems={invoice.line_items} />}
        />
        <Title size="h4" className="text-gray-700 font-semibold ml-5 my-7">
          Paid using card
        </Title>
      </div>
    )
  );
}
