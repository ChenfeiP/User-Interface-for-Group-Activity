import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TimelineActivity, UserTimeline } from './timeline';
import { User } from '../users/users';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public user: User | null = null;
  public timeline: TimelineActivity[] = [];
  public loading: boolean = true;
  public error: string = '';
  public searchEmail: string = '';
  public searchUsername: string = '';
  public searchFirstName: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if userId is provided in route params
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      const email = params['email'];
      const username = params['username'];
      const firstName = params['firstName'];

      if (userId) {
        this.loadTimelineByUserId(userId);
      } else if (email || username || firstName) {
        this.searchEmail = email || '';
        this.searchUsername = username || '';
        this.searchFirstName = firstName || '';
        this.searchTimeline();
      }
    });
  }

  loadTimelineByUserId(userId: number): void {
    this.loading = true;
    this.error = '';

    this.http.get<TimelineActivity[]>(`http://localhost:3000/users/${userId}/timeline`).subscribe({
      next: (response) => {
        this.timeline = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading timeline:', error);
        this.error = 'Failed to load timeline';
        this.loading = false;
      }
    });
  }

  searchTimeline(): void {
    if (!this.searchEmail && !this.searchUsername && !this.searchFirstName) {
      this.error = 'Please enter at least one search field';
      return;
    }

    this.loading = true;
    this.error = '';

    let params = new URLSearchParams();
    if (this.searchEmail) params.append('email', this.searchEmail);
    if (this.searchUsername) params.append('username', this.searchUsername);
    if (this.searchFirstName) params.append('first_name', this.searchFirstName);

    this.http.get<UserTimeline>(`http://localhost:3000/users/timeline/search?${params.toString()}`).subscribe({
      next: (response) => {
        this.user = response.user;
        this.timeline = response.timeline;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching timeline:', error);
        this.error = error.error?.error || 'Failed to load timeline';
        this.loading = false;
      }
    });
  }

  getActivityIcon(activityType: string): string {
    switch (activityType) {
      case 'joined_group': return '👥';
      case 'applied_to_group': return '📝';
      case 'created_invite': return '✉️';
      case 'redeemed_invite': return '🎟️';
      case 'expression': return '💭';
      case 'user_post': return '📄';
      default: return '📌';
    }
  }

  getActivityColor(activityType: string): string {
    switch (activityType) {
      case 'joined_group': return '#4CAF50';
      case 'applied_to_group': return '#2196F3';
      case 'created_invite': return '#FF9800';
      case 'redeemed_invite': return '#9C27B0';
      case 'expression': return '#00BCD4';
      case 'user_post': return '#E91E63';
      default: return '#757575';
    }
  }

  getActivityLabel(activityType: string): string {
    switch (activityType) {
      case 'joined_group': return 'Joined Group';
      case 'applied_to_group': return 'Applied to Group';
      case 'created_invite': return 'Created Invite';
      case 'redeemed_invite': return 'Redeemed Invite';
      case 'expression': return 'Expression';
      case 'user_post': return 'User Post';
      default: return activityType;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  formatDateShort(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
