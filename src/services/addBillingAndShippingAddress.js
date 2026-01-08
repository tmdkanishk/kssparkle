import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const addBillingAndShippingAddress = async (shippingAddressId, billingAddressId, checkout_Shippingandpaymentaddress) => {
    try {
        const url = `${BASE_URL}${checkout_Shippingandpaymentaddress}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData('USER');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code,
            sessionid: sessionId,
            customer_id: user ? user[0]?.customer_id : null,
            shipping_address_id: shippingAddressId,
            payment_address_id: billingAddressId
        }

        console.log("body of shipping and billing address api", body);

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }
};
