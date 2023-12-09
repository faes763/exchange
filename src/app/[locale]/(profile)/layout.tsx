import { ReactNode } from "react"

export async function generateMetadata({ params }:{params:{locale:"ru"|"en"}}) {
    const title = params.locale =="ru" ? "Профиль": "Profile";
    return {
        title: title,
    }
}

export default function ProfileLayout({
    children,
  }: {
    children: ReactNode
}) {
    return children
}