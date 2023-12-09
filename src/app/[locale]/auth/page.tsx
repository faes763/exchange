import {Auth} from "@/components/pages/auth";

export async function generateMetadata({ params }:{params:{locale:"ru"|"en"}}) {
    const title = params.locale =="ru" ? "Авторизация": "Authorization";
    return {
        title: title,
    }
}

export default function AuthPage() {
    return <Auth/>
}