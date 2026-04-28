import { initialVolunteers } from "./mockData";

// Simple event emitter for state changes
const listeners: Set<() => void> = new Set();
const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
const notify = () => listeners.forEach(l => l());

export let currentAllocations = [
  { 
    id: 1, 
    volunteer: initialVolunteers[1], 
    zone: "Dharavi Relief Grid", 
    task: "Water System Restoration", 
    startTime: "12m ago", 
    status: "Active", 
    priority: "Critical"
  }
];

export const dispatchedVolunteerIds = new Set([initialVolunteers[1].id]);

export const addAllocation = (newAlloc: any) => {
    currentAllocations = [newAlloc, ...currentAllocations].slice(0, 20); // Keep last 20
    dispatchedVolunteerIds.add(newAlloc.volunteer.id);
    notify();
};

export const useAllocations = () => {
    return { currentAllocations, subscribe, dispatchedVolunteerIds };
};
