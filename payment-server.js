import express from 'express';
import cors from 'cors';
import { KHQR, CURRENCY, COUNTRY, TAG } from 'ts-khqr';
import QRCode from 'qrcode';
import fetch from 'node-fetch';
import { WebSocketServer } from 'ws';

console.log('Starting server...');

const app = express();
const PORT = process.env.PORT || 7777;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));
app.use(express.static('public'));
app.use(express.json());

const wss = new WebSocketServer({ port: 8080 }); // WebSocket server

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('[INFO] New WebSocket client connected');
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

app.post('/generate-khqr', async (req, res) => {
  const { amount, transactionId } = req.body;
  console.log(`[INFO] Received request to generate KHQR with data:`, { amount, transactionId });

  try {
    const khqrResult = KHQR.generate({
      tag: TAG.INDIVIDUAL,
      accountID: 'tet_sory@aclb',
      merchantName: 'Ikhode Banking',
      currency: CURRENCY.USD,
      amount: Number(amount),
      countryCode: COUNTRY.KH,
      additionalData: {
        billNumber: transactionId,
        purposeOfTransaction: 'Payment'
      }
    });

    if (khqrResult.status.code === 0 && khqrResult.data) {
      const qrString = khqrResult.data.qr;
      const qrCodeData = await QRCode.toDataURL(qrString);
      res.json({ qrCodeData });

      console.log(`[DEBUG] Calling checkPaymentStatus()...`);
      await checkPaymentStatus(khqrResult.data.md5, amount, transactionId);
    } else {
      res.status(400).json({ error: 'Invalid KHQR data' });
    }
  } catch (error) {
    console.error(`[ERROR] Error generating KHQR:`, error);
    res.status(500).json({ error: 'Error generating KHQR' });
  }
});

async function checkPaymentStatus(md5, amount, transactionId) {
  console.log(`[INFO] Checking payment status for MD5: ${md5}`);
  const url = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";
  const body = { "md5": md5 };
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMzQ2ZjI0MGJlMzcwNDgwNiJ9LCJpYXQiOjE3NDA1NTcyNzQsImV4cCI6MTc0ODMzMzI3NH0.M6_c8kN4RHbwo8oaOqcIKk3FOQlifz0MFuUg6xbKwxU";
  const header = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const intervalId = setInterval(async () => {
    console.log(`[DEBUG] Checking payment status...`);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const jsonData = await response.json();
        console.log(`[INFO] Payment Status Response:`, jsonData);

        if (jsonData.responseCode === 0 && jsonData.data && jsonData.data.hash) {
          console.log(`[SUCCESS] Payment Confirmed for Transaction: ${transactionId}, Amount: ${amount}`);

          // Notify all WebSocket clients about successful payment
          clients.forEach(ws => {
            ws.send(JSON.stringify({
              type: 'payment_success',
              transactionId,
              amount
            }));
          });

          clearInterval(intervalId);
        }
      } else {
        console.error(`[ERROR] Failed to check payment status`, response.statusText);
      }
    } catch (error) {
      console.error(`[ERROR] Error checking payment status`, error);
    }
  }, 5000);

  setTimeout(() => {
    console.error(`[ERROR] Payment timeout: 30 seconds elapsed`);
    clearInterval(intervalId);
  }, 60000);
}

app.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
});
