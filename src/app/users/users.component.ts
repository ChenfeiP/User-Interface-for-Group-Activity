import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: User[] = [];
  public filteredUsers: User[] = [];
  public searchEmail: string = '';
  public searchUsername: string = '';
  public searchFirstName: string = '';
  public searchType: string = 'all'; // 'all', 'email', 'username', 'first_name'

  constructor(private http: HttpClient){}

  filterByEmail(email: string): void {
    if (!email) {
      this.filteredUsers = this.users;
      return;
    }
    this.filteredUsers = this.users.filter((user) => 
      user.email && user.email.toLowerCase().includes(email.toLowerCase())
    );
  }

  filterByUsername(username: string): void {
    if (!username) {
      this.filteredUsers = this.users;
      return;
    }
    this.filteredUsers = this.users.filter((user) => 
      user.username && user.username.toLowerCase().includes(username.toLowerCase())
    );
  }

  filterByFirstName(first_name: string): void {
    if (!first_name) {
      this.filteredUsers = this.users;
      return;
    }
    this.filteredUsers = this.users.filter((user) => 
      user.first_name && user.first_name.toLowerCase().includes(first_name.toLowerCase())
    );
  }

  searchUsers(): void {
    const query = this.searchEmail || this.searchUsername || this.searchFirstName;
    if (!query) {
      this.loadAllUsers();
      return;
    }

    let api = `http://localhost:3000/users/search?query=${encodeURIComponent(query)}`;
    
    if (this.searchEmail) {
      api += '&type=email';
    } else if (this.searchUsername) {
      api += '&type=username';
    } else if (this.searchFirstName) {
      api += '&type=first_name';
    }

    this.http.get<User[]>(api).subscribe({
      next: (response) => {
        this.users = response;
        this.filteredUsers = this.users;
        console.log('Users found:', this.users);
      },
      error: (error) => {
        console.error('Error searching users:', error);
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  loadAllUsers(): void {
    let api = 'http://localhost:3000/users';
    this.http.get<User[]>(api).subscribe({
      next: (response) => {
        this.users = response;
        this.filteredUsers = this.users;
        console.log('All users:', this.users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  ngOnInit(): void {
    this.loadAllUsers();
  }
}
