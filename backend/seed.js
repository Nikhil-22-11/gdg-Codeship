// Quick script to seed your new Firebase database!
fetch('http://localhost:3000/api/admin/seed', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log("Success:", data))
  .catch(err => console.error("Error:", err.message));
