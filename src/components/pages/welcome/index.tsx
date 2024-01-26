import { About } from "./about";
import { ExchangeForm } from "./exchange/exchange-form";
import { ExchangePopup } from "./exchange/exchange-popup";
import { How } from "./how";
import { Reviews } from "./reviews";
import { useTranslations } from "next-intl";

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
        </main>
    )
}