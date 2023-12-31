import { useTranslations } from "next-intl";

export function How() {
    const t = useTranslations();
    return(
        <div className=" mx-auto">
            <div className=" py-12 max-lg:px-12 max-md:px-8 max-lg:py-6 px-24 rounded-xl inline-block space-y-3 text-center bg-[#EBEBEB]">
                <h2 className=" text-4xl text-center font-semibold">{t("nal.text")} <span className=" text-main-blue font-bold">{t("nal.sub")}</span></h2>
                <p>{t("nal.desc")}</p>
            </div>
        </div>
    )
}