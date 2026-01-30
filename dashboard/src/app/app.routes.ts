import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'weekly',
        loadComponent: () => import('./weekly/weekly').then(m => m.Weekly)
    },
    {
        path: 'all',
        loadComponent: () => import('./all/all').then(m => m.All)
    }
];

// Export for module federation
export { routes as remoteRoutes };
