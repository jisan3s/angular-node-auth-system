import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [FormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {
    // Form fields
    email = '';
    password = '';
    isLoading = false; // To show loading state

    constructor(private auth: Auth, private router: Router) { }

    // Function to call login API
    login() {
        if (!this.email || !this.password) return;

        this.isLoading = true;

        this.auth.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/']); // Navigate to dashboard on success
            },
            error: err => {
                this.isLoading = false;
                console.error('Login error:', err);
                // Strictly show ONLY the backend message or "Invalid credentials"
                const msg = err.error?.message || 'Invalid credentials';
                window.alert(msg);
                window.location.reload();
            }
        });
    }

    // No need for onInput() error clearing anymore as alert is modal
    onInput() { }
}