import { useTranslations } from "next-intl";

const reviews = [
    {
        name: "Игорь",
        text: "cool",
        date: "12.03.2023 "
    },
    {
        name: "Игорь",
        text: "cool",
        date: "12.03.2023 "
    },
    {
        name: "Игорь",
        text: "cool",
        date: "12.03.2023 "
    },
    {
        name: "Игорь",
        text: "cool",
        date: "12.03.2023 "
    },
]

export function Reviews() {
    const t = useTranslations();
    return(
        <div id="reviews" className=" ">
            <div className="container space-y-16">
                <h2 className=" text-4xl text-center font-semibold">{t("reviews.text")} <span className=" text-main-blue font-bold">{t("reviews.sub")}</span></h2>
                <div className=" flex items-center max-lg:grid grid-cols-1 justify-between  gap-10 ">
                    <div className="bg-white flex-1 py-5 px-8 space-y-4 border border-main-blue rounded-xl">
                        <p className=" font-semibold text-lg">{reviews[0].name}</p>
                        <p className=" text-sm">{reviews[0].text}</p>
                        <p className=" text-[#C6C6C6]">{reviews[0].date}</p>
                    </div>
                    <div className="flex-1 space-y-5">
                        <div className="bg-white flex-1 py-5 px-8 space-y-4 border border-main-blue rounded-xl">
                            <p className=" font-semibold text-lg">{reviews[0].name}</p>
                            <p className=" text-sm">{reviews[0].text}</p>
                            <p className=" text-[#C6C6C6]">{reviews[0].date}</p>
                        </div>
                        <div className="bg-white flex-1 py-5 px-8 space-y-4 border border-main-blue rounded-xl">
                            <p className=" font-semibold text-lg">{reviews[0].name}</p>
                            <p className=" text-sm">{reviews[0].text}</p>
                            <p className=" text-[#C6C6C6]">{reviews[0].date}</p>
                        </div>
                    </div>
                    <div className="bg-white flex-1 py-5 px-8 space-y-4 border border-main-blue rounded-xl">
                        <p className=" font-semibold text-lg">{reviews[0].name}</p>
                        <p className=" text-sm">{reviews[0].text}</p>
                        <p className=" text-[#C6C6C6]">{reviews[0].date}</p>
                    </div>
                </div>
                <div className=" text-center">
                    <button className=" px-12 py-4 rounded-lg text-white bg-main-blue">Прочитать все отзывы</button>
                </div>
            </div>
        </div>
    )
}