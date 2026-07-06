import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const dir = '/Rusty.Lub/images';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

async function main() {
  for (const file of files) {
    try {
        const filePath = path.join(dir, file);
        const data = fs.readFileSync(filePath);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { text: 'Is this an image of an oil rig? Answer YES or NO.' },
                {
                    inlineData: {
                        data: data.toString('base64'),
                        mimeType: file.endsWith('.png') ? 'image/png' : 'image/jpeg'
                    }
                }
            ]
        });
        if (response.text.includes('YES')) {
            console.log('FOUND: ' + file);
            return;
        }
    } catch (e) {
        console.log('Error on ' + file + ': ' + e.message);
    }
  }
  console.log('Not found');
}
main();
