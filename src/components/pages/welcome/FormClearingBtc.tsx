'use client';
import React, {useState} from 'react';
import {Modal} from "react-bootstrap";
import Image from "next/image";
import {QRCodeCanvas} from "qrcode.react";
import {toast} from 'react-toastify';
import {useTranslations} from "next-intl";


const FormClearingBtc = () => {
    const [show, setShow] = useState(false);
    const [addressForwad, setAddressForwad] = useState("");
    const [addressForwad2, setAddressForwad2] = useState("");
    const [dataMixer, setDataMixer] = useState({} as any);
    const [addressBitcoin, setAddressBitcoin] = useState("");
    const [addressQR, setAddressQR] = useState("");
    const [licence, setLicence] = useState("");
    const t = useTranslations('Index');


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChangeAddressForwad = (e: any) => {
        setAddressForwad(e.target.value);
    }
    const handleChangeAddressForwad2 = (e: any) => {
        setAddressForwad2(e.target.value);
    }
    const sendMixerRequest = async (e: any) => {
        const forward_addr = addressForwad
        const forward_addr2 = addressForwad2
        const token = (await (await fetch("https://stuart.exchange/api/token")).json()).token;
        const res = await (await fetch("https://stuart.exchange/api/mix", {
            method: "POST",
            body: JSON.stringify({
                token, forward_addr, forward_addr2
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })).json();

        if (res.error) {
            toast(res.error);
            console.log(res.error);
            return
        }


        setDataMixer(res)
        setAddressBitcoin(res.address)
        setAddressQR(res.address)
        setLicence(res.guarantee)
        handleShow()

        console.log(licence)
    }
    return (
        <>

            <form className="item mixer d-block" data-tab="2">
                <div className="item_a span2-r">
                    <div className="field-block">
                        <div className="name_h1">{t('cleanBitcoinsTitle')}</div>
                        <div className="name">{t('receiveFundsAddress')}</div>
                        <div className="field">
                            <input onChange={handleChangeAddressForwad} type="text"
                                   placeholder={t('receiveFundsPlaceholder')}
                                   name="address_get" className='outline-none w-full py-4 px-5 rounded-lg'/>
                        </div>
                    </div>
                    <div className="field-block">
                        <div className="name">{t('additionalAddress')}</div>
                        <div className="field">
                            <input onChange={handleChangeAddressForwad2} type="text"
                                   placeholder={t('additionalAddressPlaceholder')}
                                   name="address_add" className="no-r outline-none w-full py-4 px-5 rounded-lg"/>
                        </div>
                    </div>
                </div>
                <div className="btn-block mt-4 ">
                    <div className="btn checkField" onClick={sendMixerRequest}
                         data-type="mixer_request">{t('cleanBtcButton')}</div>
                </div>
            </form>

            <Modal show={show} onHide={handleClose}>
                <div className='modal fade show d-block' id="infoModal" tabIndex={-1}
                     aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="logo"><Image width={100} height={100} src="/img/logo-center.svg"
                                                             alt="logo"/></div>
                            </div>
                            <div className="modal-body">
                                <div className="d-block pt-lg-3 bg-white">
                                    <div className="d-flex">
                                        <QRCodeCanvas size={192} bgColor="#FFFFFF" className="mx-auto"
                                                      value={addressQR}/>
                                    </div>
                                </div>
                                <div className="desc">
                                    {t('sendBitcoinDesc1')} <br/>
                                    {t('sendBitcoinDesc2')}<br/><br/>
                                    <p>{addressBitcoin}</p>
                                </div>
                                <div className="btn-block">
                                    <a download="letter.txt" href={"data:text/plain;charset=utf-8," + licence}
                                       className="btn btnBlack btnWhite">{t('warrantyLetter')}</a>
                                    <div className="btn btnBlack" onClick={handleClose}
                                         data-bs-dismiss="modal">{t('repeatCleaningButton')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default FormClearingBtc;
