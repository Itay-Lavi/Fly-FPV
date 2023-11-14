const axios = require('axios');
const qs = require('qs');

async function createOrder(accessToken, cart, userData) {
  const url = 'https://api-m.sandbox.paypal.com/v2/checkout/orders';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: accessToken,
  };

  const address = userData.address;

  const data = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: cart.totalPrice,
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: cart.totalPrice,
            },
          },
        },
        items: cart.items.map((item) => ({
          name: item.product.title,
          unit_amount: {
            currency_code: 'USD',
            value: item.product.price,
          },
          quantity: item.quantity,
        })),
        shipping: {
          name: {
            full_name: userData.name,
          },
          address: {
            address_line_1: address.street,
            admin_area_2: address.city,
            postal_code: address.postalCode,
            country_code: 'IL',
          },
        },
      },
    ],

    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
          brand_name: 'FlyFPV',
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
    throw error;
  }
  const responseData = {
    id: response.data.id,
    payerLink: response.data.links.find((link) => link.rel === 'payer-action')
      .href,
  };
  return responseData;
}

async function getAccessToken() {
  const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
  const data = qs.stringify({
    grant_type: 'client_credentials',
  });

  const config = {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString(
          'base64'
        ),
    },
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
  getAccessToken,
};
