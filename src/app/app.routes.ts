import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        children:[{path: "login", component: LoginComponent},{path:"", component:AboutUsComponent}]
    },
    { path: "userHome/:userId", component: UserHomeComponent }
];
