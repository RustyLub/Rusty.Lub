import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testBM() {
  const token = process.env.BM_TOKEN;
  console.log('Token exists:', !!token);
  
  try {
    const steamId = '76561198110941835';
    const response = await axios.get(`https://api.battlemetrics.com/players?filter[search]=${steamId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Success:', response.status);
    console.log('Data:', JSON.stringify(response.data.data[0]));
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.response) {
        console.error('Response:', error.response.status, error.response.data);
    }
  }
}
testBM();
