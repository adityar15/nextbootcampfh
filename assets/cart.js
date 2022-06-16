import { localapi } from "./api";

export class Cart {
  cart = [];

  constructor() {
    const cartString = localStorage.getItem("cart");
    this.cart = JSON.parse(cartString) || [];
  }

  // load cart to local storage
  loadToStorage() {
    const cartString = JSON.stringify(this.cart);
    localStorage.setItem("cart", cartString);
  }

  //add product to the cart

  add(payload) {
    //check if the product is already added
    const inCart = this.cart.filter((item) => item.product_id == payload.id);

    // add product if not added
    if (inCart.length == 0)
      this.cart = [
        ...this.cart,
        {
          product_id: payload.id,
          product_name: payload.name,
          quantity: 1,
          attributes: payload.attributes,
        },
      ];
    // if the product is added with same attributes then just increase the quantity
    else {
      let flag = false;

      inCart.forEach((inCartItem) => {
        if (
          inCartItem.attributes.length == 0 ||
          JSON.stringify(inCartItem.attributes) ==
            JSON.stringify(payload.attributes)
        ) {
          flag = true;

          this.cart = this.cart.map((item) => {
            if (item.product_id != payload.id) return item;
            else
              return {
                product_id: payload.id,
                product_name: payload.name,
                quantity: ++item.quantity,
                attributes: payload.attributes,
              };
          });
        }
      });

      // if the same product is added with different attributes then just add it as a new product
      if (!flag) {
        this.cart = [
          ...this.cart,
          {
            product_id: payload.id,
            product_name: payload.name,
            quantity: 1,
            attributes: payload.attributes,
          },
        ];
      }
    }

    this.loadToStorage();
    return this.cart;
  }

  async getDisplayCart() {
    let uniqueProductIDs = this.cart.map((item) => item.product_id);
    uniqueProductIDs = [...new Set(uniqueProductIDs)];

    const req = await localapi
      .post("/getcartproducts", { products: uniqueProductIDs })


    const {products} = await req.data 
    
    
    
    const displayCart = this.cart.map((cartItem) => {
      const requiredProduct = products.filter(
        (item) => item.id == cartItem.product_id
      );

      let attributePrice = 0;

      if (cartItem.attributes.length > 0) {
        attributePrice = cartItem.attributes.reduce((prev, current) => {
          if (current)
            return (
              prev +
              current.selected_options.reduce(
                (sum, curr) => sum + curr.price,
                0
              )
            );
        }, 0);
      }

      return {
        ...cartItem,
        price: requiredProduct[0].price * cartItem.quantity,
        extra: attributePrice * cartItem.quantity,
      };
    });  
    

    return displayCart
  }
}
