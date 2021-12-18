import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPage } from './landing.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'showlist',
        loadChildren: () => import('../showlist/showlist.module').then(m => m.ShowlistPageModule)
      },
      {
        path: 'plus',
        loadChildren: () => import('../plus/plus.module').then(m => m.PlusPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
      },
      {
        path: 'profileedit',
        loadChildren: () => import('../profileedit/profileedit.module').then(m => m.ProfileeditPageModule)
      },
      {
        path: '',
        redirectTo: '/landing/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/landing/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
