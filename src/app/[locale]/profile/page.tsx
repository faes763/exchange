'use client'
import { axiosCfg } from "@/core-axios";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as Yup from "yup";




export default function Profile() {
    return(
       
        <div className="space-y-8">
            <p className=" text-3xl font-bold">Профиль</p>
            <Form/>
        </div>

    )
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address"),
    telegram: Yup.string(),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters"),
    repeatPassword: Yup.string()
      .test('password-match', 'Passwords must match', function (value) {
        const password = this.parent.password;
        if (password) {
          return value === password;
        }
        return true;
      })
      .when('password', (password, schema) => {
        return password ? schema.required('Repeat password is required when password is set') : schema;
      })
  });
function Form({
    borderStyle = "focus:border-black",
    buttonStyle = "bg-main-purple text-white",
}:{
    borderStyle?: string,
    buttonStyle?: string,
   
}) {
    const router = useRouter();
    const formik = useFormik({
      initialValues: {
        telegram: "",
        email: "",
        password: "",
        repeatPassword: ""
      },
      validationSchema:  validationSchema,
      onSubmit: (values) => {
        console.log(values);
        try {
            axiosCfg.get(`exchange/user/change?telegramId=${values.telegram}&password=${values.password}&email=${values.email}`)
              .then((res)=>{
                console.log(res);
                // router.push('/successfully');
              })
            .catch(error=>{
                console.error(error);
                alert("Произошла ошибка... \nПопробуйте позже")
            })
        } catch (error) {
            console.error(error);
            alert("Произошла ошибка... \n попробуйте позже")
        }
      },
    });

    useEffect(()=>{
        if(localStorage.getItem('token')) {
            axiosCfg.interceptors.request.use(
                config => {
                    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
                    return config;
                },
                error => {
                    return Promise.reject(error);
                }
            );
            axiosCfg('exchange/user/info').then(res=>{
                console.log(res);
                formik.setFieldValue("email",res.data?.email);
                formik.setFieldValue("telegram",res.data?.telegram || "");
                // setShow(true);
            }).catch((error)=>{
                console.log(error);
                router.push('/auth');
            });
        } else {
            router.push('/auth');
        }
    },[]);

    const t = useTranslations();
    return(
        <form
            onSubmit={formik.handleSubmit}
            className=" bg-main-gray p-10  max-md:p-5 max-md:grid-cols-1 rounded-2xl grid grid-cols-2 justify-items-center items-end gap-10"
        >
            <div className="w-full space-y-2">
                <label className=" text-[#6A6A6A]" htmlFor="email">E-mail</label>
                <input
                    className={`w-full border  bg-transparent outline-none border-main-blue px-5 py-3 rounded-lg`}
                    placeholder="E-mail"
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
            <div className="w-full relative space-y-2">
                <label  className=" text-[#6A6A6A]" htmlFor="password">{t("Введите новый пароль")}</label>
                <input
                    className={`w-full border  bg-transparent outline-none border-main-blue px-5 py-3 rounded-lg`}
                    placeholder={t("Введите новый пароль")}
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className=" absolute text-red-600">{formik.errors.password}</div>
                ) : null}
            </div>
            <div className="w-full space-y-2">
                <label  className=" text-[#6A6A6A]" htmlFor="telegram">Telegram</label>
                <input
                   className={`w-full border  bg-transparent outline-none border-main-blue px-5 py-3 rounded-lg`}
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
            <div className="w-full relative space-y-2">
                <label  className=" text-[#6A6A6A]" htmlFor="repeatPassword">{t("Повторите пароль")}</label>
                <input
                    className={`w-full border  bg-transparent outline-none border-main-blue px-5 py-3 rounded-lg`}
                    placeholder={t("Повторите пароль")}
                    id="repeatPassword"
                    name="repeatPassword"
                    type="password"
                    disabled={formik.values.password.length<0}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.repeatPassword}
                />
                {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
                    <div className=" absolute text-red-600">{formik.errors.repeatPassword}</div>
                ) : null}
            </div>
            <button 
                type="submit"
                className=" bg-main-blue text-white text-center w-full py-3 rounded-lg md:col-span-2"
            >
                {t("Сохранить")}
            </button>
        </form>
    )
}
