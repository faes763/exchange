import { useTranslations } from "next-intl"

export default function PolicyPage() {
    const t = useTranslations();
    return(
        <div className="text-center md:max-w-[80%] mx-4 md:mx-auto space-y-10">
            <p className=" font-bold text-h1">{t("Правила stuartexchange")}</p>
            <p>
                {t("На сайте stuartexchange")}
                <br/><br/>
                {t("Противодействие отмыванию денег (AML)")}
                <br/><br/>
                {t("Противодействие финансированию")}
                <br/><br/>
                {t("В случае несоблюдения правил")}
                <br/><br/>
                {t("Для возврата средств необходимо")}
            </p>
        </div>
    )
}