import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Task, Volunteer, Allocation } from '../models/types';

export class AutoDispatchService {
  private get db() { return getFirestore(); }

  async dispatchCriticalTasks() {
    console.log('Running AutoDispatch routine...');
    
    // 1. Get Unassigned Critical Tasks
    const tasksSnapshot = await this.db.collection('tasks')
      .where('stage', '==', 'Unassigned')
      .where('priority', '==', 'Critical')
      .get();

    if (tasksSnapshot.empty) {
      console.log('No unassigned critical tasks found.');
      return;
    }

    // 2. Get Available Volunteers
    const volunteersSnapshot = await this.db.collection('volunteers')
      .where('status', '==', 'Available')
      .get();

    if (volunteersSnapshot.empty) {
      console.log('No available volunteers found.');
      return;
    }

    const availableVolunteers = volunteersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Volunteer));

    // 3. Match and Dispatch (Batch Write for Atomicity)
    const batch = this.db.batch();
    let dispatchedCount = 0;

    for (const taskDoc of tasksSnapshot.docs) {
      const task = taskDoc.data() as Task;
      
      // Basic matching logic: e.g., if task requires 'Healthcare', find a 'Medic'
      const matchedVolunteer = availableVolunteers.find(v => {
        // Simple heuristic for demonstration based on the frontend logic
        if (task.title.toLowerCase().includes('medical') || task.title.toLowerCase().includes('medic')) {
          return v.occupation.toLowerCase().includes('medic') || v.occupation.toLowerCase().includes('nurse');
        } else if (task.title.toLowerCase().includes('power') || task.title.toLowerCase().includes('water')) {
            return v.occupation.toLowerCase().includes('engineer') || v.occupation.toLowerCase().includes('electrician');
        }
        return true; // Match anyone if no specific rule
      });

      if (matchedVolunteer) {
        // Create Allocation Document
        const allocationRef = this.db.collection('allocations').doc();
        const newAllocation: Allocation = {
          volunteerId: matchedVolunteer.id!,
          taskId: taskDoc.id,
          timeActive: FieldValue.serverTimestamp() as any,
          status: 'En-route'
        };
        batch.set(allocationRef, newAllocation);

        // Update Task Stage
        batch.update(taskDoc.ref, {
          stage: 'In Progress',
          updatedAt: FieldValue.serverTimestamp()
        });

        // Update Volunteer Status
        const volunteerRef = this.db.collection('volunteers').doc(matchedVolunteer.id!);
        batch.update(volunteerRef, {
          status: 'Deployed'
        });

        // Remove from local available pool so they aren't double-booked during this run
        const vIndex = availableVolunteers.findIndex(v => v.id === matchedVolunteer.id);
        availableVolunteers.splice(vIndex, 1);

        dispatchedCount++;
      }
    }

    if (dispatchedCount > 0) {
      await batch.commit();
      console.log(`Successfully dispatched ${dispatchedCount} volunteers.`);
    }
  }
}
