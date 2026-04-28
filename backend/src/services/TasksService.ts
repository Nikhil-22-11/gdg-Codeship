import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Task } from '../models/types';

export class TasksService {
  private get db() { return getFirestore(); }
  private get collection() { return this.db.collection('tasks'); }

  async getAllTasks(): Promise<Task[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const taskData = {
      ...task,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    const docRef = await this.collection.add(taskData);
    return { id: docRef.id, ...taskData } as Task;
  }

  async updateTaskStage(taskId: string, stage: Task['stage']): Promise<void> {
    await this.collection.doc(taskId).update({
      stage,
      updatedAt: FieldValue.serverTimestamp()
    });
  }
}
