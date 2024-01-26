'use client'
import { axiosCfg } from "@/core-axios";
import { useFormStore } from "@/store/form-popup-store";
import { LoadingButton } from "@/tags/buttons";
import { Sprite } from "@/tags/sprite";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

export function ExchangePopup() {
    const {isOpen,close,values,currencySent} = useFormStore();
    const t = useTranslations();

    const [isAgree,setAgree] = useState(false);
    const ref = useRef(false);

    const [load,setLoad] = useState(false);

    const router = useRouter();

    useEffect(()=>{
        if(isAgree) ref.current = true;
    },[isAgree])

    return(
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={close}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full space-y-5 max-w-md text-center transform overflow-hidden rounded-2xl bg-white px-6 py-8 md:py-10 align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h3"
                            className="text-h2 text-center font-bold  text-gray-900"
                        >
                            Правила
                        </Dialog.Title>
                        <div className="">
                            <p className="text-sm text-center text-gray-500">
                                {t("Внимательно проверяйте сумму")}
                            <br/>
                            <br/>
                                {t("В случае, если транзакция")}
                            </p>
                        </div>
                        <div className={clsx(
                            'flex items-center text-left justify-center text-sm gap-2 ',
                            !isAgree && ref.current && "text-red-600"
                        )}>
                            <div onClick={()=>setAgree(prev=>!prev)} className={`${isAgree ? "border-main-blue text-main-blue bg-white" : " text-white border-[rgba(209, 209, 214, 1)]"} transition-all border rounded`}>
                                <Sprite name="ver" className=" cursor-pointer w-4 h-4"/>
                            </div>
                            <span >
                                <span className={"cursor-pointer"} onClick={()=>setAgree(prev=>!prev)}>{t("Согласен с")}</span>
                                <Link 
                                    className={clsx(
                                        " text-main-blue",
                                    )} 
                                    href={'/policy'}
                                >
                                    {t("правилами обмена и политики AML")}
                                </Link>
                                </span>
                        </div>
                        <div className="mt-4">
                            {load ?
                                <LoadingButton
                                    btnClasses="flex justify-center uppercase bg-main-blue py-3 rounded-xl max-w-xs w-full text-white mx-auto  cursor-default"
                                    svgClasses="animate-spin w-7 h-7"
                                />
                            :  <button
                            type="button"
                            className={clsx(" text-white bg-main-blue py-4 rounded-xl max-w-xs w-full",
                            !isAgree && " !opacity-40 select-none")}
                            onClick={()=>{
                                if(isAgree && values) {
                                    setLoad(true);
                                    axiosCfg.get(`/exchange/ticket/create?currency=${values.send}&amountSent=${values.valueValuta}&telegramId=${values.telegram}${values.email ? `&email=${values.email}` : ""}&amountReceived=${values.receiver}&addressSent=${values.account}&currencySent=${currencySent}`).then((res:any)=>{
                                        close();
                                        router.push(`/request/${res.data.id}/${values.send}`);
                                    })
                                    .catch((error)=>{
                                        console.error(error);
                                        alert("Произошла ошибка... \n попробуйте позже");
                                    }) 
                                    .finally(()=>{
                                        setLoad(false);
                                    });
                                } else {
                                    ref.current = true;
                                }
                            }}
                        >
                            Продолжить
                        </button>}
                           
                        </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
      </Transition>
        
        </>
    )
}