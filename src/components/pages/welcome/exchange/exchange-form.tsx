'use client'
import { Listbox, Tab } from "@headlessui/react";
import clsx from "clsx";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as Yup from "yup";
import FormClearingBtc from "../FormClearingBtc";
import { useLocale, useTranslations } from "next-intl";
import { axiosCfg, fetcherFetch } from "@/core-axios";
import { useFormStore } from "@/store/form-popup-store";

const tabLists = {
    ru: [
        // "Обмен",
        // "Миксер"
    ],
    en: [
        // "Swap",
        // "Mix"
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
                                    " px-10 py-3 text-xl max-md:text-base rounded-xl font-semibold tracking-wide"
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

    const [sendValutas, setSendValutas] = useState<string[]>([""]);
    const [sendIndex,setSendIndex] = useState<number>(0);

    const [receiverValutas, setReceiverValutas] = useState<string[]>([""]);
    const [receiverIndex,setReceiverIndex] = useState<number>(0);

    const {set,open,setSent} = useFormStore();

    const validationSchema = Yup.object().shape({
        telegram: Yup.string().required(t("Введите логин телеграма")).max(50,t("50 символов максимум")),
        email: Yup.string().email(t("Введите свой e-mail")),
        send: Yup.string().required(t("Выберите валюту")),
        valueValuta: Yup.number().required(t("Введите число")).min(state.minValue,`${t("Минимальное число")}: ${Number(state.minValue)?.toFixed(6)}`).max(state.maxValue,`${t("Максимальное число")}: ${state.maxValue}`),
        receiver: Yup.string().required(t("Выберите валюту")),
        account: Yup.string().required(t("Счёт получения")),
        received: Yup.number().required(t("Введите число")),
    });
    const formik = useFormik({
      initialValues: {
        telegram: "",
        email: "",
        send: "",
        valueValuta: 1,
        receiver: "",
        account: "",
        received: 0,
      },
      validationSchema:  validationSchema,
      onSubmit: async (values) => {
        try {
            setSent(receiverValutas[receiverIndex])
            set(values);
            open();
        } catch (error) {
            console.error(error);
            alert("Произошла ошибка... \n попробуйте позже");
        }
      },
    });

    const [translateAccount,setTranslateAccount] = useState<string>("Счёт получения");
    const [placeholderAccount,setPlaceholderAccount] = useState<string>("Введите свой счет получения");


    
    function isSBERReceiver(receiver: string) {
        switch(receiver) {
            case "SBERRUB":
                setTranslateAccount("Номер карты");
                setPlaceholderAccount("Введите номер карты");
                break;
            case "SBPRUB":
                setTranslateAccount("Номер телефона и банк получателя");
                setPlaceholderAccount("Укажите номер телефона и банк получателя");
                break;
            default: 
                setTranslateAccount("Счёт получения");
                setPlaceholderAccount("Введите свой счет получения");

        }
    }

    useEffect(()=>{
        const send = sendValutas[sendIndex];
        const receiver = receiverValutas[receiverIndex];
        formik.setFieldValue('send',send);
        formik.setFieldValue('receiver',receiver);

        isSBERReceiver(receiver);

        fetcherFetch(`course/?from=${send || "BTC"}&to=${receiver || "USDTTRC20"}&amount=${formik.values.valueValuta}`).then((res:courseType)=>{
            setState(res);
            formik.setFieldValue('valueValuta',1);
            formik.setFieldValue('receiver',+Number(res.oneValue)?.toFixed(numbFixed(receiverValutas[receiverIndex])));
            // setReceiver(+Number(res.oneValue)?.toFixed(numbFixed(receiverValutas[receiverIndex])));
        });

        const interval = setInterval(()=>{
            fetcherFetch(`course/?from=${send || "BTC"}&to=${receiver || "USDTTRC20"}&amount=${formik.values.valueValuta}`).then((res:courseType)=>{
                setState(res);
                formik.setFieldValue('valueValuta',1);
                formik.setFieldValue('receiver',+Number(res.oneValue)?.toFixed(numbFixed(receiverValutas[receiverIndex])));
            });
        },1000 * 120);

        return(()=>{
            clearInterval(interval)
        })

    },[sendIndex,receiverIndex]);

    const [showEmail,setShowEmail] = useState(false);

    useEffect(()=>{
        fetcherFetch('assets?flag=true').then(setSendValutas);
        fetcherFetch('assets?flag=false').then((res:string[])=>{
            const data = res.filter(el=>el!="TCSBQRUB");
            setReceiverValutas(data?.reverse());

            data.find((vault,index)=>{
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
        if(["TCSBQRUB","CASHRUB2","CASHRUB"].includes(valuta)) return 0;
        if(["SBERRUB","SBPRUB"].includes(valuta)) return 2;
        if(['USDTTRC20',"USDTERC20","DAIERC20"].includes(valuta)) return 3; 
        if(["XMR","DOGE","LTC","ETH","BTC"].includes(valuta)) return 6;
    }

    

    
    return (
      <form
            className="grid gap-5 max-md:flex flex-col grid-cols-[repeat(2,minmax(0,1fr))]"
            onSubmit={formik.handleSubmit}
        >
            <div className=" flex justify-between flex-col gap-5">
                <div className=" py-10 max-md:px-5 relative z-20 dark:bg-transparent dark:backdrop-blur-sm dark:bg-main-header max-md:py-10 space-y-2 bg-main-blue rounded-2xl px-10">
                    <label className=" text-xl text-white">{t('Отдаете')}:</label>
                    <div className="bg-white dark:bg-transparent dark:border dark:border-main-blue rounded-lg items-center flex px-5 gap-5 justify-between relative">
                        <input
                            className="outline-none bg-transparent w-full py-4 max-md:py-3"
                            placeholder={t("Введите число")}
                            id="valueValuta"
                            name="valueValuta"
                            type="number"
                            onChange={(e)=>{
                                formik.setFieldValue('receiver',+(+e.target.value*state.oneValue).toFixed(numbFixed(receiverValutas[receiverIndex])));
                                
                                // setReceiver(+(+e.target.value*state.oneValue).toFixed(numbFixed(receiverValutas[receiverIndex])));
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
                <div className=" p-10 max-md:p-5 relative z-10  dark:bg-transparent dark:backdrop-blur-sm dark:bg-main-header space-y-2  bg-main-blue rounded-2xl">
                    <p className=" text-white  text-xl">{t('Получайте')}:</p>
                    <div className="bg-white dark:bg-transparent dark:border dark:border-main-blue rounded-lg items-center flex px-5 gap-5 justify-between relative">
                        <input
                            className="outline-none bg-transparent w-full py-4 max-md:py-3"
                            placeholder={t("Введите число")}
                            type="number"
                            readOnly
                            name="receiver"
                            id="receiver"
                            onBlur={formik.handleBlur}
                            value={`${receiverValutas[receiverIndex] == "TCSBQRUB" ? `${formik.values.receiver}`.length>5 ? Math.floor((+formik.values.receiver || 0) / 1000) * 1000 : formik.values.receiver : formik.values.receiver}`}
                            // `${receiverValutas[receiverIndex] == "TCSBQRUB" ? `${received}`.length>5 ? Math.floor((received || 0) / 1000) * 1000 : received : received}`
                        />
                        <div className="  relative">
                            <List name="receiver" select1={sendValutas[sendIndex]} select={receiverValutas[receiverIndex]} setSelect={setReceiverIndex} arrayList={receiverValutas || []}/>
                        </div>                        
                    </div>
                    <ErrorView id="receiver" formik={formik}/>
                </div>
                
                <div className="bg-white dark:bg-transparent dark:bg-main-header max-md:px-5 flex gap-5 py-4 border rounded-2xl border-main-blue px-10">
                    <Image width={40} height={40} alt="Предупреждаем!" src={'/images/informate.svg'}/>
                    <p className="max-md:text-xs font-semibold text-sm">{t("Связь")}</p>
                </div>
            </div>
            <div className="h-full flex flex-col gap-5">
                <div className=" h-full flex flex-col p-10 max-md:p-5 dark:bg-transparent dark:backdrop-blur-sm dark:bg-main-header justify-center gap-10 rounded-2xl  bg-main-blue">
                    {showEmail && (
                    <div className=" space-y-2">
                        <label className=" text-xl text-white">E-mail:</label>
                        <input
                            readOnly
                            className="outline-none dark:bg-transparent dark:border dark:border-main-blue px-5 rounded-lg w-full py-4 max-md:py-3"
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
                            className="outline-none dark:bg-transparent dark:border  dark:border-main-blue px-5 rounded-lg w-full py-4 max-md:py-3"
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
                        <label className=" text-xl text-white">{t(translateAccount)}:</label>
                        <input
                            className="outline-none dark:bg-transparent dark:border dark:border-main-blue px-5 rounded-lg w-full py-4 max-md:py-3"
                            placeholder={t(placeholderAccount)}
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
        <Listbox.Button className={' w-[max-content] dark:text-white uppercase flex-nowrap items-center gap-2 py-1.5 flex max-md:text-xs text-main-dark-gray '}>
            {select && <Image width={50} height={50} className="w-5 h-5" alt="" src={`/valuta/${select}.svg`}/>}
            {(map as any)[select] != undefined? (map as any)[select] : select}
        </Listbox.Button>
        <Listbox.Options className={' flex flex-col  pb-2 top-full z-10 -right-5 rounded-b-xl absolute dark:bg-black/30 dark:bg-main-header dark:backdrop-blur-md bg-white'}>
            {arrayList.map((list,index) => (
            (select != list && list!=select1) && (
                <Listbox.Option className={`whitespace-nowrap ${arrayList.length-1 != index && "border-b"} dark:border-white/10 pl-5 pr-10 items-center gap-2 py-1.5 flex max-md:text-xs text-sm uppercase cursor-pointer text-main-dark-gray dark:text-white/80 dark:hover:text-white hover:text-black `} key={index+list} value={index}>
                    <Image width={50} height={50} className="w-5 h-5" alt="" src={`/valuta/${list}.svg`}/>
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