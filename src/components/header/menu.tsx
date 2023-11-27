'use client'

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"

const navLinksLanguage = {
    en: [
        {
            name: "Home",
            href: "/"
        },
        {
            name: "Reviews",
            href: "/#reviews"
        },
        {
            name: "About Us?",
            href: "/#about"
        },
        {
            name: "Profile",
            href: "/profile"
        },
    ],
    ru: [
        {
            name: "Главная",
            href: "/"
        },
        {
            name: "Отзывы",
            href: "/#reviews"
        },
        {
            name: "Кто мы?",
            href: "/#about"
        },
        {
            name: "Личный кабинет",
            href: "/profile"
        },
    ]
}

export function Menu() {
    const [open,setOpen] = useState(false);
    const locale = useLocale() as "en" | "ru";
    const t = useTranslations();

    const [item,setItem] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(()=>{
        setItem(localStorage.getItem("token"))
    },[pathname]);

    return(
        <nav>
            <div className=" lg:hidden">
                <svg
                    onClick={()=>{setOpen(prev=>!prev)}}
                    className=" fill-main-purple cursor-pointer outline-none"
                    width="30"
                    height="32"
                    viewBox="0 0 32 44"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect className={clsx(
                        open ? " translate-x-[7px] translate-y-[25.5px] -rotate-45" : "translate-x-[2px] translate-y-[7px]",
                        "transition-all duration-500"
                    )} width={30} height={4} rx={2}/>
                    <rect 
                    className={clsx(
                        open ? " translate-x-[10px] translate-y-1 rotate-45" : "translate-x-[3px] translate-y-[19px]",
                        "transition-all duration-500"
                        )} width={30} height={4} rx={2}/>
                    <rect className={clsx(
                        open ? " translate-x-[10px] translate-y-1 rotate-45" : "translate-x-[3px] translate-y-[31px]",
                        "transition-all duration-500"
                        )} width={30} height={4} rx={2}/>
                </svg>
            </div>
            <ul className={clsx(
                " max-lg:absolute w-full left-0 max-lg:bg-white max-xl:gap-8 max-lg:translate-y-7 max-lg:py-5 max-lg:flex-col flex items-center gap-14",
                !open && "max-lg:hidden"
            )}>
                {navLinksLanguage[locale].map((link,index)=>(
                    <li 
                        className="relative" 
                        key={link.name+index}
                    >
                        <Link 
                            onClick={()=>setOpen(false)} 
                            href={navLinksLanguage[locale].length-1 != index ? link.href : item ? link.href : "/auth"}
                            
                        >
                            {navLinksLanguage[locale].length-1 != index ? link.name : item ? link.name : t("Войти")}
                        </Link>
                    </li>
                ))}
                    <li>
                        <Link onClick={()=>setOpen(false)} href={'/'} className="flex relative border border-main-blue gap-3 py-2 px-5 rounded-full">
                            <Image width={25} height={25} alt="tg" src={'/images/telegram.svg'}/>
                            Telegram Support
                        </Link>
                    </li>
            </ul>
        </nav>
    )
}