import { Confirm } from "@/components/pages/confirm";

export async function generateMetadata({ params }:{params:{locale:"ru"|"en"}}) {
    const title = params.locale =="ru" ? "Авторизация": "Authorization";
    return {
        title: title,
    }
  }

export default function ConfirmPage({searchParams}:{searchParams:{email:string}}) {
    return <Confirm searchParams={searchParams}/>
}