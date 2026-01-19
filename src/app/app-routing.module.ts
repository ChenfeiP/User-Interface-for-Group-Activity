import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'users', component: UsersComponent},
  {path:'timeline', component: TimelineComponent},
  {path:'**', redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
