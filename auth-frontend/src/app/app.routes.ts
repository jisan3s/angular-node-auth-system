import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { VerifyCode } from './components/verify-code/verify-code';
import { ResetPassword } from './components/reset-password/reset-password';

export const routes: Routes = [
    { path: '', component: Dashboard, canActivate: [authGuard] },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'verify-code', component: VerifyCode },
    { path: 'reset-password', component: ResetPassword },
    { path: '**', redirectTo: '' },
];