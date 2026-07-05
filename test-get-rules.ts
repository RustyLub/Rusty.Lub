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
    
    // Get current ruleset
    const releaseName = `projects/${config.projectId}/releases/cloud.firestore/${config.firestoreDatabaseId}`;
    const res = await axios.get(
      `https://firebaserules.googleapis.com/v1/${releaseName}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log('Release ruleset:', res.data.rulesetName);
    
    const rulesRes = await axios.get(
      `https://firebaserules.googleapis.com/v1/${res.data.rulesetName}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log(rulesRes.data.source.files[0].content);
  } catch(e: any) {
    console.error('FAILED:', e.response?.data || e.message);
  }
}
test();
