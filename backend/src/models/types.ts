import { firestore } from 'firebase-admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'commander' | 'viewer';
  createdAt: firestore.Timestamp;
}

export interface Volunteer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  skills: string[];
  location: firestore.GeoPoint;
  status: 'Available' | 'Deployed' | 'Offline';
  aiMatchScore?: number;
  lastActive: firestore.Timestamp;
}

export interface Crisis {
  id?: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  location: firestore.GeoPoint;
  status: 'Active' | 'Resolved' | 'Monitoring';
  createdAt: firestore.Timestamp;
  resolvedAt?: firestore.Timestamp;
}

export interface Task {
  id?: string;
  title: string;
  zone: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  stage: 'Unassigned' | 'In Progress' | 'Completed';
  crisisId?: string; // Optional reference to a broader crisis
  requiredSkills: string[];
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

export interface Allocation {
  id?: string;
  volunteerId: string;
  taskId: string;
  timeActive: firestore.Timestamp; // When the allocation started
  status: 'En-route' | 'Active' | 'Completed' | 'Recalled';
}

export interface Transaction {
  id?: string;
  type: 'Procurement' | 'Grant' | 'Subsidy' | 'Donation' | 'Investment' | 'Other';
  amount: number; // Positive for income/grants, negative for spend
  description: string;
  timestamp: firestore.Timestamp;
  status: 'Pending' | 'Completed' | 'Failed';
}
