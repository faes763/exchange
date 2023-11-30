import { futura } from "@/styles/fonts";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const navLinks = {
    ru: [
        {
            name: "Обмен",
            href: "ru/"
        },
        // {
        //     name: "Отзывы",
        //     href: "ru/#reviews"
        // },
        {
            name: "Кто мы?",
            href: "ru/#about"
        },
    ],
    en: [
        {
            "name": "Exchange",
            "href": "en/"
        },
        // {
        //     "name": "Reviews",
        //     "href": "en/#reviews"
        // },
        {
            "name": "Who We Are?",
            "href": "en/#about"
        }
    ]
}

export function Footer() {
    const locale = useLocale() as "en" | "ru";
    return(
        <footer className="mt-16 max-md:mt-8 bg-main-gray py-10">
            <div className=" flex gap-5 max-md:flex-col items-center justify-between container">
                <div className=" space-y-5" >
                    <div className=" items-center flex gap-3">
                        <Image width={40} height={80} alt="Logo" src={'/images/logo.svg'}/>
                        <p className={`${futura.className} text-h2 font-bold  `}><span className=" text-main-blue">STUART</span><br/> EXCHANGE</p>
                    </div>
                    <p>Stuart Exchange 2023 (c)</p>
                </div>
                <div>
                    <nav>
                        <ul className="max-md:flex-col flex items-center gap-5">
                        {navLinks[locale].map((link,index)=>(
                            <li key={link.name+index}><Link  href={link.href}>{link.name}</Link></li>
                        ))}
                            <li className="flex border border-main-blue gap-3 py-2 px-5 rounded-full">
                                <Image width={25} height={25} alt="tg" src={'/images/telegram.svg'}/>
                                <Link href={'/'}>Telegram Support</Link>
                            </li>
                        </ul>
                    </nav>
                </div>  
            </div>
        </footer>
    )
}