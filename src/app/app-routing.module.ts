import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then( m => m.ContactPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'forgetpassword',
    loadChildren: () => import('./forgetpassword/forgetpassword.module').then( m => m.ForgetpasswordPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then( m => m.SubscriptionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mysubscription',
    loadChildren: () => import('./mysubscription/mysubscription.module').then( m => m.MysubscriptionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./wishlist/wishlist.module').then( m => m.WishlistPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'myproperty',
    loadChildren: () => import('./myproperty/myproperty.module').then( m => m.MypropertyPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'showlist',
    loadChildren: () => import('./showlist/showlist.module').then( m => m.ShowlistPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'plus',
    loadChildren: () => import('./plus/plus.module').then( m => m.PlusPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profileedit',
    loadChildren: () => import('./profileedit/profileedit.module').then( m => m.ProfileeditPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    loadChildren: () => import('./logout/logout.module').then( m => m.LogoutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'property/:propertyID',
    loadChildren: () => import('./property/property.module').then( m => m.PropertyPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contactproperty',
    loadChildren: () => import('./contactproperty/contactproperty.module').then( m => m.ContactpropertyPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contactpropertydetails/:propertyID',
    loadChildren: () => import('./contactpropertydetails/contactpropertydetails.module').then( m => m.ContactpropertydetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mypropertyview/:propertyID',
    loadChildren: () => import('./mypropertyview/mypropertyview.module').then( m => m.MypropertyviewPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mypropertyedit/:propertyID',
    loadChildren: () => import('./mypropertyedit/mypropertyedit.module').then( m => m.MypropertyeditPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contactprofile/:propertyID',
    loadChildren: () => import('./contactprofile/contactprofile.module').then( m => m.ContactprofilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
