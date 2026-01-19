// Mock data for User Activity Timeline
// Simulates: users, groups, group_members, group_applications, group_invite_codes, group_invite_redemptions

const mockUsers = [
  {
    user_id: 1,
    username: 'johndoe',
    email: 'gaoyangyijun@gmail.com',
    first_name: 'John',
    user_focus: 'Travel',
    look_for_gender: 'Any',
    user_summary: 'Love exploring new places',
    top_user: true,
    interests: 'Hiking, Photography, Food',
    summary: 'Adventure seeker and food enthusiast',
    connection_type: 'Friend',
    age_preference: '25-35',
    created_at: new Date('2024-01-15')
  },
  {
    user_id: 2,
    username: 'sarahsmith',
    email: 'sarah.smith@example.com',
    first_name: 'Sarah',
    user_focus: 'Networking',
    look_for_gender: 'Female',
    user_summary: 'Professional networker',
    top_user: false,
    interests: 'Business, Technology, Coffee',
    summary: 'Building meaningful connections',
    connection_type: 'Professional',
    age_preference: '28-40',
    created_at: new Date('2024-02-20')
  },
  {
    user_id: 3,
    username: 'mikejohnson',
    email: 'mike.j@example.com',
    first_name: 'Mike',
    user_focus: 'Social',
    look_for_gender: 'Any',
    user_summary: 'Social butterfly',
    top_user: true,
    interests: 'Sports, Music, Movies',
    summary: 'Always up for new experiences',
    connection_type: 'Friend',
    age_preference: '22-35',
    created_at: new Date('2024-03-10')
  },
  {
    user_id: 4,
    username: 'emilydavis',
    email: 'emily.davis@example.com',
    first_name: 'Emily',
    user_focus: 'Dating',
    look_for_gender: 'Male',
    user_summary: 'Looking for genuine connections',
    top_user: false,
    interests: 'Yoga, Reading, Art',
    summary: 'Creative soul seeking adventure',
    connection_type: 'Romantic',
    age_preference: '26-38',
    created_at: new Date('2024-04-05')
  },
  {
    user_id: 5,
    username: 'alexwilson',
    email: 'alex.wilson@example.com',
    first_name: 'Alex',
    user_focus: 'Activity',
    look_for_gender: 'Any',
    user_summary: 'Activity partner wanted',
    top_user: true,
    interests: 'Climbing, Cycling, Running',
    summary: 'Fitness enthusiast',
    connection_type: 'Activity Partner',
    age_preference: '24-40',
    created_at: new Date('2024-05-12')
  }
];

const mockGroups = [
  {
    group_id: '8c557773-13ed-437a-a630-bec3ba3b37f4',
    group_subject: 'Ice climbing',
    group_location: 'Toronto',
    group_time: new Date('2025-12-21T01:00:00.000-08:00'),
    created_at: new Date('2025-12-16T16:22:14.216-08:00')
  },
  {
    group_id: '8466c797-1be8-44ff-be19-524085c4c13f',
    group_subject: 'Ice photo test',
    group_location: null,
    group_time: new Date('2025-12-14T01:00:00.000-08:00'),
    created_at: new Date('2025-12-13T16:02:27.015-08:00')
  },
  {
    group_id: '486b495a-dfd5-4e0b-b791-70118c6b6119',
    group_subject: 'Tennis on the weekends',
    group_location: null,
    group_time: new Date('2025-11-30T01:00:00.000-08:00'),
    created_at: new Date('2025-12-03T16:05:30.693-08:00')
  },
  {
    group_id: '286bc987-41d7-4b7c-bc52-bd98b4794184',
    group_subject: 'Cafe hopping',
    group_location: null,
    group_time: new Date('2025-12-07T01:00:00.000-08:00'),
    created_at: new Date('2025-12-03T16:04:30.144-08:00')
  },
  {
    group_id: '10453ad3-fa08-4df1-955a-50247bbbd80e',
    group_subject: 'Comfort Food & Active Crew',
    group_location: 'Toronto',
    group_time: new Date('2025-10-12T02:00:00.000-07:00'),
    created_at: new Date('2025-10-30T19:28:44.171-07:00')
  },
  {
    group_id: '2748e310-b5ff-4dd0-a9f9-c8364d9e3999',
    group_subject: 'Winter Craft Collective',
    group_location: 'Toronto',
    group_time: new Date('2025-10-12T02:00:00.000-07:00'),
    created_at: new Date('2025-10-10T10:09:39.132-07:00')
  },
  {
    group_id: '5fb0b538-a2a0-4443-8179-b3b136da3b5b',
    group_subject: 'Craftsmanship & Creative Collaboration',
    group_location: 'Vancouver',
    group_time: new Date('2025-10-12T02:00:00.000-07:00'),
    created_at: new Date('2025-10-09T18:49:32.839-07:00')
  }
];

