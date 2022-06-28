import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationComponent} from "./auth/authentication/authentication.component";
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./account-management/dashboard/dashboard.component";
import {AddOfferContainerComponent} from "./add-offer/add-offer-container/add-offer-container.component";
import {OffersContainerComponent} from "./offers/offers-container/offers-container.component";
import {OfferContainerComponent} from "./offer/offer-container/offer-container.component";
import {EditLodgingOfferFormComponent} from "./edit-offer/edit-lodging-offer/edit-lodging-offer-form.component";
import {EditFoodOfferComponent} from "./edit-offer/edit-food-offer/edit-food-offer.component";
import {EditAttractionOfferComponent} from "./edit-offer/edit-attraction-offer/edit-attraction-offer.component";
import {EditActivityOfferComponent} from "./edit-offer/edit-activity-offer/edit-activity-offer.component";
import {BusinessOffersComponent} from "./business/business-offers/business-offers.component";
import {UserProviderOffersComponent} from "./user-provider-offers/user-provider-offers.component";
import {OfferRecommendationsComponent} from "./offers/offer-recommendations/offer-recommendations.component";
import {WeatherWidgetComponent} from "./weather-widget/weather-widget.component";

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
    path: 'offer/lodging/edit',
    component: EditLodgingOfferFormComponent
  },
  {
    path: 'offer/food/edit',
    component: EditFoodOfferComponent
  },
  {
    path: 'offer/attraction/edit',
    component: EditAttractionOfferComponent
  },
  {
    path: 'offer/activity/edit',
    component: EditActivityOfferComponent
  },
  {
    path: 'offers',
    component: OffersContainerComponent
  },
  {
    path: 'offers/recommendations',
    component: OfferRecommendationsComponent
  },
  {
    path: 'offer',
    component: OfferContainerComponent
  },
  {
    path: 'offers/business',
    component: BusinessOffersComponent
  },
  {
    path: 'offers/user',
    component: UserProviderOffersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
