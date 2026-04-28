import { getFirestore } from 'firebase-admin/firestore';

export class SeedService {
  private get db() { return getFirestore(); }

  async seedDatabase() {
    console.log("Seeding database with mock data...");
    const batch = this.db.batch();

    const initialVolunteers: any[] = [
      { id: "101", name: "Dr. Sarah Chen", occupation: "Trauma Surgeon", email: "s@test.com", phone: "123", status: "Available", match: 100, image: "https://i.pravatar.cc/150?u=1" },
      { id: "102", name: "Marcus Rodriguez", occupation: "Structural Engineer", email: "m@test.com", phone: "456", status: "Available", match: 94, image: "https://i.pravatar.cc/150?u=2" }
    ];

    const initialNeeds: any[] = [
      { id: "8421", title: "Water Shortage — Ward 4", zone: "Dharavi Relief Grid", score: 9.2, reports: 257, coordinates: [72.8553, 19.038], impacted: 142, type: "Water" },
      { id: "8417", title: "Food Crisis — Transit Camp", zone: "Kurla Transit Camp", score: 9.3, reports: 209, coordinates: [72.8796, 19.0726], impacted: 118, type: "Food" },
      { id: "8398", title: "Medical Triage Needed", zone: "Sion Medical Line", score: 8.9, reports: 99, coordinates: [72.8611, 19.044], impacted: 76, type: "Healthcare" },
      { id: "8374", title: "Coastal Evacuation Block", zone: "Mahim Coastal Block", score: 9.1, reports: 39, coordinates: [72.8401, 19.0427], impacted: 64, type: "Logistics" },
      { id: "8350", title: "Power Failure — Sector 3", zone: "Chembur Grid", score: 8.5, reports: 156, coordinates: [72.89, 19.05], impacted: 90, type: "Utilities" },
      { id: "8320", title: "Bridge Collapse Risk", zone: "Vashi Bridge Path", score: 9.5, reports: 42, coordinates: [72.93, 19.04], impacted: 200, type: "Logistics" }
    ];

    const initialAllocations: any[] = [
      { id: "a1", volunteerId: "101", taskId: "t1", status: "Active" }
    ];

    // Seed Volunteers
    initialVolunteers.forEach((v: any) => {
        const ref = this.db.collection('volunteers').doc(v.id.toString());
        batch.set(ref, v);
    });

    // Seed Crises / Needs
    initialNeeds.forEach((n: any) => {
        const ref = this.db.collection('crises').doc(n.id.toString());
        batch.set(ref, n);
    });

    // Seed Allocations
    initialAllocations.forEach((a: any) => {
        const ref = this.db.collection('allocations').doc(a.id.toString());
        batch.set(ref, a);
    });

    // Seed some Tasks for the Kanban board
    const sampleTasks: any[] = [
        { id: "t1", title: "Setup Medical Triage", zone: "Dharavi", priority: "Critical", stage: "Unassigned", requiredSkills: ["medic"] },
        { id: "t2", title: "Restore Power Grid", zone: "Bandra", priority: "High", stage: "In Progress", requiredSkills: ["engineer"] },
        { id: "t3", title: "Distribute Rations", zone: "Colaba", priority: "Medium", stage: "Completed", requiredSkills: ["logistics"] }
    ];
    sampleTasks.forEach((t: any) => {
        const ref = this.db.collection('tasks').doc(t.id);
        batch.set(ref, t);
    });

    await batch.commit();
    console.log("Database seeded successfully!");
  }
}
