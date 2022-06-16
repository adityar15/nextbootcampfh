import React from 'react'
import {useRouter} from "next/router"
export default function DynamicName() {

    const router = useRouter()
    const {name} = router.query

  return (
    <div>{name}</div>
  )
}
