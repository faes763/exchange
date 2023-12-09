import { Policy } from "@/components/pages/policy";

export async function generateMetadata({ params }:{params:{locale:"ru"|"en"}}) {
    const title = params.locale =="ru" ? "Правила": "Rules";
    return {
        title: title,
    }
  }

export default function PolicyPage() {
    return <Policy/>
}