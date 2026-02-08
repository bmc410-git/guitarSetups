import { Routes } from '@angular/router';
import { SetupListComponent } from './setup/setup-list.component';
import { SetupFormComponent } from './setup/setup-form.component';

export const routes: Routes = [
	{ path: '', component: SetupListComponent },
	{ path: 'new', component: SetupFormComponent },
	{ path: 'setup/:id', component: SetupFormComponent },
	{ path: '**', redirectTo: '' }
];
