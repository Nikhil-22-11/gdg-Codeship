import aishaImg from "@/assets/volunteer-aisha.jpg";
import danielImg from "@/assets/volunteer-daniel.jpg";
import josephImg from "@/assets/volunteer-joseph.jpg";
import meeraImg from "@/assets/volunteer-meera.jpg";

export const initialVolunteers = [
  { id: 1, name: "Dr. Jane Doe", occupation: "Field Medic", experience: "5+ Years", distance: "1.2 km", status: "Available", match: 96, image: aishaImg, phone: "+1 234 567 890", email: "jane.doe@human.org" },
  { id: 2, name: "Aisha Rahman", occupation: "Community Nurse", experience: "6+ Years", distance: "1.8 km", status: "In Mission", match: 94, image: danielImg, phone: "+1 234 567 891", email: "a.rahman@human.org" },
  { id: 3, name: "Meera Patel", occupation: "Logistics Lead", experience: "5+ Years", distance: "2.4 km", status: "Available", match: 91, image: meeraImg, phone: "+1 234 567 892", email: "m.patel@human.org" },
  { id: 4, name: "Joseph Kamau", occupation: "Rescue Paramedic", experience: "7+ Years", distance: "3.1 km", status: "Available", match: 88, image: josephImg, phone: "+1 234 567 893", email: "j.kamau@human.org" },
  { id: 5, name: "Marcus Thorne", occupation: "Structural Engineer", experience: "12+ Years", distance: "4.5 km", status: "Off-duty", match: 85, image: aishaImg, phone: "+1 234 567 894", email: "m.thorne@human.org" },
  { id: 6, name: "Sarah Chen", occupation: "Logistician", experience: "4+ Years", distance: "0.9 km", status: "Available", match: 92, image: danielImg, phone: "+1 234 567 895", email: "s.chen@human.org" },
  { id: 7, name: "David Miller", occupation: "UAV Pilot", experience: "3+ Years", distance: "5.2 km", status: "Available", match: 82, image: josephImg, phone: "+1 234 567 896", email: "d.miller@human.org" },
  { id: 8, name: "Elena Rossi", occupation: "Trauma Surgeon", experience: "15+ Years", distance: "2.1 km", status: "Available", match: 97, image: meeraImg, phone: "+1 234 567 897", email: "e.rossi@human.org" },
  { id: 9, name: "Kofi Mensah", occupation: "Water Engineer", experience: "8+ Years", distance: "1.4 km", status: "Available", match: 90, image: aishaImg, phone: "+1 234 567 898", email: "k.mensah@human.org" },
  { id: 10, name: "Yuki Tanaka", occupation: "Seismic Expert", experience: "10+ Years", distance: "3.8 km", status: "Available", match: 86, image: danielImg, phone: "+1 234 567 899", email: "y.tanaka@human.org" },
  { id: 11, name: "Carlos Ruiz", occupation: "Search & Rescue", experience: "6+ Years", distance: "0.5 km", status: "Available", match: 95, image: josephImg, phone: "+1 234 567 900", email: "c.ruiz@human.org" },
  { id: 12, name: "Amara Okafor", occupation: "Public Health", experience: "4+ Years", distance: "2.8 km", status: "Available", match: 89, image: meeraImg, phone: "+1 234 567 901", email: "a.okafor@human.org" },
  { id: 13, name: "Liam O'Connor", occupation: "Heavy Ops", experience: "9+ Years", distance: "4.2 km", status: "Available", match: 84, image: aishaImg, phone: "+1 234 567 902", email: "l.oconnor@human.org" },
  { id: 14, name: "Sita Devi", occupation: "Nutritionist", experience: "5+ Years", distance: "1.9 km", status: "Available", match: 91, image: danielImg, phone: "+1 234 567 903", email: "s.devi@human.org" },
  { id: 15, name: "Omar Al-Farsi", occupation: "Telecom Expert", experience: "7+ Years", distance: "6.1 km", status: "Available", match: 80, image: josephImg, phone: "+1 234 567 904", email: "o.alfarsi@human.org" },
  { id: 16, name: "Zoe Wang", occupation: "Biohazard Specialist", experience: "11+ Years", distance: "3.3 km", status: "Available", match: 93, image: meeraImg, phone: "+1 234 567 905", email: "z.wang@human.org" },
  { id: 17, name: "Peter Jensen", occupation: "Plumber", experience: "20+ Years", distance: "0.8 km", status: "Available", match: 87, image: aishaImg, phone: "+1 234 567 906", email: "p.jensen@human.org" },
  { id: 18, name: "Fatima Zahra", occupation: "Emergency Coordinator", experience: "8+ Years", distance: "2.5 km", status: "Available", match: 94, image: danielImg, phone: "+1 234 567 907", email: "f.zahra@human.org" },
  { id: 19, name: "Igor Smirnov", occupation: "Security Detail", experience: "10+ Years", distance: "5.5 km", status: "Available", match: 81, image: josephImg, phone: "+1 234 567 908", email: "i.smirnov@human.org" },
  { id: 20, name: "Anna Muller", occupation: "Psychologist", experience: "6+ Years", distance: "1.1 km", status: "Available", match: 92, image: meeraImg, phone: "+1 234 567 909", email: "a.muller@human.org" },
];
 
export const tacticalUnits = [
  { id: 'U1', name: 'Alpha-1 (Medic)', type: 'Medical', status: 'Moving', coordinates: [72.855, 19.055] },
  { id: 'U2', name: 'Delta-4 (Food)', type: 'Logistics', status: 'Stationary', coordinates: [72.875, 19.045] },
  { id: 'U3', name: 'Rescue-9 (Search)', type: 'Rescue', status: 'Moving', coordinates: [72.845, 19.035] },
  { id: 'U4', name: 'Water-2 (Utility)', type: 'Water', status: 'Deploying', coordinates: [72.895, 19.065] },
];

export const sosAlerts = [
  { id: 'S1', message: 'Heavy flooding reported near Sector 4 transit camp. Immediate evacuation needed.', source: 'SMS Gateway', time: '2m ago', severity: 'Critical' },
  { id: 'S2', message: 'Medical supplies running low at Dharavi West Relief Center.', source: 'Field Agent', time: '5m ago', severity: 'High' },
  { id: 'S3', message: 'Possible structural damage to Vashi bridge approach.', source: 'Citizen Report', time: '12m ago', severity: 'Medium' },
  { id: 'S4', message: 'Power outage affecting refrigeration for vaccines in Chembur.', source: 'IoT Sensor', time: '18m ago', severity: 'High' },
  { id: 'S5', message: 'Incoming storm surge alert for Mahim coastal block.', source: 'MET Dept', time: '25m ago', severity: 'Critical' },
];
