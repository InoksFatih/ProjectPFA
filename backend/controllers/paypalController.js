const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const baseURL = 'https://api-m.sandbox.paypal.com';

const paypalController = {
  async createOrder(req, res) {
    try {
      const userId = req.user.id;

      // OPTIONAL: fetch cart from DB and compute total
      const total = 200; // use dummy total for now

      const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

      // Step 1: Get Access Token
      const tokenRes = await axios.post(`${baseURL}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = tokenRes.data.access_token;

      // Step 2: Create Order
      const orderRes = await axios.post(
        `${baseURL}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
  currency_code: 'USD', // ✅ Supported in sandbox
  value: (total / 10).toFixed(2), // Adjusted value if needed
}
,
            },
          ],
          application_context: {
            return_url: 'http://localhost:5174/success',
            cancel_url: 'http://localhost:5174/cancel',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const approvalUrl = orderRes.data.links.find(link => link.rel === 'approve')?.href;

      res.json({ url: approvalUrl });
    } catch (err) {
      console.error('PayPal Order Error:', err.response?.data || err.message);
      res.status(500).json({ message: 'Erreur PayPal' });
    }
  },
};

module.exports = paypalController;
 