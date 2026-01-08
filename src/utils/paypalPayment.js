import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from './config';
import { _retrieveData } from './storage';

// const PAYPAL_CLIENT_ID1 = 'AfnwNEWDMRV7ML4kUWpgiFXu4QPUiXPd9dRBGtX3jqTN7YQSjravT5Kglo7awOstuN5ITr7ng6fWsUqG';
// const PAYPAL_SECRET1 = 'EOSr_-oVh5JX16WWB05vl1Z_5xKt4ts1LX7lsOQ5U_XzV-cWwnGl7RRwaHc1znbgVxKtVdz21kq06OOO';
const BASE_URL_SEND_BOX = 'https://api-m.sandbox.paypal.com'; // Use live URL for production

// Get PayPal Access Token
const getPayPalAccessToken = async (PAYPAL_CLIENT_ID, PAYPAL_SECRET) => {
    try {
        const response = await axios.post(
            `${BASE_URL_SEND_BOX}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                auth: {
                    username: PAYPAL_CLIENT_ID,
                    password: PAYPAL_SECRET,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting PayPal access token:', error);
    }
};


const createPayPalOrder = async (CLIENT_ID, SECRET, amount, currencyType, orderId, user) => {
    const accessToken = await getPayPalAccessToken(CLIENT_ID, SECRET);

    if (!accessToken) return null;

    try {
        const response = await axios.post(
            `${BASE_URL_SEND_BOX}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                payer: {
                    email_address: user ? user[0]?.email : null, // Prefill email
                    phone: {
                        phone_type: 'MOBILE',
                        phone_number: {
                            national_number: user ? user[0]?.phoneno : null, // Prefill phone number
                        },
                    },
                },
                purchase_units: [
                    {
                        reference_id: orderId,
                        description: 'Purchase of product',
                        amount: {
                            currency_code: currencyType ? currencyType : 'USD',
                            value: amount.toString(),
                        },
                        shipping: {
                            name: {
                                full_name: user ? `${user[0]?.firstname} ${user[0]?.lastname}` : null,
                            },
                            // address: {
                            //     address_line_1: 'Tmd',
                            //     address_line_2: 'company',
                            //     admin_area_2: 'Ludhiana',
                            //     admin_area_1: 'Punjab',
                            //     postal_code: '141010',
                            //     country_code: 'IN',
                            // },
                            // phone: {
                            //     phone_number: '+918968714109',
                            // },
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getOrderId = async (payment_pp_pro) => {
    try {
        const url = `${BASE_URL}${payment_pp_pro}`;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {

        }

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
    } catch (error) {
        console.log("error", error.response.data);
        throw error;
    }
}


const captureOrder = async (orderID, clientId, secret) => {
    try {

        // Get Access Token
        const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
        const tokenResponse = await axios.post(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            "grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Capture Order
        const captureResponse = await axios.post(
            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Payment Captured:", captureResponse.data);
        return (captureResponse.data);
    } catch (error) {
        console.error("Payment Capture Failed:", error.response?.data || error.message);
        throw error;
    }
};



export {
    getPayPalAccessToken,
    createPayPalOrder,
    getOrderId,
    captureOrder
}
