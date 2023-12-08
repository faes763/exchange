import { string } from 'yup';
import { create } from 'zustand'

interface formType {
    telegram: string;
    email: string;
    send: string;
    valueValuta: number;
    receiver: string;
    account: string;
    received: number;
}

interface formStoreType {
    values: formType | null;
    set: (currentName:formType) => void;
    isOpen:boolean;
    open: ()=>any;
    close: ()=>any;
    currencySent: string;
    setSent: (newSent:string)=>any;
}

export const useFormStore = create<formStoreType>((set) => ({
    values: null,
    set: (currentName:formType)=> set({values:currentName}),
    isOpen: false,
    open: ()=>set({isOpen:true}),
    close: () => set({isOpen:false}),
    currencySent: "",
    setSent: (newSent:string)=>set({currencySent:newSent})
}))