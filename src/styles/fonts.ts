import localFont from 'next/font/local';
export const futura = localFont({
    src: [
        {
            path: '../../public/fonts/afuturaround.ttf',
            weight: '500',
        },
        {
            path: '../../public/fonts/afuturaroundbold.ttf',
            weight: '800',
        },
    ],
});

export const Nunito = localFont({
    src: [
        {
            path: '../../public/fonts/NunitoSans_7pt_Condensed-Regular.ttf',
            weight: '600',
        },
        {
            path: '../../public/fonts/NunitoSans_7pt_Condensed-Medium.ttf',
            weight: '600',
        },
        {
            path: '../../public/fonts/NunitoSans_7pt_Condensed-SemiBold.ttf',
            weight: '700',
        },
        {
            path: '../../public/fonts/NunitoSans_7pt_Expanded-Bold.ttf',
            weight: '800',
        },
    ],
});