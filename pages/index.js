import Head from 'next/head'
import Image from 'next/image'
import Meta from "../components/Meta"



export default function Home({title}) {


  return (
    <div>
      <Meta title="Bootcamp" />
    

      <main>
      
      </main>

   
    </div>
  )
}


export async function getServerSideProps()
{
  // query
  const title = "Next.js SSR rendered"

  return {
    props:{
      title: title
    }
  }
}