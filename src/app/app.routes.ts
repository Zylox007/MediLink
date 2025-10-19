import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AccDashboard } from './dashboard/acc-dashboard/acc-dashboard';
import { Rdv } from './dashboard/rdv/rdv';
import { ListMed } from './dashboard/list-med/list-med';
import { Login } from './login/login';
import { PrendreRdv } from './dashboard/prendre-rdv/prendre-rdv';
import { ChatBot } from './dashboard/chat-bot/chat-bot';


export const routes: Routes = [
    {path:'dashboard/:idp',title:'Dashboard',component:Dashboard,children:[
        {path:'acc-dashboard',title:'Acc Dashboard',component:AccDashboard},
        {path:'rdv',title:'Rendez-vous',component:Rdv},
        {path:'list-med',title:'Liste des médecins',component:ListMed},
        {path:'prendre-rdv/:idm',title:'Prendre rendez-vous',component:PrendreRdv},
        {path:'chat-bot',title:'Chat Bot',component:ChatBot},
        {path:'',redirectTo:'acc-dashboard',pathMatch:'full'}
    ]},
    {path:'login',title:'Se connecter',component:Login},
    {path:'',redirectTo:'/login',pathMatch:'full'},
];
