'use client'
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image"
import { MouseParallax } from "react-just-parallax";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Fade } from "react-awesome-reveal";

const about = {
    ru: [
        {
            course : "Анонимность обмена",
            text: "Мы не просим и не храним данные наших клиентов. Выбирая нас, вы гарантируете свою конфиденциальность.",
            sprite: "/images/anon.png"
        },
        {
            course : "Стабильный курс",
            text: "Наш обменник работает по API CoinGecko и Garantex - курс фиксируется на момент сделки, что дает прозрачность обмена и без навязывания дополнительных комиссий.",
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
            "course": "Exchange Anonymity",
            "text": "We do not request or store our customers' data. By choosing us, you guarantee your confidentiality.",
            "sprite": "/images/anon.png"
        },
        {
            "course": "Stable Exchange Rate",
            "text": "Our exchange works with the CoinGecko and Garantex APIs - the rate is fixed at the time of the transaction, providing transparency in the exchange process without imposing additional fees.",
            "sprite": "/images/rate.png"
        },
        {
            "course": "Instant Exchange",
            "text": "Our operators work 24/7! We guarantee the speed of exchange transactions and fiat settlements!",
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
            <div className="  max-lg:grid-cols-1 justify-items-center gap-5 grid grid-cols-3">
            <Fade triggerOnce className=" h- w-full" cascade>
                {about[locale].map((me,index)=>(
                    <div className="p-5 w-full h-full    bg-white shadow-about rounded-xl space-y-2  " key={me.course+index}>
                        <img className=" w-10 h-10" src={me.sprite} alt={""}/>
                        {/* <MouseParallaxImage url={me.sprite} i={index}/> */}
                        <p className=" text-lg font-semibold">{me.course}</p>
                        <p>{me.text}</p>
                    </div>
                ))}
            </Fade>
            </div>
        </div>
    )
}

const ease = [0.23, 1, 0.32, 1];

 function MouseParallaxImage({
    url,
    i
}:{
    url:string;
    i:number;
}) {
    const [reveal, setReveal] = useState(false);

    useEffect(() => {
        setTimeout(() => setReveal(true), 420);
    }, []);
    return(
        <div className=" w-12 max-md:w-8 max-md:h-8 h-12">
            <MouseParallax lerpEase={0.05} shouldPause={false} strength={0.02}>
                <motion.div
                    className="w-full h-full "
                    animate={reveal ? { opacity: 1, scale: 1 } : {opacity: 0, scale: 0}}
                    initial={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.6, ease, delay: i / 20 }}
                >
                    <img
                        src={url}
                        alt=""
                        width={512}
                        height={512}
                        className="w-full  h-full select-none transition-all"
                        draggable={false}
                    />
                </motion.div>
        </MouseParallax>
        </div>
    )
}