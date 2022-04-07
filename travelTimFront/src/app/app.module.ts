import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationComponent } from './auth/authentication/authentication.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import {AuthInterceptorProvider} from "./services/authentication/authentication.interceptor";
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import {ImageCarouselComponent} from "./image-carousel/image-carousel.component";
import { MapComponent } from './map/map.component';
import { DashboardComponent } from './account-management/dashboard/dashboard.component';
import { ReservationsComponent } from './account-management/reservations/reservations.component';
import { FavouritesComponent } from './account-management/favourites/favourites.component';
import { ReviewsComponent } from './account-management/reviews/reviews.component';
import { UserInformationComponent } from './account-management/account/user-information/user-information.component';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { UserBusinessesComponent } from './account-management/account/user-businesses/user-businesses.component';
import { AddBusinessComponent } from './account-management/account/add-business/add-business.component';
import { BusinessDetailsComponent } from './account-management/account/business-details/business-details.component';
import { EditBusinessComponent } from './account-management/account/edit-business/edit-business.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddOfferContainerComponent } from './add-offer/add-offer-container/add-offer-container.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AddOfferCategoriesSection } from './add-offer/add-offer-categories-section/add-offer-categories-section';
import { AddLodgingOfferFormComponent } from './add-offer/add-lodging-offer-form/add-lodging-form.component';
import { AddFoodOfferFormComponent } from './add-offer/add-food-offer-form/add-food-offer-form.component';
import { AddAttractionsOfferFormComponent } from './add-offer/add-attractions-offer-form/add-attractions-offer-form.component';
import { AddActivitiesOfferFormComponent } from './add-offer/add-activities-offer-form/add-activities-offer-form.component';
import { AccountContainerComponent } from './account-management/account/account-container/account-container.component';
import { AddOfferContactSection } from './add-offer/add-offer-contact-section/add-offer-contact-section';
import { AddOfferImagesSection } from "./add-offer/add-offer-images-section/add-offer-images-section";
import {UserOffersComponent} from "./account-management/user-offers/user-offers.component";
import { OffersContainerComponent } from './offers/offers-container/offers-container.component';
import { OfferRecommendationsComponent } from './offers/offer-recommendations/offer-recommendations.component';
import {NgxPaginationModule} from "ngx-pagination";
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LegalLodgingOfferDetailsComponent } from './offer/legal-lodging-offer-details/legal-lodging-offer-details.component';
import { OfferContainerComponent } from './offer/offer-container/offer-container.component';
import { LegalLodgingOffersComponent } from './offer/legal-lodging-offers/legal-lodging-offers.component';
import { FoodOfferMenuComponent } from './offer/food-offer-menu/food-offer-menu.component';
import { OfferTicketsComponent } from './offer/offer-tickets/offer-tickets.component';
import { PhysicalLodgingOfferDetailsComponent } from './offer/physical-lodging-offer-details/physical-lodging-offer-details.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    ImageCarouselComponent,
    MapComponent,
    DashboardComponent,
    ReservationsComponent,
    UserOffersComponent,
    FavouritesComponent,
    ReviewsComponent,
    UserInformationComponent,
    UserBusinessesComponent,
    AddBusinessComponent,
    BusinessDetailsComponent,
    EditBusinessComponent,
    AddOfferContainerComponent,
    AddOfferCategoriesSection,
    AddLodgingOfferFormComponent,
    AddFoodOfferFormComponent,
    AddAttractionsOfferFormComponent,
    AddActivitiesOfferFormComponent,
    AccountContainerComponent,
    AddOfferImagesSection,
    AddOfferContactSection,
    OffersContainerComponent,
    OfferRecommendationsComponent,
    LegalLodgingOfferDetailsComponent,
    OfferContainerComponent,
    LegalLodgingOffersComponent,
    FoodOfferMenuComponent,
    OfferTicketsComponent,
    PhysicalLodgingOfferDetailsComponent,
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      NgbModule,
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatFormFieldModule,
      MatSelectModule,
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatRadioModule,
      MatCardModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatGridListModule,
      HttpClientModule,
      MatDialogModule,
      MatIconModule,
      MatMenuModule,
      InputTextareaModule,
      ButtonModule,
      MatToolbarModule,
      MdbCarouselModule,
      MatCheckboxModule,
      FontAwesomeModule,
      GooglePlaceModule,
      NgxPaginationModule,
      IvyCarouselModule,
      NgImageFullscreenViewModule,
      MatProgressSpinnerModule
    ],
  providers: [AuthInterceptorProvider,  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
