const axios = require('axios');
const qs = require('qs');

async function createOrder(accessToken) {
  const url = 'https://api-m.sandbox.paypal.com/v2/checkout/orders';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': accessToken,
  };

  const data = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: 'd9f80740-38f0-11e8-b467-0ed5f89f718b',
        amount: {
          currency_code: 'USD',
          value: '100.00',
        },
        shipping: {
          name: {
            full_name: 'John Doe',
          },
          address: {
            address_line_1: '123 Main St',
            admin_area_2: 'San Jose',
            admin_area_1: 'CA',
            postal_code: '95131',
            country_code: 'US',
          },
        },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
          brand_name: 'EXAMPLE INC',
          locale: 'en-US',
          landing_page: 'LOGIN',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW',
          return_url: `${HOSTNAME}/orders/success`,
          cancel_url: `${HOSTNAME}/orders/failure`,
        },
      },
    },
   };
   

  let response;
  try {
    response = await axios.post(url, data, { headers });
  } catch (error) {
    console.log('createOrder');
    throw error;
  }
  const responseData = {
    id: response.data.id,
    payerLink: response.data.links.find((link) => link.rel === 'payer-action').href,
  };
  return responseData;
}

async function getAccessToken() {
  const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
  const data = qs.stringify({
    grant_type: 'client_credentials'
  });
 
  const config = {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64')
    }
  };
 
  try {
    const response = await axios.post(url, data, config);
    return `Bearer ${response.data.access_token}`;
  } catch (error) {
    console.log('getAccessToken');
    throw error;
  }
}

module.exports = {
  createOrder,
  getAccessToken
};
