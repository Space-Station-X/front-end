import { Routes } from '@angular/router';
import { HomeComponent } from './components/principal/home/home.component';
import { LoginComponent } from './components/principal/login/login.component';
import { AboutUsComponent } from './components/principal/about-us/about-us.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { GetUserComponent } from './components/user/get-user/get-user.component';
import { UpdateVideogameComponent } from './components/videogame/update-videogame/update-videogame.component';
import { UserNavbarComponent } from './components/user/user-navbar/user-navbar.component';
import { GetVideogameComponent } from './components/videogame/get-videogame/get-videogame.component';
import { CreateVideogameComponent } from './components/videogame/create-videogame/create-videogame.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        children: [{ path: "login", component: LoginComponent }, { path: "", component: AboutUsComponent }]
    },
    {
        path: "userHome/:userId",
        component: UserNavbarComponent,
        canActivate : [authGuard],
        children: [
            { path: "", component: UserHomeComponent },
            { path: "update", component: UpdateUserComponent },
            { path: "get", component: GetUserComponent },
            { path: "videogame/:id",component: GetVideogameComponent},
            { path: "updateVideogame/:id", component: UpdateVideogameComponent },
            { path: "createVideogame" , component: CreateVideogameComponent}
        ]
    }
];
