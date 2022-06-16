import React, {useState, useEffect} from 'react'
import {Elements, PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { localapi } from '../../assets/api';
import {Button} from "@adiranids/react-tailwind"


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {

  const stripe = useStripe()
  const elements = useElements()


  async function handlePayment(e)
  {
    e.preventDefault()
    if (!stripe || !elements) {
      alert("Something went wrong in loading the payment. Please refresh the page.")
      return;
    }

    localapi.get("/customer").then(async(res)=>{

      localStorage.removeItem("lastinvoice")


      
      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/invoice",
          payment_method_data: {
            billing_details:{
              email: res.data.user.email,
            }
          }
        },
     
      });
  
      if (result.error) {
        alert("Something went wrong, try again")
        console.log(result.error.message);
      } else {
        alert("All good")
      }
    })


   
  }

  return (
    <form onSubmit={handlePayment}>
      <PaymentElement />
      <Button>Pay</Button>
    </form>
  );
};


export default function Payment({total}) {

  const [options, setOptions] = useState({})


  useEffect(()=>{
      if(total <= 0)
      return

      localapi.post('/getintent', {total: total}).then(res => {
        console.log("res", res.data)
        setOptions({
          clientSecret: res.data.client_secret,
        })
      })

  }, [total])

  return (
  Object.keys(options).length > 0 && 
    (<Elements stripe={stripePromise} options={options}>
    <CheckoutForm />
  </Elements>)
  )
}