const mockGroupMembers = [
  {
    membership_id: 1,
    group_id: '8c557773-13ed-437a-a630-bec3ba3b37f4',
    user_id: 1,
    joined_at: new Date('2025-12-16T16:22:14.216-08:00')
  },
  {
    membership_id: 2,
    group_id: '486b495a-dfd5-4e0b-b791-70118c6b6119',
    user_id: 1,
    joined_at: new Date('2025-12-03T16:05:30.693-08:00')
  },
  {
    membership_id: 3,
    group_id: '286bc987-41d7-4b7c-bc52-bd98b4794184',
    user_id: 1,
    joined_at: new Date('2025-12-03T16:04:30.144-08:00')
  },
  {
    membership_id: 4,
    group_id: '10453ad3-fa08-4df1-955a-50247bbbd80e',
    user_id: 1,
    joined_at: new Date('2025-10-30T19:28:42.862-07:00')
  },
  {
    membership_id: 5,
    group_id: '2748e310-b5ff-4dd0-a9f9-c8364d9e3999',
    user_id: 1,
    joined_at: new Date('2025-10-10T10:09:39.132-07:00')
  },
  {
    membership_id: 6,
    group_id: '5fb0b538-a2a0-4443-8179-b3b136da3b5b',
    user_id: 2,
    joined_at: new Date('2025-10-09T18:49:32.839-07:00')
  }
];

const mockGroupApplications = [
  {
    application_id: 1,
    group_id: '8466c797-1be8-44ff-be19-524085c4c13f',
    applicant_user_id: 1,
    status: 'pending',
    created_at: new Date('2025-12-14T10:30:00.000-08:00'),
    decided_at: null
  },
  {
    application_id: 2,
    group_id: '2748e310-b5ff-4dd0-a9f9-c8364d9e3999',
    applicant_user_id: 3,
    status: 'approved',
    created_at: new Date('2025-10-11T14:20:00.000-07:00'),
    decided_at: new Date('2025-10-11T16:45:00.000-07:00')
  }
];

const mockGroupInviteCodes = [
  {
    invite_id: 'a1b2c3d4-1111-2222-3333-444444444444',
    group_id: '10453ad3-fa08-4df1-955a-50247bbbd80e',
    inviter_id: 1,
    invite_code: 'COMFORT2025',
    expires_at: new Date('2025-11-30T00:00:00.000-08:00'),
    usage_count: 2,
    created_at: new Date('2025-10-31T10:00:00.000-07:00')
  },
  {
    invite_id: 'b2c3d4e5-2222-3333-4444-555555555555',
    group_id: '2748e310-b5ff-4dd0-a9f9-c8364d9e3999',
    inviter_id: 1,
    invite_code: 'WINTER2025',
    expires_at: new Date('2025-12-31T00:00:00.000-08:00'),
    usage_count: 1,
    created_at: new Date('2025-10-10T11:00:00.000-07:00')
  }
];

const mockGroupInviteRedemptions = [
  {
    redemption_id: 'r1r1r1r1-1111-2222-3333-444444444444',
    invite_id: 'b2c3d4e5-2222-3333-4444-555555555555',
    group_id: '2748e310-b5ff-4dd0-a9f9-c8364d9e3999',
    user_id: 3,
    redeemed_at: new Date('2025-10-10T16:18:47.212-07:00')
  },
  {
    redemption_id: 'r2r2r2r2-2222-3333-4444-555555555555',
    invite_id: 'a1b2c3d4-1111-2222-3333-444444444444',
    group_id: '10453ad3-fa08-4df1-955a-50247bbbd80e',
    user_id: 2,
    redeemed_at: new Date('2025-10-30T19:28:44.171-07:00')
  },
  {
    redemption_id: 'r3r3r3r3-3333-4444-5555-666666666666',
    invite_id: 'a1b2c3d4-1111-2222-3333-444444444444',
    group_id: '8466c797-1be8-44ff-be19-524085c4c13f',
    user_id: 1,
    redeemed_at: new Date('2025-12-13T16:02:27.015-08:00')
  }
];

