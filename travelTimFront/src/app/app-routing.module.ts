import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationComponent} from "./auth/authentication/authentication.component";
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./account-management/dashboard/dashboard.component";
import {AddOfferContainerComponent} from "./add-offer/add-offer-container/add-offer-container.component";
import {OffersContainerComponent} from "./offers/offers-container/offers-container.component";
import {OfferContainerComponent} from "./offer/offer-container/offer-container.component";
import {FilterOptionsComponent} from "./account-management/user-offers/filter-options/filter-options.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'authenticate',
    component: AuthenticationComponent
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'account',
    component: DashboardComponent
  },
  {
    path: 'offer/add',
    component: AddOfferContainerComponent
  },
  {
    path: 'offers',
    component: OffersContainerComponent
  },
  {
    path: 'offer',
    component: OfferContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
