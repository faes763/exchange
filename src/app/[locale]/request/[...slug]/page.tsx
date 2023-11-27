'use client'
import { fetcherFetchMonitoring } from "@/core-axios";
import useCountdownTimer from "@/hooks/useTimer";
import { LoadingButton } from "@/tags/buttons";
import { Sprite } from "@/tags/sprite";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react"
import useSWR from "swr";

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

export default function Request({
    params
}:{
    params:{slug:string[]}
}) {
    
    const [show,setShow] = useState(false);
    const [isPaid,setPaid] = useState(false);
    const [isError,setError] = useState(false);
    const { data, error, isLoading } = useSWR<RequestType>(`exchange/ticket/get?id=${params.slug[0]}`, fetcherFetchMonitoring);
    const t = useTranslations();

    useEffect(()=>{
        if(data) {
            switch (data.status) {
                case "RECEIVED":
                    setPaid(true);
                    break;
                case "COMPLETED":
                    setShow(true);
                    setError(false);
                    break;
                case "PENDING":
                    setPaid(false);
                    break;
                case "FAILED":
                    setShow(true);
                    setError(true);
                    break;
              }
        }
    },[data])

    if(isLoading) return (
        <div className="flex justify-center items-center">
            <h3 className="text-xl mr-4">{t("Пожалуйста подождите")}</h3>
            <div className={clsx("dots flex space-x-1", {
                'hidden': error
            })}>
                <div className="dot-1 w-1 h-1 bg-black rounded-full"/>
                <div className="dot-2 w-1 h-1 bg-black rounded-full"/>
                <div className="dot-3 w-1 h-1 bg-black rounded-full"/>
            </div>
        </div>
    )
       

    return(
        <main >
           <div className=" container">
                <div className=" max-md:flex-col items-center flex mb-8 justify-between">
                    <h1 className=" text-h1 text-center font-semibold">{t("yourRequestAccepted")}</h1>
                    <p>{t("requestNumber")} #{data?.id}</p>
                </div>
                <div className="flex max-md:flex-col-reverse flex-col gap-8">
                    <div className=" gap-5 max-lg:grid-cols-2 max-md:grid-cols-1 rounded-lg grid grid-cols-4">
                        <div className=" bg-main-gray rounded-lg py-5 px-8 space-y-4">
                            <p className=" text-[#5E5E5E]">{t("Отдаете")}:</p>
                            <p className=" text-lg font-semibold">{data?.amountSent} {data?.currencySent}</p>
                        </div>
                        <div className=" bg-main-gray py-5 rounded-lg px-8 space-y-4">
                            <p className=" text-[#5E5E5E]">{t("Получаете")}</p>
                            <p className=" text-lg font-semibold">{data?.amountReceived} {data?.currencyReceived} </p>
                        </div>
                        <div className=" bg-main-gray py-5 rounded-lg px-8 space-y-4">
                            <p className=" text-[#5E5E5E]">E-mail:</p>
                            <p className=" break-words text-lg font-semibold">{data?.email}</p>
                        </div>  
                        <div className=" bg-main-gray py-5 rounded-lg px-8 space-y-4">
                            <p className=" text-[#5E5E5E]">{t("Счёт получения")}</p>
                            <p className="  text-lg font-semibold">{data?.addressSent}</p>
                        </div>
                    </div>
                    
                {data && <>
                    {show ? <Success status={isError ? "COMPLETED":"FAILED"}/> : 
                <WaitSuccess
                    amount={`${data.amountReceived}`}
                    status={isPaid ? "Received":"Pending"}
                    received={`${data.currencyReceived}`} 
                    addressReceived={data.addressReceived}
                    date={`${data.createdAt}`}
                />}
                </>}
                    
                </div>
           </div>
        </main>
    )
}
function Success({
    status
}:{
    status: "COMPLETED" | "FAILED"
}) {
    const t = useTranslations();
    return(
        <div className={` py-10 text-white rounded-xl ${status == 'COMPLETED' ? 'bg-main-green': 'bg-red-800'} space-y-5 text-center `}>
            <p className=" text-3xl font-semibold">{t(status == 'COMPLETED' ? "Ваша заявка успешно выполнена!" : "Ваша заявка истекла!")}</p>
            <p className=" font-semibold">{t(status == 'COMPLETED' ?"Спасибо за ваш обмен, возвращайтесь к нам еще!" :"В случае возникновении каких-либо вопросов или если ваши деньги не дошли до нас, напишите в техническую поддержку @StuartExchange")}</p>
        </div>
    )
}

function WaitSuccess({
    addressReceived,
    amount,
    received,
    status,
    date
}:{
    addressReceived:string;
    amount: string;
    received:string;
    status: "Received" | "Pending";
    date: string;
}) {
    const t = useTranslations();
    const { hours, minutes, seconds } = useCountdownTimer(date,2);
    const [click,setClick] = useState('text-white')
    const [click1,setClick1] = useState('text-white')
    return(
        <div className=" max-xl:flex-col flex gap-10">
            <div className=" bg-main-blue rounded-2xl text-white flex flex-col gap-5 p-10 xl:w-4/5">
                <p className=" text-3xl font-semibold">
                    {t(status == "Pending" ? "Оплатите заявку в течении" : "Мы получили платеж, находимся в процессе выплаты")} 
                    {status == "Pending" && (
                    <span>
                       {` ${hours}:${minutes.toString().length==1 ? "0"+minutes : minutes}:${seconds.toString().length==1 ? "0"+seconds : seconds}`}
                    </span>
                    )}
                </p>
                <div className="flex max-md:flex-col py-5 border-y gap-10 border-white">
                    <div className=" space-y-3">
                        <span className=" font-semibold">{t("Сумма")}:</span>
                        <p  onClick={()=>{
                                navigator.clipboard.writeText(amount);
                                setClick1("text-green-400")
                                setTimeout(()=>{setClick1('text-white')},1500)
                            }} className={`flex ${click1} items-center gap-2 text-lg`}>
                            {`${amount} ${received}`}
                            <Sprite name="copy" className={`w-5 h-5`}/>
                        </p>
                    </div>  
                    <div className={` space-y-3`}>
                        <span className=" font-semibold">{t("Кошелёк")}:</span>
                        <p onClick={()=>{
                                navigator.clipboard.writeText(addressReceived);
                                setClick("text-green-400")
                                setTimeout(()=>{setClick('text-white')},1500)
                        }} className={`${click}  flex items-center gap-2 text-lg`}> 
                            <span className="w-full break-words">{addressReceived}</span>
                            <Sprite  name="copy" className={`w-5  h-5`}/>
                        </p>
                    </div>
                </div>
                <div>
                    <span className="text-lg font-semibold">{t("Данная операция производится оператором в ручном режиме и занимает от 5 до 60 минут")}</span>
                </div>
            </div>
            <div className=" p-4 items-center flex justify-center rounded-xl bg-main-gray xl:w-1/5">
                <QRCodeCanvas size={224} bgColor="#FFFFFF" className="mx-auto" value={addressReceived}/>
            </div>
        </div>
    )
}