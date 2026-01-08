import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const applyShippingMethod = async (shippingMethod, shippingTitle, cart_shipping) => {
    try {
        const url = `${BASE_URL}${cart_shipping}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const user = await _retrieveData("USER");
        const sessionId = await _retrieveData('SESSION_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code,
            customer_id: user[0]?.customer_id,
            sessionid: sessionId,
            shipping_method: shippingMethod,
            shipping_method_title: shippingTitle
        }

        console.log("body", body);

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }
};
