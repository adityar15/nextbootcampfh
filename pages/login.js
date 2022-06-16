import React, { useState } from "react";
import Meta from "../components/Meta";
import { Title, Form, FormGroup, Button } from "@adiranids/react-tailwind";
import "@adiranids/react-tailwind/dist/style.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { localapi } from "../assets/api";

import { useRouter } from "next/router";

const CenterCard = dynamic(() =>
  import(/*webpackChunkName:"centercard"*/ "../components/CenterCard")
);
const ColoredLayer = dynamic(() =>
  import(/*webpackChunkName:"coloredlayer"*/ "../components/ColoredLayer")
);
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");

  const router = useRouter()

  const handleLogin = (e) => {
      e.preventDefault()
      setErrorMessageEmail("")
      setErrorMessagePassword("")
      localapi.post("/login", {email: email, password: password}).then(res =>{
        // console.log("response", res.data)
        router.replace("/")
      })
      .catch(err =>{
        if(err.response.data.error)
        {
          if(err.response.data.error.email)
          setErrorMessageEmail(err.response.data.error.email[0])
  
          if(err.response.data.error.password)
          setErrorMessagePassword(err.response.data.error.password[0])
        }

      })
  }


  return (
    <ColoredLayer color="bg-gray-100">
      <Meta
        title="Garchi Bootcamp | Login"
        description="Enhance your web dev skills along with other technical and personal skills with Garchi's Bootcamp"
        url="https://bootcamp.garchi.co.uk/login"
      />

      <CenterCard>
        <Title size="h1" className="text-center font-semibold">
          Login
        </Title>
        <Form className="w-full" onSubmit={handleLogin}>
          <FormGroup
            value={email}
            change={(val) => setEmail(val)}
            type="email"
            label="Email"
            error={errorMessageEmail}
          />
          <FormGroup
            value={password}
            change={(val) => setPassword(val)}
            type="password"
            label="Password"
            error={errorMessagePassword}
          />

          <Button buttonType="danger">Login</Button>
        </Form>

        <div className="p-3 mt-2 grid grid-rows-2 gap-y-3">
          <Link href="/">
            <a className="underline text-gray-500"> Register </a>
          </Link>
        </div>
      </CenterCard>
    </ColoredLayer>
  );
}
