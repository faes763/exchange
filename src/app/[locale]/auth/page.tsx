'use client'
import { axiosCfg } from "@/core-axios";
import { useFormik } from "formik";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as Yup from "yup";



export default function Auth() {
    const [isRegister,set] = useState(false);

    return(
        <main>
            <div className=" gap-16 container flex flex-col items-center">
                <p className=" text-3xl text-center font-semibold">{isRegister ? "Регистрация" : "Авторизация"}</p>
                <Form isRegister={isRegister} setRegister={set}/>
            </div>
        </main>
    )
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });
const validationSchemaRegistration = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm Password is required'),
});



function Form({
    isRegister,
    setRegister
}: {
    isRegister: boolean;
    setRegister: Dispatch<SetStateAction<boolean>>;
}) {
    const router = useRouter();


    const formik = useFormik({
      initialValues: isRegister ? {
        email: "",
        password: "",
      } : {
        email: "",
        password: "",
        repeatPassword: "",
      },
      validationSchema:  isRegister ? validationSchemaRegistration : validationSchema,
      onSubmit: (values) => {
        console.log(values);
        const url = isRegister ? 'exchange/register' : '/exchange/auth';
        
        try {
            axiosCfg.post(url,values)
              .then((res)=>{
                localStorage.setItem('token',res.data.access_token);
                axiosCfg.interceptors.request.use(
                    config => {
                        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
                        return config;
                    },
                    error => {
                        return Promise.reject(error);
                    }
                );
                router.push("/profile")
                
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

    


    return(
        <form 
            onSubmit={formik.handleSubmit}
            className=" bg-main-gray md:min-w-[400px] max-md:py-8 max-md:px-4 py-16 px-8 rounded-2xl flex flex-col gap-4"
        >
            <div className="w-full space-y-2">
                <label className=" text-[#6A6A6A]" htmlFor="email">E-mail</label>
                <input
                    className={`w-full border outline-none border-main-blue  bg-transparent px-5 py-3 rounded-lg`}
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
            <div className="w-full space-y-2">
                <label className=" text-[#6A6A6A]" htmlFor="password">Пароль</label>
                <input
                    className={`w-full border outline-none bg-transparent border-main-blue px-5 py-3 rounded-lg`}
                    placeholder="Введите свой пароль"
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className=" text-red-600">{formik.errors.password}</div>
                ) : null}
            </div>
            {isRegister && (
            <div className="w-full space-y-2">
                <label className=" text-[#6A6A6A]" htmlFor="password">Повторите пароль</label>
                <input
                    className={`w-full border outline-none bg-transparent border-main-blue px-5 py-3 rounded-lg`}
                    placeholder="Введите пароль повторно"
                    id="repeatPassword"
                    name="repeatPassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.repeatPassword}
                />
                {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
                    <div className=" text-red-600">{formik.errors.repeatPassword}</div>
                ) : null}
            </div>
            )}
            <button 
                type="submit" 
                className=" bg-main-blue text-white text-center w-full py-3 rounded-lg "
            >
                Войти
            </button>
            <div onClick={()=>setRegister(prev=>!prev)} className="flex gap-1 max-md:flex-col items-center cursor-pointer justify-center text-sm">
                {isRegister ? "Уже зарегистрированы?" : " Еще не зарегистрированы? "}
                <p  className="  text-main-blue">{isRegister ? " Войти" : " Зарегистрироваться"}</p>
            </div>
        </form>
    )
}