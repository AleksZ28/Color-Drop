import { WhatsNewItem } from "@/types/types";

export const whatsNewData: WhatsNewItem[] = [
    {
        id: '1',
        title: 'Krople bomby 💣',
        description: 'Od teraz powyżej 200 punktów pojawiają się krople-bomby, które musisz neutralizować! Przewiń w bok, aby dowiedzieć się więcej.',
        image: require('@/assets/images/whatsnew_bomb0.png'),
    },
    {
        id: '2',
        title: 'Bomba standardowa',
        description: 'W przypadku bomby o standardowym kolorze, unikaj jej koloru.',
        image: require('@/assets/images/whatsnew_bomb1.png'),
    },
    {
        id: '3',
        title: 'Bomba zmieszana',
        description: 'W przypadku bomby o zmieszanych kolorach, unikaj kolorów, z których została zmieszana.',
        image: require('@/assets/images/whatsnew_bomb2.png'),
    }
];