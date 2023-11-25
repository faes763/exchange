import { futura } from "@/styles/fonts";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "./menu";
import { LanguageToggle } from "./lang-toggle";


export function Header() {

    return(
        <header className="mb-16 max-md:mb-8 shadow-md max-lg:bg-white sticky top-0  z-10 py-4">
            <div className="absolute max-lg:hidden  top-0 left-0 w-full h-full bg-white/[0.75] backdrop-blur-[5px] -z-1"/>
            <div className=" flex relative gap-5 items-center justify-between container">
                <div className=" flex gap-10 max-md:gap-2 items-center" >
                    <Link href='/' className=" flex gap-3">
                        <Image width={40} height={80} alt="Logo" src={'/images/logo.svg'}/>
                        <p className={`${futura.className} text-h2 font-bold  `}><span className=" text-main-blue">STUART</span><br/> EXCHANGE</p>
                    </Link>
                    <LanguageToggle/>
                </div>
                <Menu/>
            </div>
        </header>
    )
}

