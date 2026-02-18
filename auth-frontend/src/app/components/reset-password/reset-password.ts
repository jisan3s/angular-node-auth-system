import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-reset-password',
    imports: [FormsModule, RouterLink],
    template: `
        <div class="p-4 mx-auto w-50">
            <h2 class="mb-4">Reset Password</h2>
            <p>Enter your new password.</p>
            <form (ngSubmit)="reset()" #resetForm="ngForm">
                <div class="d-flex flex-column gap-1 flex-grow-1 mb-3">
                    <input type="password" [(ngModel)]="password" name="password" placeholder="New Password" required minlength="6" class="form-control"
                        #passRef="ngModel">
                    @if (passRef.invalid && (passRef.dirty || passRef.touched)) {
                    <small class="text-danger">Password must be at least 6 characters.</small>
                    }
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <button type="submit" class="btn btn-primary" [disabled]="!resetForm.valid || isLoading">
                        @if (isLoading) {
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        }
                        Reset Password
                    </button>
                    <a routerLink="/login" class="text-decoration-none">Back to Login</a>
                </div>
            </form>
        </div>
    `,
    styles: []
})
export class ResetPassword implements OnInit {
    email = '';
    code = '';
    password = '';
    isLoading = false;

    constructor(private auth: Auth, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'];
            this.code = params['code'];
            if (!this.email || !this.code) {
                this.router.navigate(['/forgot-password']);
            }
        });
    }

    reset() {
        if (!this.password) return;

        this.isLoading = true;
        this.auth.resetPassword({ email: this.email, code: this.code, newPassword: this.password }).subscribe({
            next: (res) => {
                this.isLoading = false;
                window.alert(res.message);
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                const msg = err.error?.message || 'Failed to reset password';
                window.alert(msg);
            }
        });
    }
}
