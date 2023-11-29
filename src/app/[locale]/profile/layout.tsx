'use client'
import { axiosCfg } from "@/core-axios";
import { Sprite } from "@/tags/sprite";
import clsx from "clsx";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";


const pagination = {
    ru: [
        {
            name: "Профиль",
            href: "/profile",
            sprite: "profile"
        },
        {
            name: 'История',
            href: "/profile/history",
            sprite: "history"
        },
        {
            name: "Выйти",
            href: "/",
            sprite: "exit",
            onClick: ()=>{localStorage.removeItem('token')}
        }
    ],
    en: [
        {
            "name": "Profile",
            "href": "/profile",
            "sprite": "profile"
        },
        {
            "name": "History",
            "href": "/profile/history",
            "sprite": "history"
        },
        {
            "name": "Sign Out",
            "href": "/request",
            "sprite": "exit",
            onClick: ()=>{localStorage.removeItem('token')}
        }
    ]
}

export default function ProfileLayout({
    children,
  }: {
    children: ReactNode
}) {
    const pathname = usePathname();
    const locale = useLocale() as 'ru' | 'en';
    const [show,setShow] = useState(false);
    const router = useRouter();
    useEffect(()=>{
        if(localStorage.getItem('token')) {
            axiosCfg.interceptors.request.use(
                config => {
                    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
                    return config;
                },
                error => {
                    return Promise.reject(error);
                }
            );
            axiosCfg('/exchange/user/tickets').then(res=>{
                setShow(true);
            }).catch((error)=>{
                console.log(error);
                router.push('/auth');
            });
        } else {
            router.push('/auth');
        }
    },[]);


    if(show)return(
        <main className="min-h-screen">
            <div className="container gap-10 max-lg:flex max-lg:flex-col grid grid-cols-[300px_1fr]">
                <div className=" space-y-8">
                    <p className=" text-3xl font-bold">Настройки</p>
                    <div className="bg-main-gray p-10 max-md:p-5 rounded-lg flex flex-col gap-5">
                        {pagination[locale].map((link,index)=>(
                            <Link onClick={()=>{
                                if(link.onClick) link.onClick();
                            }} className={clsx(
                                pathname.replace(locale+"/","") == link.href && "text-black",
                                "flex gap-2 text-[#9D9D9D]"
                            )} key={link.href+link.name+index} href={link.href}>
                                <Sprite name={link.sprite} className="w-5 h-5"/>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
                {children}
            </div>
        </main>
    )
}