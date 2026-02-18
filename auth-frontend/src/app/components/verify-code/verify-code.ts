import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-verify-code',
    imports: [FormsModule, RouterLink],
    template: `
        <div class="p-4 mx-auto w-50">
            <h2 class="mb-4">Verify Code</h2>
            <p>Enter the 6-digit code sent to <strong>{{ email }}</strong></p>
            <form (ngSubmit)="verify()" #verifyForm="ngForm">
                <div class="d-flex flex-column gap-1 flex-grow-1 mb-3">
                    <input type="text" [(ngModel)]="code" name="code" placeholder="6-digit Code" required pattern="^[0-9]{6}$" class="form-control"
                        #codeRef="ngModel">
                    @if (codeRef.invalid && (codeRef.dirty || codeRef.touched)) {
                    <small class="text-danger">A 6-digit numeric code is required.</small>
                    }
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <button type="submit" class="btn btn-primary" [disabled]="!verifyForm.valid || isLoading">
                        @if (isLoading) {
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        }
                        Verify
                    </button>
                    <a routerLink="/forgot-password" class="text-decoration-none">Change Email</a>
                </div>
            </form>
        </div>
    `,
    styles: []
})
export class VerifyCode implements OnInit {
    email = '';
    code = '';
    isLoading = false;

    constructor(private auth: Auth, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'];
            if (!this.email) {
                this.router.navigate(['/forgot-password']);
            }
        });
    }

    verify() {
        if (!this.code) return;

        this.isLoading = true;
        this.auth.verifyCode(this.email, this.code).subscribe({
            next: (res) => {
                this.isLoading = false;
                window.alert(res.message);
                this.router.navigate(['/reset-password'], { queryParams: { email: this.email, code: this.code } });
            },
            error: (err) => {
                this.isLoading = false;
                const msg = err.error?.message || 'Invalid or expired code';
                window.alert(msg);
            }
        });
    }
}
