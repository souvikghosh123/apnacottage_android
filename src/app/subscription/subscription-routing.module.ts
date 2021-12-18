import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionPage } from './subscription.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPage,
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
        path: '',
        redirectTo: '/subscription',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/subscription',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPageRoutingModule {}
