'use client'
import { Listbox, Tab } from "@headlessui/react";
import clsx from "clsx";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
    const t = useTranslations();
    const locale = useLocale() as "en" | "ru";
    
    return (
        <div>
            <Tab.Group>
                <Tab.List className={' flex justify-center gap-3'}>
                    {tabLists[locale].map((list: string, index: number) => (
                        <Tab
                            className={({ selected }) =>
                                clsx(
                                    selected ? " bg-main-blue text-white" : " text-black border border-main-blue",
                                    " px-10 py-3 rounded-xl font-semibold tracking-wide"
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

    const validationSchema = Yup.object().shape({
        telegram: Yup.string().required(t("Введите логин телеграма")),
        email: Yup.string().email(t("Введите свой e-mail")).required(t("Введите свой e-mail")),
        currentValuta: Yup.string().required(t("Выберите валюту")),
        valueValuta: Yup.number().required(t("Введите число")).min(state.minValue,`${t("Минимальное число")}: ${state.minValue}`).max(state.maxValue,`${t("Максимальное число")}: ${state.maxValue}`),
        currentFiatValuta: Yup.string().required(t("Выберите валюту")),
        account: Yup.string().required(t("Счёт получения"))
    });
    const formik = useFormik({
      initialValues: {
        telegram: "",
        email: "",
        currentValuta: "",
        valueValuta: 1,
        currentFiatValuta: "",
        account: ""
      },
      validationSchema:  validationSchema,
      onSubmit: async (values) => {
        try {
            

            axiosCfg.get(`/exchange/ticket/create?currency=${values.currentValuta}&amountSent=${state.convertedValue}&telegramId=${values.telegram}&email=${values.email}&amountReceived=${values.valueValuta}&addressSent=${values.account}&currencySent=${selectedFiatValuta[selectedFiatValuteIndex]}`).then((res:any)=>{
                router.push(`/request/${res.data.id}/${values.currentValuta}`)
            })
        } catch (error) {
            console.error(error);
            alert("Произошла ошибка... \n попробуйте позже")
        }
      },
    });

    const [selectedValuta, setSelectedValutas] = useState<string[]>([""]);
    const [selectedValuteIndex,setSelectedValutaIndex] = useState<number>(0);

    const [selectedFiatValuta, setSelectedFiatValutas] = useState<string[]>([""]);
    const [selectedFiatValuteIndex,setSelectedFiatValutasIndex] = useState<number>(0);

    useEffect(()=>{
        formik.setFieldValue('currentValuta',selectedValuta[selectedValuteIndex]);
        formik.setFieldValue('currentFiatValuta',selectedFiatValuta[selectedFiatValuteIndex]);

        fetcherFetch(`course/?from=${selectedValuta[selectedValuteIndex] || "BTC"}&to=${selectedFiatValuta[selectedFiatValuteIndex] || "USDTTRC20"}&amount=${formik.values.valueValuta}`).then((res:courseType)=>{
            setState(res);
        });
    },[selectedFiatValuteIndex,selectedValuteIndex,selectedValuta,formik.values.valueValuta]);
    
    useEffect(()=>{
        fetcherFetch('assets?flag=true').then((res:string[])=>{
            setSelectedValutas(res);
        });
        fetcherFetch('assets?flag=false').then((res:string[])=>{
            setSelectedFiatValutas(res?.reverse());
            res.find((vault,index)=>{
                if(vault == "USDTTRC20") {
                    setSelectedFiatValutasIndex(index);
                }
            });
        });
    },[]);

    function numbFixed(el:string) {
        if(["TCSBQRUB","CASHRUB2","CASHRUB"].includes(el)) return 0;
        if(["SBERRUB","SBPRUB"].includes(el)) return 2;
        if(["DAI","XMR","DOGE","LTC","USDTERC20","USDTTRC20","ETH","BTC"].includes(el)) return 5;
    }
    
    return (
      <form
            className="grid gap-5 max-md:flex flex-col grid-cols-[repeat(2,minmax(0,1fr))]"
            onSubmit={formik.handleSubmit}
        >
            <div className=" flex justify-between flex-col gap-5">
                <div className=" py-10 max-md:px-5 max-md:py-10 space-y-5 bg-main-blue rounded-2xl px-10">
                    <label className=" text-xl text-white">{t('Отдаете')}</label>
                    <div className="bg-white rounded-lg items-center flex px-5 gap-5 justify-between relative">
                        <input
                            className="outline-none w-full py-4 max-md:py-3"
                            placeholder="Введите число"
                            id="valueValuta"
                            name="valueValuta"
                            type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.valueValuta}
                        />
                        <div className="  relative">
                            <List name="currentValuta" select1={selectedFiatValuta[selectedFiatValuteIndex]} select={selectedValuta[selectedValuteIndex]} setSelect={setSelectedValutaIndex} arrayList={selectedValuta || []}/>
                        </div>                        
                    </div>
                    {formik.touched.valueValuta && formik.errors.valueValuta ? (
                        <div className="  text-right text-red-600">{formik.errors.valueValuta}</div>
                    ) : null}
                    {formik.touched.currentValuta && formik.errors.currentValuta ? (
                        <div className="text-right text-red-600">{formik.errors.currentValuta}</div>
                    ) : null}
                    {state && state.oneValue>0 && (
                    <div className="text-white md:text-lg">
                        <p>1 {selectedValuta[selectedValuteIndex]} = {+(state?.oneValue).toFixed(numbFixed(selectedFiatValuta[selectedFiatValuteIndex]))} {selectedFiatValuta[selectedFiatValuteIndex].toLowerCase().includes('run') ? "RUB" : selectedFiatValuta[selectedFiatValuteIndex]} </p>
                        <p>Минимальная сумма обмена от {Number(state?.minValue).toFixed(numbFixed(selectedValuta[selectedValuteIndex]))} {selectedValuta[selectedValuteIndex]}</p>
                     </div>
                    )}
                </div>
                <div className=" p-10 max-md:p-5 space-y-2  bg-main-blue rounded-2xl">
                    <p className=" text-white  text-xl">{t('Получайте')}:</p>
                    <div className="bg-white py-4 max-md:py-3 rounded-lg items-center flex px-5 gap-5 justify-between relative">
                        <p className="">{Number(state?.convertedValue)?.toFixed(numbFixed(selectedFiatValuta[selectedFiatValuteIndex]))}</p>
                        <div className="  relative">
                            <List name="currentFiatValuta" select1={selectedValuta[selectedValuteIndex]} select={selectedFiatValuta[selectedFiatValuteIndex]} setSelect={setSelectedFiatValutasIndex} arrayList={selectedFiatValuta || []}/>
                        </div>                        
                    </div>
                    {formik.touched.currentFiatValuta && formik.errors.currentFiatValuta ? (
                        <div className="text-right text-red-600">{formik.errors.currentFiatValuta}</div>
                    ) : null}
                </div>
                
                <div className="bg-white max-md:px-5 flex gap-5 py-4 border rounded-2xl border-main-blue px-10">
                    <Image width={40} height={40} alt="Предупреждаем!" src={'/images/informate.svg'}/>
                    <p className="max-md:text-xs font-semibold text-sm">{t("Связь")}</p>
                </div>
            </div>
            <div className="h-full flex flex-col gap-5">
                <div className=" h-full flex flex-col p-10 max-md:p-5 justify-center gap-10 rounded-2xl bg-main-blue">
                    <div  className=" space-y-2">
                        <label className=" text-xl text-white">E-mail</label>
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
                        {formik.touched.email && formik.errors.email ? (
                            <div className=" text-red-600">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div className=" space-y-2">
                        <label className=" text-xl text-white">{t("Логин в телеграме")}</label>
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
                        {formik.touched.telegram && formik.errors.telegram ? (
                            <div className=" text-red-600">{formik.errors.telegram}</div>
                        ) : null}
                    </div>
                    <div className=" space-y-2">
                        <label className=" text-xl text-white">{t("Счёт получения")}</label>
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
                        {formik.touched.account && formik.errors.account ? (
                            <div className=" text-red-600">{formik.errors.account}</div>
                        ) : null}
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
    return(
    <Listbox
        name={name}
        value={0}
        onChange={setSelect}
    >
        <Listbox.Button className={' uppercase max-md:text-sm text-main-dark-gray whitespace-nowrap'}>{select}</Listbox.Button>
        <Listbox.Options className={' flex flex-col gap-2 px-5 top-7 z-10 -right-5 rounded-b-xl absolute bg-white'}>
          {arrayList.map((list,index) => (
            (select != list && list!=select1) &&(
                <Listbox.Option className={'whitespace-nowrap max-md:text-sm uppercase cursor-pointer text-main-dark-gray hover:text-black '} key={index+list} value={index}>
                {list}
                </Listbox.Option>
            )))}
        </Listbox.Options>
      </Listbox>
    )
}