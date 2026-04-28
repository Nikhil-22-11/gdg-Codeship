import { getFirestore } from 'firebase-admin/firestore';
import { Volunteer } from '../models/types';
import fs from 'fs';
import path from 'path';

export class VolunteersService {
  private dbFilePath = path.join(__dirname, '../../db.json');

  // In-memory fallback if Firebase isn't configured, now synced to a file!
  private getFallbackVolunteers(): Volunteer[] {
    if (fs.existsSync(this.dbFilePath)) {
        const rawData = fs.readFileSync(this.dbFilePath, 'utf-8');
        return JSON.parse(rawData);
    }
    // Initial data if file doesn't exist
    const initial = [
      {
        id: "101",
        name: "Dr. Sarah Chen",
        occupation: "Trauma Surgeon",
        skills: ["surgery", "medic", "triage"],
        email: "s.chen@medical.org",
        phone: "+1 555-0198",
        location: { latitude: 19.076, longitude: 72.877 } as any,
        status: "Available",
        lastActive: { toDate: () => new Date() } as any,
        match: 100,
        image: "https://i.pravatar.cc/150?u=1"
      } as any,
      {
        id: "102",
        name: "Marcus Rodriguez",
        occupation: "Structural Engineer",
        skills: ["engineer", "logistics"],
        email: "m.rodriguez@ops.org",
        phone: "+1 555-0199",
        location: { latitude: 19.082, longitude: 72.881 } as any,
        status: "Available",
        lastActive: { toDate: () => new Date() } as any,
        match: 94,
        image: "https://i.pravatar.cc/150?u=2"
      } as any
    ];
    this.saveFallbackVolunteers(initial);
    return initial;
  }

  private saveFallbackVolunteers(data: Volunteer[]) {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  private get db() { return getFirestore(); }
  private get collection() { return this.db.collection('volunteers'); }

  async getAllVolunteers(): Promise<Volunteer[]> {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
    } catch (error) {
      console.warn("Firestore not configured, using local JSON database.");
      return this.getFallbackVolunteers();
    }
  }

  async createVolunteer(volunteer: Volunteer): Promise<Volunteer> {
    try {
      const docRef = await this.collection.add(volunteer);
      return { id: docRef.id, ...volunteer };
    } catch (error) {
      console.warn("Firestore not configured, saving to local JSON database.");
      // Create a highly unique ID to prevent duplicates
      const newVol = { id: Date.now().toString() + Math.random().toString(36).substring(7), ...volunteer };
      const currentData = this.getFallbackVolunteers();
      currentData.unshift(newVol);
      this.saveFallbackVolunteers(currentData);
      return newVol;
    }
  }

  async deleteVolunteer(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (error) {
      console.warn("Firestore not configured, deleting from local JSON database.");
      let currentData = this.getFallbackVolunteers();
      currentData = currentData.filter(v => v.id !== id);
      this.saveFallbackVolunteers(currentData);
    }
  }

  async getVolunteersByOccupation(occupation: string): Promise<Volunteer[]> {
    try {
      const snapshot = await this.collection
        .where('occupation', '==', occupation)
        .where('status', '==', 'Available')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
    } catch (error) {
      return this.getFallbackVolunteers().filter(v => v.occupation === occupation && v.status === 'Available');
    }
  }

  async getVolunteersBySkill(skill: string): Promise<Volunteer[]> {
    try {
      const snapshot = await this.collection
        .where('skills', 'array-contains', skill)
        .where('status', '==', 'Available')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
    } catch (error) {
      return this.getFallbackVolunteers().filter(v => (v.skills || []).includes(skill) && v.status === 'Available');
    }
  }
}
