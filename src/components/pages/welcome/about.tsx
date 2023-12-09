import { useLocale, useTranslations } from "next-intl";
import Image from "next/image"

const about = {
    ru: [
        {
            course : "Анонимность обмена",
            text: "Мы не просим и не храним данные наших клиентов. Выбирая нас, вы гарантируете свою конфиденциальность.",
            sprite: "/images/anon.png"
        },
        {
            course : "Стабильный курс",
            text: "Наш обменник работает по API CoinGecko - курс фиксируется на момент сделки, что дает прозрачность обмена и без навязывания дополнительных комиссий.",
            sprite: "/images/rate.png"  
        },
        {
            course : "Мгновенный обмен",
            text: "Наши операторы работают 24/7! Мы гарантируем скорость обменных транзакций и фиатных расчетов!",
            sprite: "/images/exch.png"
        },
    ],
    en: [
        {
            "course": "Anonymous Exchange",
            "text": "We neither ask for nor store our clients' data. By choosing us, you ensure your confidentiality.",
            "sprite": "/images/anon.png"
        },
        {
            "course": "Stable Exchange Rate",
            "text": "Our exchange works with the CoinGecko API - the rate is fixed at the time of the transaction, providing transparency and avoiding additional fees.",
            "sprite": "/images/rate.png"
        },
        {
            "course": "Instant Exchange",
            "text": "Our operators work 24/7! We guarantee speed in exchange transactions and fiat settlements!",
            "sprite": "/images/exch.png"
        }
    ]
}

export function About() {
    const locale = useLocale() as "en" | "ru";
    const t = useTranslations("Index");
    return(
        <div id="about" className=" space-y-5">
            <h2 className=" text-4xl text-center font-semibold">{t("aboutTitle")} <span className=" text-main-blue font-bold">{t("aboutSubtitle")}</span></h2>
            <div className=" max-lg:grid-cols-1 justify-items-center gap-5 grid grid-cols-3">
                {about[locale].map((me,index)=>(
                    <div className="p-5 bg-white shadow-about rounded-xl space-y-2  " key={me.course+index}>
                        <img className=" w-10 h-10" src={me.sprite} alt={""}/>
                        <p className=" text-lg font-semibold">{me.course}</p>
                        <p>{me.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}