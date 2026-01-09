export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

export interface WhatsNewItem {
    id: string;
    title: string;
    description: string;
    image: any;
}