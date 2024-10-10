import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { StartComponent } from './components/start/start.component';
import { GameComponent } from './components/game/game.component';
import { PlayComponent } from './components/play/play.component';

export const routes: Routes = [
    {
        path: 'chat/:userID',
        component: ChatComponent
    },
    {
        path: '',
        component: StartComponent
    },
    {    
        path: 'game/:roomID',
        component: GameComponent
    },
    {    
        path: 'prueba',
        component: PlayComponent
    }

];
