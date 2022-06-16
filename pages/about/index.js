import React from 'react'

export default function About({content}) {
  return (
    <div>
        {content}
    </div>
  )
}

export async function getStaticProps() {
//query

const content = "Hello WOrld"

return {
    props: {
        content: content
    },
    revalidate:30
}
}