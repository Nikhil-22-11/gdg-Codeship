import { Router } from 'express';
import { VolunteersService } from '../services/VolunteersService';
import { TasksService } from '../services/TasksService';
import { FinanceService } from '../services/FinanceService';
import { AutoDispatchService } from '../services/AutoDispatchService';
import { SeedService } from '../services/SeedService';
import { CrisesService } from '../services/CrisesService';

const router = Router();
const volunteersService = new VolunteersService();
const tasksService = new TasksService();
const financeService = new FinanceService();
const autoDispatchService = new AutoDispatchService();
const seedService = new SeedService();
const crisesService = new CrisesService();

// CRISES API
router.get('/crises', async (req, res) => {
  try {
    const crises = await crisesService.getAllCrises();
    res.json(crises);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crises' });
  }
});

router.delete('/crises/:id', async (req, res) => {
  try {
    await crisesService.deleteCrisis(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete crisis' });
  }
});

// VOLUNTEERS API
router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await volunteersService.getAllVolunteers();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

router.post('/volunteers', async (req, res) => {
  try {
    const newVolunteer = await volunteersService.createVolunteer(req.body);
    res.json(newVolunteer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create volunteer' });
  }
});

router.delete('/volunteers/:id', async (req, res) => {
  try {
    await volunteersService.deleteVolunteer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete volunteer' });
  }
});

router.get('/volunteers/occupation/:occupation', async (req, res) => {
  try {
    const volunteers = await volunteersService.getVolunteersByOccupation(req.params.occupation);
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

// TASKS API
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await tasksService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const newTask = await tasksService.createTask(req.body);
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.patch('/tasks/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    await tasksService.updateTaskStage(req.params.id, stage);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task stage' });
  }
});

// FINANCE API
router.get('/finance/summary', async (req, res) => {
  try {
    const summary = await financeService.getFinancialSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial summary' });
  }
});

// ADMIN TRIGGER (E.g. Cron Job Endpoint)
router.post('/admin/trigger-auto-dispatch', async (req, res) => {
  try {
    await autoDispatchService.dispatchCriticalTasks();
    res.json({ success: true, message: 'Auto-dispatch routine completed.' });
  } catch (error) {
    res.status(500).json({ error: 'Auto-dispatch failed.' });
  }
});

router.post('/admin/seed', async (req, res) => {
    try {
        await seedService.seedDatabase();
        res.json({ success: true, message: 'Database seeded.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to seed database' });
    }
});

export default router;
