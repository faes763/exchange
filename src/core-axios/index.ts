import axios from "axios";
export const axiosCfg = axios.create({
    baseURL: process.env.BASE_URL_MONITORING,
});

export const fetcherFetchMonitoring = (url: string) => fetch(process.env.BASE_URL_MONITORING + url,{
    next: {
        revalidate: 300,
    }
}).then((res) => {
    if(res.ok) {
        return res.json();
    } else {
        return false;
    }
}).catch((error)=>{
    console.error(error);
    return false;
})

export const fetcherFetch = (url: string) => fetch(process.env.BASE_URL + url,{
    next: {
        revalidate: 300,
    }
}).then((res) => {
    if(res.ok) {
        return res.json();
    } else {
        return false;
    }
}).catch((error)=>{
    console.error(error);
    return false;
}) // для ssr компонентов