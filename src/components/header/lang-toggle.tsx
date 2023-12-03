'use client'

import { Switch } from "@headlessui/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition,useRef, useEffect, useState } from "react";

export function LanguageToggle() {
    const router = useRouter();

    const locale = useLocale();

    const [enabled,setEnabled] = useState(locale=="ru" ? false : true);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    function changeLang(enable:boolean) {
        const name = pathname.replace(!enable ? "/en" : "/ru","");
        const query = searchParams.toString();

        startTransition(() => {
            router.replace(!enable ? `/ru/${name}${query ? `?${query}` : ""}` : `/en/${name}${query ? `?${query}` : ""}`,{scroll:false});    
        });
    }


    return(
        <div className=" uppercase gap-2 items-center flex">
            <span>ru</span>
            <Switch
                checked={enabled}
                onChange={changeLang}
                className={`shadow-inner inline-flex h-9 px-2 items-center bg-main-gray  w-14 cursor-pointer rounded-full `}>
                <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-main-blue shadow-xl ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
            <span >en</span>
        </div>
    )
}