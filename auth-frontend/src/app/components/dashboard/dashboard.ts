import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-dashboard',
    imports: [],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

    private http = inject(HttpClient); // Inject HttpClient
    auth = inject(Auth); // Inject Auth service
    private platformId = inject(PLATFORM_ID);
    private cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef
    users: any[] = []; // Store users fetched from API
    isLoadingData = false; // Initialize as false for SSR compatibility
    currentUserId: string | null = null;

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.isLoadingData = true;
            this.currentUserId = this.auth.getUserId();

            // Fetch protected data (requires JWT token)
            this.http.get('http://localhost:5001/api/users', { headers: this.auth.getAuthHeaders() })
                .subscribe({
                    next: (res: any) => {
                        this.users = res;
                        this.isLoadingData = false;
                        this.cdr.detectChanges(); // Force UI update
                    },
                    error: (err) => {
                        console.error('Dashboard fetch error:', err);
                        this.isLoadingData = false;
                        this.cdr.detectChanges(); // Force UI update
                    }
                });
        }
    }

    // Logout user
    logout() {
        this.auth.logout();
    }

    // Delete user
    deleteUser(id: string) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.http.delete(`http://localhost:5001/api/users/${id}`, { headers: this.auth.getAuthHeaders() })
                .subscribe({
                    next: () => {
                        // If user deleted themselves, log out
                        if (id === this.currentUserId) {
                            this.auth.logout();
                        } else {
                            // Remove user from local list (though this case shouldn't happen with button disabled)
                            this.users = this.users.filter(user => user._id !== id);
                            this.cdr.detectChanges();
                        }
                    },
                    error: (err) => {
                        console.error('Delete error:', err);
                        alert('Failed to delete user');
                    }
                });
        }
    }

}