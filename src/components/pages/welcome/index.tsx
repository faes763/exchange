'use client'
import { ToastContainer } from "react-toastify";
import { About } from "./about";
import { ExchangeForm } from "./exchange/exchange-form";
import { ExchangePopup } from "./exchange/exchange-popup";
import { How } from "./how";
import { useTranslations } from "next-intl";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";


function hasElapsed30Seconds(startTime:number) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    return elapsedTime >= 30000; // Проверяем, прошло ли 30 секунд (30 * 1000 миллисекунд)
}


export function Welcome() {

    useEffect(()=>{
        const date = new Date().getTime();
        const getTime = localStorage.getItem('date');
        if(getTime) {
            if(hasElapsed30Seconds(+getTime)) {
                localStorage.setItem('date',`${date}`);
                setTimeout(()=>{
                    setShow(true);
                },1500);
            }
            else setShow(true);
        } else {
            localStorage.setItem('date',`${date}`);
            setTimeout(()=>{
                setShow(true);
            },1500);
        }
    },[]);
    

    const [show,setShow] = useState<boolean>(false);

    const t = useTranslations('welcome');

    // if(!show) return(
    //     <div className="fixed z-[60] bg-white dark:bg-main-body min-h-screen inset-0 flex items-center justify-center">
    //         <div className="loader">loading</div>
    //     </div>
    // )

    return(
        <main>
            <div className="container flex flex-col gap-16 max-md:gap-8">
                <h1 className=" text-h1 text-center font-semibold">{t('h1.text')}<span className=" text-main-blue font-bold">{t('h1.span')}</span> {t('h1.text1')}</h1>
                <ExchangeForm/>
                <How/>
                {/* <Reviews/> */}
                <About/>
                <ExchangePopup/>
            </div>
            <div className="coin coin_1"></div>
            <div className="coin coin_2"></div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </main>
    )
}