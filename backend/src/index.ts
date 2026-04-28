import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';
import * as admin from 'firebase-admin';

import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin with the downloaded Service Account Key
try {
  const keyPath = path.join(__dirname, '../serviceAccountKey.json');
  
  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("🔥 SUCCESS: Firebase Admin securely connected using local serviceAccountKey.json");
  } else if (process.env.K_SERVICE || process.env.GOOGLE_CLOUD_PROJECT) {
    // If running in Google Cloud Run / App Engine, use Application Default Credentials
    admin.initializeApp();
    console.log("☁️ SUCCESS: Firebase Admin securely connected using GCP Application Default Credentials!");
  } else {
    console.warn("⚠️ Warning: serviceAccountKey.json not found and not running in GCP. Using local fallback.");
  }
} catch (error: any) {
  console.error("❌ Failed to initialize Firebase:", error.message);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Disaster Response OS Backend is running.' });
});

// Serve static frontend files — in Docker, frontend dist is at /dist; locally at ../../dist
const frontendPath = process.env.FRONTEND_PATH || 
  (fs.existsSync('/dist') ? '/dist' : path.join(__dirname, '../../dist'));
if (fs.existsSync(frontendPath)) {
  console.log(`📦 Serving static frontend from: ${frontendPath}`);
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // Fallback if frontend is not built
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f4f6; margin: 0;">
          <div style="text-align: center; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: #2D6A4F; margin-bottom: 0.5rem;">Disaster Response OS</h1>
            <p style="color: #4b5563; font-weight: bold;">Backend Services are Online 🚀</p>
            <p style="color: #6b7280; font-size: 0.875rem;">Frontend dist folder not found. Run "npm run build" in the root directory.</p>
          </div>
        </body>
      </html>
    `);
  });
}



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
