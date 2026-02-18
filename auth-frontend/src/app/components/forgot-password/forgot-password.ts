import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-forgot-password',
    imports: [FormsModule, RouterLink],
    template: `
        <div class="p-4 mx-auto w-50">
            <h2 class="mb-4">Forgot Password</h2>
            <p>Enter your email to receive a 6-digit reset code.</p>
            <form (ngSubmit)="sendCode()" #forgotForm="ngForm">
                <div class="d-flex flex-column gap-1 flex-grow-1 mb-3">
                    <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required email class="form-control"
                        #emailRef="ngModel">
                    @if (emailRef.invalid && (emailRef.dirty || emailRef.touched)) {
                    <small class="text-danger">Valid email is required.</small>
                    }
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <button type="submit" class="btn btn-primary" [disabled]="!forgotForm.valid || isLoading">
                        @if (isLoading) {
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        }
                        Send Code
                    </button>
                    <a routerLink="/login" class="text-decoration-none">Back to Login</a>
                </div>
            </form>
        </div>
    `,
    styles: []
})
export class ForgotPassword {
    email = '';
    isLoading = false;

    constructor(private auth: Auth, private router: Router) { }

    sendCode() {
        if (!this.email) return;

        this.isLoading = true;
        this.auth.forgotPassword(this.email).subscribe({
            next: (res) => {
                this.isLoading = false;
                window.alert(res.message);
                this.router.navigate(['/verify-code'], { queryParams: { email: this.email } });
            },
            error: (err) => {
                this.isLoading = false;
                const msg = err.error?.message || 'Something went wrong';
                window.alert(msg);
            }
        });
    }
}
