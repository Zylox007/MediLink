import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AccDashboard } from './dashboard/acc-dashboard/acc-dashboard';
import { Rdv } from './dashboard/rdv/rdv';
import { ListMed } from './dashboard/list-med/list-med';

export const routes: Routes = [
    {path:'dashboard',title:'Dashboard',component:Dashboard,children:[
        {path:'acc-dashboard',title:'Acc Dashboard',component:AccDashboard},
        {path:'rdv',title:'Rendez-vous',component:Rdv},
        {path:'list-med',title:'Liste des médecins',component:ListMed},
        {path:'',redirectTo:'acc-dashboard',pathMatch:'full'}
    ]},
    {path:'',redirectTo:'/dashboard',pathMatch:'full'},
];
