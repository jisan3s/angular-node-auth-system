import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Auth {

    // inject HttpClient and Router using Angular 21 inject() method
    private http = inject(HttpClient);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);

    // Backend API URL
    private apiURL = 'http://localhost:5001/api/auth';

    // BehaviorSubject to track authentication status
    private authStatus = new BehaviorSubject<boolean>(this.hasToken());

    // Check if JWT token exists in localStorage
    private hasToken(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            return !!localStorage.getItem('token');
        }
        return false;
    }

    // Register a new user
    register(user: { name: string; email: string; password: string }) {
        return this.http.post<{ _id: string; token: string }>(`${this.apiURL}/register`, user)
            .pipe(
                // Save token to localStorage on successful registration
                tap(res => this.setSession(res.token, res._id))
            );
    }

    // Login user
    login(user: { email: string; password: string }) {
        return this.http.post<{ _id: string; token: string }>(`${this.apiURL}/login`, user)
            .pipe(
                // Save token to localStorage on successful login
                tap(res => this.setSession(res.token, res._id))
            );
    }

    // Forgot Password
    forgotPassword(email: string) {
        return this.http.post<{ message: string }>(`${this.apiURL}/forgot-password`, { email });
    }

    // Verify Code
    verifyCode(email: string, code: string) {
        return this.http.post<{ message: string }>(`${this.apiURL}/verify-code`, { email, code });
    }

    // Reset Password
    resetPassword(data: { email: string; code: string; newPassword: string }) {
        return this.http.post<{ message: string }>(`${this.apiURL}/reset-password`, data);
    }

    // Save JWT token in localStorage and update auth status
    private setSession(token: string, userId: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
        }
        this.authStatus.next(true);
    }

    // Logout user by removing token and redirecting to login page
    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
        }
        this.authStatus.next(false);
        this.router.navigate(['/login']);
    }

    // Observable to allow components to subscribe to authentication status
    isAuthenticated() {
        return this.authStatus.asObservable();
    }

    // Get the stored JWT token
    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }

    // Get the stored userId
    getUserId(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('userId');
        }
        return null;
    }

    // Get HTTP headers including JWT token for protected API requests
    getAuthHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Authorization': `Bearer ${this.getToken()}`
        });
    }

}