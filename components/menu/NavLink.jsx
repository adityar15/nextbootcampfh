import Link from "next/link"

export default function NavLink({children, href})
{
    return(
        <li className="text-gray-50 font-semibold text-2xl">
            <Link href={href}>
                {children}
            </Link>
        </li>
    )
}