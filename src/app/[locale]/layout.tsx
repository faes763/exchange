import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Nunito } from '@/styles/fonts';
import {useMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import { ReactNode } from 'react';
import {NextIntlClientProvider} from "next-intl"; 
import Script from 'next/script';

const locales = ['en', 'ru'];
 
// export function generateStaticParams() {
//     return locales.map((post) => ({
//         locale: post,
//     }));
//     // return locales.map((locale) => (params:{locale}));
// }


export default function LocaleLayout({children, params: {locale}}:{
    children: ReactNode,
    params: any
}) {
    // Validate that the incoming `locale` parameter is valid
    const isValidLocale = locales.some((cur) => cur === locale);
    if (!isValidLocale) notFound();
    //   const messages = await getMessages(locale);
    const messages = useMessages();

    return (
    <html className='' lang={locale}>
      <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-D7W8ESW1TX"></script>
          <script id='google-stat' dangerouslySetInnerHTML={{__html:`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-D7W8ESW1TX');`}}/>
      </head>
      <body className={`  ${Nunito.className}`}>
        <Script src="//code.jivo.ru/widget/sosOAdI1ha" async></Script>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header/>
          {children}
          <Footer/>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}