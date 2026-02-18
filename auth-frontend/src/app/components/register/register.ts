import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    imports: [FormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.scss',
})
export class Register {

    name = '';
    email = '';
    password = '';
    isLoading = false; // To show loading state

    constructor(private auth: Auth, private router: Router) { }

    // Function to call register API
    register() {
        if (!this.name || !this.email || !this.password) return;

        this.isLoading = true;

        this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/']); // Navigate to dashboard on success
            },
            error: err => {
                this.isLoading = false;
                console.error('Registration error:', err);
                // Strictly show ONLY the backend message or 'Invalid credentials'
                const msg = err.error?.message || 'Invalid credentials';
                window.alert(msg);
                window.location.reload();
            }
        });
    }

    // Clear error when user types
    onInput() { }

}