// Helper function to find user by email, username, or first name
function findUser(email, username, first_name) {
  return mockUsers.find(user => {
    if (email && user.email.toLowerCase().includes(email.toLowerCase())) return true;
    if (username && user.username.toLowerCase().includes(username.toLowerCase())) return true;
    if (first_name && user.first_name.toLowerCase().includes(first_name.toLowerCase())) return true;
    return false;
  });
}

// Generate timeline for a specific user (implements your SQL query)
function generateUserTimeline(userId) {
  const timeline = [];

  // 1) joined_group (from group_members)
  const memberships = mockGroupMembers.filter(m => m.user_id === userId);
  memberships.forEach(membership => {
    const group = mockGroups.find(g => g.group_id === membership.group_id);
    if (group) {
      timeline.push({
        activity_type: 'joined_group',
        activity_role: 'member',
        activity_time: membership.joined_at,
        group_id: membership.group_id,
        group_subject: group.group_subject,
        group_location: group.group_location,
        group_time: group.group_time,
        app_status: null,
        app_decided_at: null,
        invite_code: null,
        invite_expires_at: null,
        invite_usage_count: null,
        invite_id: null,
        redemption_id: null
      });
    }
  });

  // 2) applied_to_group (from group_applications)
  const applications = mockGroupApplications.filter(a => a.applicant_user_id === userId);
  applications.forEach(application => {
    const group = mockGroups.find(g => g.group_id === application.group_id);
    if (group) {
      timeline.push({
        activity_type: 'applied_to_group',
        activity_role: 'applicant',
        activity_time: application.created_at,
        group_id: application.group_id,
        group_subject: group.group_subject,
        group_location: group.group_location,
        group_time: group.group_time,
        app_status: application.status,
        app_decided_at: application.decided_at,
        invite_code: null,
        invite_expires_at: null,
        invite_usage_count: null,
        invite_id: null,
        redemption_id: null
      });
    }
  });

  // 3) created_invite (from group_invite_codes)
  const invites = mockGroupInviteCodes.filter(i => i.inviter_id === userId);
  invites.forEach(invite => {
    const group = mockGroups.find(g => g.group_id === invite.group_id);
    if (group) {
      timeline.push({
        activity_type: 'created_invite',
        activity_role: 'inviter',
        activity_time: invite.created_at,
        group_id: invite.group_id,
        group_subject: group.group_subject,
        group_location: group.group_location,
        group_time: group.group_time,
        app_status: null,
        app_decided_at: null,
        invite_code: invite.invite_code,
        invite_expires_at: invite.expires_at,
        invite_usage_count: invite.usage_count,
        invite_id: invite.invite_id,
        redemption_id: null
      });
    }
  });

  // 4) redeemed_invite (from group_invite_redemptions)
  const redemptions = mockGroupInviteRedemptions.filter(r => r.user_id === userId);
  redemptions.forEach(redemption => {
    const group = mockGroups.find(g => g.group_id === redemption.group_id);
    if (group) {
      timeline.push({
        activity_type: 'redeemed_invite',
        activity_role: 'invitee',
        activity_time: redemption.redeemed_at,
        group_id: redemption.group_id,
        group_subject: group.group_subject,
        group_location: group.group_location,
        group_time: group.group_time,
        app_status: null,
        app_decided_at: null,
        invite_code: null,
        invite_expires_at: null,
        invite_usage_count: null,
        invite_id: redemption.invite_id,
        redemption_id: redemption.redemption_id
      });
    }
  });

  // Sort by activity_time DESC, then activity_type
  timeline.sort((a, b) => {
    const timeCompare = new Date(b.activity_time) - new Date(a.activity_time);
    if (timeCompare !== 0) return timeCompare;
    return a.activity_type.localeCompare(b.activity_type);
  });

  return timeline;
}

module.exports = {
  mockUsers,
  mockGroups,
  mockGroupMembers,
  mockGroupApplications,
  mockGroupInviteCodes,
  mockGroupInviteRedemptions,
  findUser,
  generateUserTimeline
};
