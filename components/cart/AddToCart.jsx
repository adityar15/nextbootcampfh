import { Button, Title } from "@adiranids/react-tailwind";
import "@adiranids/react-tailwind/dist/style.css";
import { Dialog, Transition } from "@headlessui/react";

import { useContext, useEffect, Fragment, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Cart } from "../../assets/cart";

export default function AddToCart({ productID, name, attributes }) {
  const [cart, setCart] = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  let [cInstance, setcInstance] = useState(null);

  //modal from headlessui
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function setOption(e) {
    //convert to array so that id of main attr can be used
    const optionArray = e.target.value.split("|");

    //get Main attribute details
    const mainAttribute = attributes.filter(
      (attr) => attr.id == optionArray[0]
    );

    //selected suboption
    const subOption = JSON.parse(optionArray[1]);

    //add to selected options
    if (selectedOptions.length == 0) {
      setSelectedOptions([
        {
          attribute_name: mainAttribute[0].name,
          selected_options: [
            {
              subattr: subOption.name,
              subattr_id: subOption.id,
              price: subOption.price,
            },
          ],
        },
      ]);

      return;
    }

    //for new main attribute

    let newMainAttribute = selectedOptions.filter(
      (selected) => selected.attribute_name == mainAttribute[0].name
    );

    if (newMainAttribute.length == 0) {
      newMainAttribute = {
        attribute_name: mainAttribute[0].name,
        selected_options: [
          {
            subattr: subOption.name,
            subattr_id: subOption.id,
            price: subOption.price,
          },
        ],
      };

      setSelectedOptions([...selectedOptions, newMainAttribute]);
      return;
    }

    //for same main attribute

    //map selected options

    const mapped = selectedOptions.map((selected) => {
      
      //can select max 1 choice
      if (
        selected.attribute_name == mainAttribute[0].name &&
        mainAttribute[0].min == 1
      )
        return {
          attribute_name: selected.attribute_name || mainAttribute[0].name,
          selected_options: [
            {
              subattr: subOption.name,
              subattr_id: subOption.id,
              price: subOption.price,
            },
          ],
        };
      //can select more than 1 but got over the limit
      else if (
        selected.attribute_name == mainAttribute[0].name &&
        selected.selected_options.length >= mainAttribute[0].min &&
        e.target.checked
      ) {
        alert(
          `You can select max ${mainAttribute[0].min} ${mainAttribute[0].name}`
        );
        e.target.checked = false;
        return {};
      }

      //can select more than 1 and in limit
      else if (
        selected.attribute_name == mainAttribute[0].name &&
        selected.selected_options.length <= mainAttribute[0].min
      ) {
        if (e.target.checked) {
          return {
            attribute_name: mainAttribute[0].name,
            selected_options: [
              ...selected.selected_options,
              {
                subattr: subOption.name,
                subattr_id: subOption.id,
                price: subOption.price,
              },
            ],
          };
        }

        console.log("unchecked", subOption)
        return {
          attribute_name: mainAttribute[0].name,
          selected_options: selected.selected_options.filter(
            (subOps) => subOps.subattr_id !== subOption.id
          ),
        };
      }

     
      return selected
    });
    

    //set to state
    setSelectedOptions(mapped);
  }

  useEffect(()=>{
    console.log("selected", selectedOptions)
  }, [selectedOptions])

 

  useEffect(() => {
    setcInstance(new Cart());
    console.log("cart", cart);
  }, [cart]);

  function openModalOrAdd() {
    if (attributes.length == 0) {
      // add straight to the cart if attributes are there
      addToCart();
      return;
    }

    openModal();

    //show attributes in modal
  }

  //adds with attributes
  function addToCartWithAttributes() {
    addToCart(selectedOptions);
    closeModal()
  }

  //add to cart
  function addToCart(attributesProvided = []) {
    
    setCart(
      cInstance.add({
        id: productID,
        name: name,
        quantity: 1,
        attributes: attributesProvided,
      })
    );
  }

  return (
    <div>
      <Button buttonType="dark" onClick={openModalOrAdd}>
        Add To Cart
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Select Options
                </Dialog.Title>
                <div className="mt-2">
                  {attributes.length > 0 &&
                    attributes.map((attribute) => (
                      <div key={`Main_Attr_${attribute.id}`} className="space-y-2 block">
                        <Title size="h3">
                          Select {attribute.name} (max {attribute.min})
                        </Title>
                        <div className="flex flex-col space-y-3">
                          {attribute.options.map((option) => (
                            <div key={`Sub_Attr_${option.id}`}>
                              <input
                                type={attribute.min == 1 ? "radio" : "checkbox"}
                                onChange={setOption}
                                name={attribute.name}
                                value={`${attribute.id}|${JSON.stringify(
                                  option
                                )}`}
                              />
                              <span>{option.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={addToCartWithAttributes}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
