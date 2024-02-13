'use client'

import { axiosCfg } from "@/core-axios";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react"

export function Confirm({searchParams}:{searchParams:{email:string}}) {
    const [show,setShow] = useState(false);
    const t = useTranslations();

    useEffect(()=>{
        if(searchParams?.email) {
            axiosCfg.get(`/exchange/user/confirm/status?email=${searchParams.email}`).then((res)=>{
                if(!res.data) {
                    axiosCfg.get(`/exchange/user/confirm/send?email=${searchParams.email}`).then((res:any)=>{
                        console.log(res);
                    });
                } else setShow(true);
            });
        }
    },[]);

    return(
        <main className=" min-h-[50vh] min-[1556px]:min-h-[70vh]">
            <div className=" space-y-8 text-center container">
                {!show && <p className=" text-h1 text-center font-semibold">{t("Подтвердите свою почту")}</p>}
                <div className=" inline-block rounded-lg max-md:px-8 max-md:py-4 text-center px-16 py-8 dark:bg-transparent dark:bg-main-header bg-main-gray">
                    <p>{t(show ? "Ваш E-mail успешно подтвержден!" : "На ваш E-mail была выслана ссылка, для верификации вашего профиля, перейдите по ней, чтобы активировать аккаунт")}</p>
                </div>
            </div>
        </main>
    )
}