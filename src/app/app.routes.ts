import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { UpdateUserComponent } from './components/user/update-user/update-user.component';
import { GetUserComponent } from './components/user/get-user/get-user.component';
import { UserVideogameComponent } from './components/user/user-videogame/user-videogame.component';
import { VideogameHomeComponent } from './components/videogame/videogame-home/videogame-home.component';
import { UpdateVideogameComponent } from './components/videogame/update-videogame/update-videogame.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        children: [{ path: "login", component: LoginComponent }, { path: "", component: AboutUsComponent }]
    },
    {
        path: "userHome/:userId",
        component: UserHomeComponent,
        children: [
            { path: "update", component: UpdateUserComponent },
            { path: "get", component: GetUserComponent },
            { path: "", component: UserVideogameComponent, },
            {
                path: "videogame",
                component: VideogameHomeComponent,
                children: [
                    { path: "update", component: UpdateVideogameComponent }
                ]
            },
        ]
    }
];
