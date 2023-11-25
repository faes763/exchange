import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react"

type LoadingButtonTypeProps = {
    btnClasses?: string,
    svgClasses?: string
}
export function LoadingButton({btnClasses = '', svgClasses = ''}: LoadingButtonTypeProps) {
    return (
        <button className={btnClasses}>
            <svg className={svgClasses} width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C17.595 28 19.1127 27.6899 20.4996 27.1285C21.5234 26.714 22.6894 27.208 23.1039 28.2319C23.5183 29.2558 23.0243 30.4218 22.0004 30.8362C20.1448 31.5874 18.1181 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 17.1046 31.1046 18 30 18C28.8954 18 28 17.1046 28 16C28 9.37258 22.6274 4 16 4Z"></path></svg>
        </button>
    )
}

interface test extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
} 


export function Button({
    children,
    ...props
}: test) {
    return(
        <button title={`${props.title || children}`} {...props}> 
            {children}
        </button>
    )
}