import Image from 'next/image'

export default function Logo() {
  return (
    <div className="relative h-32 w-32">
        <Image src={process.env.NEXT_PUBLIC_LOGO}
         layout="fill"
         objectFit='cover'
         objectPosition="center"
         alt="Logo" 
         />
    </div>
  )
}
