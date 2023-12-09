import { ReactNode } from "react"

export async function generateMetadata({ params }:{params:{locale:"ru"|"en"}}) {
    const title = params.locale =="ru" ? "Заявка обмена": "Exchange request";
    return {
        title: title,
    }
}

export default function RequestLayout({
    children,
  }: {
    children: ReactNode
}) {
    return children
}