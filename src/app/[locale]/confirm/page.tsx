'use client'

import { useState } from "react"

export default function Confirm() {
    const [show,setShow] = useState(false);
    return(
        <main className=" min-h-[50vh] min-[1556px]:min-h-[70vh]">
            <div className=" space-y-8 text-center container">
                <p className=" text-h1 text-center font-semibold">Подтвердите свою почту</p>
                <div className=" inline-block rounded-lg max-md:px-8 max-md:py-4 text-center px-16 py-8 bg-main-gray">
                    <p>{show ? "Ваш E-mail успешно подтвержден!" : "На ваш E-mail была выслана ссылка, для верификации вашего профиля, перейдите по ней, чтобы активировать аккаунт"}</p>
                </div>
            </div>
        </main>
    )
}