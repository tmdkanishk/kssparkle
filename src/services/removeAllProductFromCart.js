import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData, _storeData } from '../utils/storage';

export const removeAllProductFromCart = async (cartIds, cart_remove) => {
    try {
        const url = `${BASE_URL}${cart_remove}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        // const user = await _retrieveData('USER');
        const user = await _retrieveData("CUSTOMER_ID");
        const sessionId = await _retrieveData('SESSION_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code,
            // customer_id: user ? user[0].customer_id : null,
            customer_id: user,
            sessionid: sessionId,
            cart_id: 0,
            cartids: cartIds
        }


        console.log("body", body);
        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};
