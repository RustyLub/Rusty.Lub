import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import fs from 'fs';
import axios from 'axios';

async function test() {
  try {
    const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
    const app = initializeApp({
      credential: applicationDefault(),
      projectId: config.projectId
    });
    
    // Get access token
    const credential = (app.options.credential as any);
    const tokenObj = await credential.getAccessToken();
    const token = tokenObj.access_token;
    
    console.log('Got access token');
    
    // Get current ruleset
    const rules = fs.readFileSync('firestore.rules', 'utf8');
    
    // 1. Create a ruleset
    const createRes = await axios.post(
      `https://firebaserules.googleapis.com/v1/projects/${config.projectId}/rulesets`,
      {
        source: {
          files: [
            {
              name: "firestore.rules",
              content: rules
            }
          ]
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const rulesetName = createRes.data.name;
    console.log('Created ruleset:', rulesetName);
    
    // 2. Release it to the specific database
    const releaseName = `projects/${config.projectId}/releases/cloud.firestore/${config.firestoreDatabaseId}`;
    const patchRes = await axios.patch(
      `https://firebaserules.googleapis.com/v1/${releaseName}`,
      {
        rulesetName: rulesetName
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('Released to database:', config.firestoreDatabaseId);
    
  } catch(e: any) {
    console.error('FAILED:', e.response?.data || e.message);
  }
}
test();
