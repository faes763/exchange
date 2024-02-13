import { ToastContainer } from "react-toastify";
import { About } from "./about";
import { ExchangeForm } from "./exchange/exchange-form";
import { ExchangePopup } from "./exchange/exchange-popup";
import { How } from "./how";
import { useTranslations } from "next-intl";
import 'react-toastify/dist/ReactToastify.css';

export function Welcome() {
    const t = useTranslations('welcome');
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