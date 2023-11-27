'use client'
import { axiosCfg } from "@/core-axios";
import clsx from "clsx"
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RequestType {
    addressReceived: string;
    addressSent: string;
    amountReceived: number;
    amountSent: number;
    id: string;
    currencyReceived: string;
    currencySent: string;
    status: "RECEIVED" | "COMPLETED" | "PENDING" | "FAILED";
    txId: null | string;
    email: string;
    createdAt: string;
}

export default function History() {
    const t = useTranslations();
    const [isLoading,setLoading] = useState(true);
    const router = useRouter();

    useEffect(()=>{
        axiosCfg('/exchange/user/tickets').then((res)=>{
            const data = res.data as RequestType[];
            setLoading(false);
            const formatData = data.map((res)=>{
                let date = new Date(res.createdAt);
                const formattedDate = date.toISOString().split('T')[0].replaceAll("-",".");
                return {
                    ...res,
                    createdAt: formattedDate
                };
            })
            setData(formatData);
        }).catch((error)=>{
            console.log(error);
            // router.push('/auth');
        });
    },[]);

    const [data,setData] = useState<RequestType[]>([]);

    return(
        <div className="flex p-10  max-md:p-5 bg-main-gray rounded-lg gap-5 flex-col">
            <div className="border-b-2 gap-1 max-md:hidden pb-5 grid grid-cols-5">
                <p>{t("Заявка")}</p>
                <p>{t("Дата")}</p>
                <p>{t("Отдаете")}</p>
                <p>{t("Получаете")}</p>
                <p>{t("Статус")}</p>
            </div>
            {isLoading && (
                    <div className="flex justify-center items-center">
                        <h3 className="text-xl mr-4">{t("Пожалуйста подождите")}</h3>
                        <div className={clsx("dots flex space-x-1")}>
                            <div className="dot-1 w-1 h-1 bg-black rounded-full"/>
                            <div className="dot-2 w-1 h-1 bg-black rounded-full"/>
                            <div className="dot-3 w-1 h-1 bg-black rounded-full"/>
                        </div>
                    </div>
            )}  
            {data.map((data,index)=>(
                <Link href={`/request/${data.id}/${data.currencyReceived}`} className=" border-b-2 gap-1 max-md:grid-cols-1 pb-5 grid grid-cols-5" key={data.email+ index + data.id}>
                    <p className=" flex justify-between"><span className=" md:hidden">Заявка</span>#{data.id}</p>
                    <p className=" flex justify-between"><span className=" md:hidden">Дата</span> {data.createdAt}</p>
                    <p className=" flex justify-between"><span className=" md:hidden">Отдаете</span>{data.amountSent+" "+data.currencySent}</p>
                    <p className=" flex justify-between"><span className=" md:hidden">Получаете</span>{data.amountReceived+" "+data.currencyReceived}</p>
                    <p className={clsx(
                        data.status == 'COMPLETED' && "text-green-600",
                        data.status == "FAILED" && "text-red-600",
                        (data.status == "PENDING") && "text-yellow-500",
                        data.status == "RECEIVED" && "text-orange-300",
                        " flex justify-between"
                    )}>
                        <span className=" md:hidden">Статус</span>{data.status}
                    </p>
                </Link>
            ))}
        </div>
    )
}