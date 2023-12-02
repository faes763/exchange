'use client'
import { Listbox, Tab } from "@headlessui/react";
import clsx from "clsx";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import FormClearingBtc from "./FormClearingBtc";
import { useLocale, useTranslations } from "next-intl";
import { axiosCfg, fetcherFetch } from "@/core-axios";

const tabLists = {
    ru: [
        "Обмен",
        "Миксер"
    ],
    en: [
        "Swap",
        "Mix"
    ]
}


export function ExchangeForm() {
    const locale = useLocale() as "en" | "ru";
    
    return (
        <div>
            <Tab.Group>
                <Tab.List className={' flex justify-center gap-3'}>
                    {tabLists[locale].map((list: string, index: number) => (
                        <Tab
                            className={({ selected }) =>
                                clsx(
                                    selected ? " bg-main-blue text-white" : " text-black bg-white border border-main-blue",
                                    " px-10 py-3  rounded-xl font-semibold tracking-wide"
                                )
                            }
                            key={list + index}
                        >
                            {list}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className={' mt-5 flex flex-col items-center'}>
                    <Tab.Panel className={' w-full'}>
                        <Form />
                    </Tab.Panel>
                    <Tab.Panel className={' w-full'}> 
                        <FormClearingBtc />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}




interface courseType {
    minValue: number,
    maxValue: number,
    convertedValue: number,
    oneValue: number,
}
const course:courseType = {
    minValue: 0,
    maxValue: 0,
    convertedValue: 0,
    oneValue: 0,
}


export const Form = () => {
    const router = useRouter();
    const t = useTranslations();
    const [state,setState] = useState<courseType>(course);
    const [received,setReceiver] = useState<number | null>(null);

    const [sendValutas, setSendValutas] = useState<string[]>([""]);
    const [sendIndex,setSendIndex] = useState<number>(0);

    const [receiverValutas, setReceiverValutas] = useState<string[]>([""]);
    const [receiverIndex,setReceiverIndex] = useState<number>(0);

    const validationSchema = Yup.object().shape({
        telegram: Yup.string().required(t("Введите логин телеграма")),
        email: Yup.string().email(t("Введите свой e-mail")),
        send: Yup.string().required(t("Выберите валюту")),
        valueValuta: Yup.number().required(t("Введите число")).min(state.minValue,`${t("Минимальное число")}: ${Number(state.minValue)?.toFixed(6)}`).max(state.maxValue,`${t("Максимальное число")}: ${state.maxValue}`),
        receiver: Yup.string().required(t("Выберите валюту")),
        account: Yup.string().required(t("Счёт получения"))
    });
    const formik = useFormik({
      initialValues: {
        telegram: "",
        email: "",
        send: "",
        valueValuta: 1,
        receiver: "",
        account: ""
      },
      validationSchema:  validationSchema,
      onSubmit: async (values) => {
        try {
            axiosCfg.get(`/exchange/ticket/create?currency=${values.send}&amountSent=${received}&telegramId=${values.telegram}${values.email ? `&email=${values.email}` : ""}&amountReceived=${values.valueValuta}&addressSent=${values.account}&currencySent=${receiverValutas[receiverIndex]}`).then((res:any)=>{
                router.push(`/request/${res.data.id}/${values.send}`)
            })
        } catch (error) {
            console.error(error);
            alert("Произошла ошибка... \n попробуйте позже")
        }
      },
    });

    

    useEffect(()=>{
        const send = sendValutas[sendIndex];
        const receiver = receiverValutas[receiverIndex];

        formik.setFieldValue('send',send);
        formik.setFieldValue('receiver',receiver);

        fetcherFetch(`course/?from=${send || "BTC"}&to=${receiver || "USDTTRC20"}&amount=${formik.values.valueValuta}`).then((res:courseType)=>{
            setState(res);
            formik.setFieldValue('valueValuta',1);
            setReceiver(+Number(res.oneValue)?.toFixed(numbFixed(receiverValutas[receiverIndex])));
        });
    },[sendIndex,receiverIndex]);

    const [showEmail,setShowEmail] = useState(false);

    useEffect(()=>{
        fetcherFetch('assets?flag=true').then(setSendValutas);
        fetcherFetch('assets?flag=false').then((res:string[])=>{
            setReceiverValutas(res?.reverse());
            res.find((vault,index)=>{
                if(vault == "USDTTRC20") setReceiverIndex(index);
            });
        });
        const token = localStorage.getItem("token");
        if(token) {
            setShowEmail(true);
            axiosCfg.interceptors.request.use(
                config => {
                    config.headers.Authorization = `Bearer ${token}`;
                    return config;
                },
                error => {
                    return Promise.reject(error);
                }
            );
            axiosCfg.get("/exchange/user/info").then((res)=>{
                formik.setFieldValue('email',res.data?.email || "");
                formik.setFieldValue('telegram',res.data?.telegram || "");

            })
        }
    },[]);

    function numbFixed(valuta:string) {
        if(["TCSBQRUB","CASHRUB2","CASHRUB","SBERRUB","SBPRUB"].includes(valuta)) return 0;
        if(['USDTTRC20',"USDTERC20","DAI"].includes(valuta)) return 3
        if(["XMR","DOGE","LTC",,"ETH","BTC"].includes(valuta)) return 6;
    }

    
    return (
      <form
            className="grid gap-5 max-md:flex flex-col grid-cols-[repeat(2,minmax(0,1fr))]"
            onSubmit={formik.handleSubmit}
        >
            <div className=" flex justify-between flex-col gap-5">
                <div className=" py-10 max-md:px-5 max-md:py-10 space-y-5 bg-main-blue rounded-2xl px-10">
                    <label className=" text-xl text-white">{t('Отдаете')}:</label>
                    <div className="bg-white rounded-lg items-center flex px-5 gap-5 justify-between relative">
                        <input
                            className="outline-none w-full py-4 max-md:py-3"
                            placeholder="Введите число"
                            id="valueValuta"
                            name="valueValuta"
                            type="number"
                            onChange={(e)=>{
                                setReceiver(+(+e.target.value*state.oneValue).toFixed(numbFixed(receiverValutas[receiverIndex])));
                                formik.handleChange(e);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.valueValuta}
                        />
                        <div className="  relative">
                            <List name="send" select1={receiverValutas[receiverIndex]} select={sendValutas[sendIndex]} setSelect={setSendIndex} arrayList={sendValutas || []}/>
                        </div>                        
                    </div>
                    <ErrorView id="valueValuta" formik={formik}/>
                    <ErrorView id="send" formik={formik}/>


                    {state && state.oneValue>0 && (
                    <div className="text-white md:text-lg">
                        <p>1 {sendValutas[sendIndex]} = {+(state?.oneValue).toFixed(numbFixed(receiverValutas[receiverIndex]))} {receiverValutas[receiverIndex].toLowerCase().includes('run') ? "RUB" : receiverValutas[receiverIndex]} </p>
                        <p>{t('Index.minimumExchange')}  {Number(state?.minValue || 0).toFixed(6)} {sendValutas[sendIndex]}</p>
                     </div>
                    )}
                </div>
                <div className=" p-10 max-md:p-5 space-y-2  bg-main-blue rounded-2xl">
                    <p className=" text-white  text-xl">{t('Получайте')}:</p>
                    <div className="bg-white py-4 max-md:py-3 rounded-lg items-center flex px-5 gap-5 justify-between relative">
                        <input
                            className="outline-none"
                            placeholder="Введите число" 
                            type="number"
                            onChange={(e)=>{
                                setReceiver(+e.target.value);
                                console.log(receiverValutas[receiverIndex]);
                                formik.setFieldValue('valueValuta',+(+e.target.value/state.oneValue)?.toFixed(numbFixed(sendValutas[sendIndex])))
                            }}
                            value={`${receiverValutas[receiverIndex] == "TCSBQRUB" ? `${received}`.length>5 ? Math.floor((received || 0) / 1000) * 1000 : received : received}`} 
                        />
                        <div className="  relative">
                            <List name="receiver" select1={sendValutas[sendIndex]} select={receiverValutas[receiverIndex]} setSelect={setReceiverIndex} arrayList={receiverValutas || []}/>
                        </div>                        
                    </div>
                    <ErrorView id="receiver" formik={formik}/>
                </div>
                
                <div className="bg-white max-md:px-5 flex gap-5 py-4 border rounded-2xl border-main-blue px-10">
                    <Image width={40} height={40} alt="Предупреждаем!" src={'/images/informate.svg'}/>
                    <p className="max-md:text-xs font-semibold text-sm">{t("Связь")}</p>
                </div>
            </div>
            <div className="h-full flex flex-col gap-5">
                <div className=" h-full flex flex-col p-10 max-md:p-5 justify-center gap-10 rounded-2xl bg-main-blue">
                    {showEmail && (
                    <div className=" space-y-2">
                        <label className=" text-xl text-white">E-mail:</label>
                        <input
                            className="outline-none px-5 rounded-lg w-full py-4 max-md:py-3"
                            placeholder={t("Введите свой e-mail")}
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        <ErrorView id="email" formik={formik}/>
                    </div>)}
                    
                    <div className=" space-y-2">
                        <label className=" text-xl text-white">{t("Логин в телеграме")}:</label>
                        <input
                            className="outline-none px-5 rounded-lg w-full py-4 max-md:py-3"
                            placeholder={t("Введите логин телеграма")}
                            id="telegram"
                            name="telegram"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.telegram}
                        />
                        <ErrorView id="telegram" formik={formik}/>
                    </div>
                    <div className=" space-y-2">
                        <label className=" text-xl text-white">{t("Счёт получения")}:</label>
                        <input
                            className="outline-none px-5 rounded-lg w-full py-4 max-md:py-3"
                            placeholder={t("Введите свой счет получения")}
                            id="account"
                            name="account"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.account}
                        />
                        <ErrorView id="account" formik={formik}/>
                    </div>
                </div>
                
                <button 
                    type="submit"
                    className=" bg-main-blue py-5 rounded-2xl px-10 text-white text-center"
                >{t('Оставить заявку на обмен')}</button>   

            </div>
      </form>
    );
};
const cards = {
    ru: {
        SBPRUB: 'СБП',
        SBERRUB: 'Сбербанк',
        CASHRUB: 'Наличные Москва',
        CASHRUB2: 'Наличные другие города',
        TCSBQRUB: 'Тинькофф QR',
        USDTTRC20: "USDT TRC20",
        USDTERC20: "USDT ERC20",
    },
    en: {
        SBPRUB: "SBP",
        SBERRUB: "Sberbank",
        CASHRUB: "Cash Moscow",
        CASHRUB2: "Cash other cities",
        TCSBQRUB: "Tinkoff QR",
        USDTTRC20: "USDT TRC20",
        USDTERC20: "USDT ERC20",
    }
}

function List({
    arrayList,
    select,
    setSelect,
    name,
    select1
}: {
    arrayList: string[],
    select: string,
    setSelect: Dispatch<SetStateAction<number>>,
    name: string;
    select1: string;
}) {
    const locale = useLocale() as "ru" | "en";
    const map = cards[locale];

    return(
    <Listbox
        name={name}
        value={0}
        onChange={setSelect}
    >
        <Listbox.Button className={' uppercase max-md:text-xs text-main-dark-gray '}>{(map as any)[select] != undefined? (map as any)[select] : select}</Listbox.Button>
        <Listbox.Options className={' flex flex-col gap-2 px-5 top-full z-10 -right-5 rounded-b-xl absolute bg-white'}>
            {arrayList.map((list,index) => (
            (select != list && list!=select1) && (
                <Listbox.Option className={'whitespace-nowrap max-md:text-xs uppercase cursor-pointer text-main-dark-gray hover:text-black '} key={index+list} value={index}>
                {(map as any)[list] != undefined? (map as any)[list] : list}
                </Listbox.Option>
            )))}
        </Listbox.Options>
      </Listbox>
    )
}

function ErrorView({id,formik}:{id:string,formik:any}) {
    if(formik.touched[id] && formik.errors[id]) return (
        <div className=" text-red-600">{formik.errors[id]}</div>
    )
    return null;
}