import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';
import * as admin from 'firebase-admin';

import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin — always start the server, even if Firebase fails
try {
  const keyPath = path.join(__dirname, '../serviceAccountKey.json');
  if (fs.existsSync(keyPath)) {
    const serviceAccount = require(keyPath);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log("🔥 Firebase connected via serviceAccountKey.json");
  } else {
    // On Google Cloud Run, ADC is available automatically via the service account
    admin.initializeApp();
    console.log("☁️ Firebase connected via Application Default Credentials (GCP)");
  }
} catch (error: any) {
  // Log but do NOT crash — server must still start so Cloud Run health check passes
  console.error("⚠️ Firebase init warning:", error.message);
  console.warn("Server continuing without Firebase — some API routes may fail.");
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
  app.get('/{*path}', (req, res) => {
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
