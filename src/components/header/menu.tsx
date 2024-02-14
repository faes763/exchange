'use client'

import { Sprite } from "@/tags/sprite";
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
            href: "/en/"
        },
        // {
            // name:"Rules",
            // href:"/en/policy"
        // },
        {
            name: "Profile",
            href: "/en/profile"
        },
    ],
    ru: [
        {
            name: "Главная",
            href: "/ru/"
        },
        // {
        //     name:"Правила",
        //     href:"/ru/policy"
        // },
        {
            name: "Профиль",
            href: "/ru/profile"
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
                    className=" dark:fill-white fill-black cursor-pointer outline-none"
                    width="30"
                    height="32"
                    viewBox="0 0 32 44"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect 
                        className={clsx(
                            open ? " translate-x-[7px] translate-y-[25.5px] -rotate-45" : "translate-x-[2px] translate-y-[7px]",
                            "transition-all duration-500"
                        )} 
                        width={30} height={4} rx={2}
                    />
                    <rect 
                        className={clsx(
                            open ? " translate-x-[10px] translate-y-1 rotate-45" : "translate-x-[3px] translate-y-[19px]",
                            "transition-all duration-500"
                            )} 
                        width={30} height={4} rx={2}
                    />
                    <rect 
                        className={clsx(
                            open ? " translate-x-[10px] translate-y-1 rotate-45" : "translate-x-[3px] translate-y-[31px]",
                            "transition-all  duration-500"
                        )} 
                        width={30} height={4} rx={2}
                    />
                </svg>
            </div>
            <div>
                <ul className={clsx(
                    " max-lg:absolute w-full z-50 left-0 max-lg:bg-white  max-lg:dark:bg-main-header dark:backdrop-blur-sm max-lg:dark:bg-transparent  max-xl:gap-8 max-lg:translate-y-7 max-lg:py-5 max-lg:flex-col flex items-center gap-14",
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
                <li className="flex gap-5 max-lg:flex-col reverse items-center">
                <div className="flex border border-black dark:border-white items-center gap-3 py-2 px-5 rounded-full">
                    <Sprite name="lamp" className="w-5 h-5"/>
                    <p>StuartExchange@0nl1ne.at</p>
                </div>
                <div>
                    <Link onClick={()=>setOpen(false)} target="blank" href={'https://t.me/StuartEx_bot'} className="flex relative border border-main-blue gap-3 py-2 px-5 rounded-full">
                        <Image width={25} height={25} alt="tg" src={'/images/telegram.svg'}/>
                        Telegram Bot
                    </Link>
                </div>
                </li>
                </ul>
            </div>
        </nav>
    )
}