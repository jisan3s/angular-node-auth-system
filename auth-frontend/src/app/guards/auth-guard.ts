import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../services/auth';

// This guard protects routes that require authentication
export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth); // inject Auth service
    const router = inject(Router); // inject Router
    const platformId = inject(PLATFORM_ID);

    // Skip check on server-side to prevent incorrect redirects during SSR
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    // Check if token exists
    const token = auth.getToken();
    if (!token) {
        // If no token, redirect user to login page
        router.navigate(['/login']);
        return false;
    }

    // Allow access if token exists
    return true;
};