const axios = require('axios');

async function verifyWebhookSignature(accessToken, hookHeaders, hookEvent) {
  const url =
    'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken,
  };

  const body = {
    auth_algo: hookHeaders['paypal-auth-algo'],
    cert_url: hookHeaders['paypal-cert-url'],
    transmission_id: hookHeaders['paypal-transmission-id'],
    transmission_time: hookHeaders['paypal-transmission-time'],
    transmission_sig: hookHeaders['paypal-transmission-sig'],
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: hookEvent,
  };

  let response;
  try {
    response = await axios.post(url, body, { headers });
    return response.data['verification_status'] === 'SUCCESS';
  } catch (error) {
    console.error('Could not verify webhook signature:', error.message);
  }
}

module.exports = {
  verifyWebhookSignature,
};
