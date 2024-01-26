'use client'
import { useTranslations } from "next-intl";
import { Fade } from "react-awesome-reveal";

export function How() {
    const t = useTranslations();
    return(
        // <div className="flex justify-center">
            <Fade className="flex justify-center">
                <div className=" py-12 max-lg:px-12 md:max-w-[80%] max-md:px-8 max-lg:py-6 px-24 rounded-xl inline-block space-y-3 text-center bg-[#EBEBEB]">
                    <h2 className=" text-4xl text-center font-semibold">{t("nal.text")} <span className=" text-main-blue font-bold">{t("nal.sub")}</span></h2>
                    <p>{t("nal.desc")}</p>
                </div>
            </Fade>
        // </div>
    )
}