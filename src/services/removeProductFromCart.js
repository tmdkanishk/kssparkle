import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData, _storeData } from '../utils/storage';

export const removeProductFromCart = async (cartId, cart_remove) => {
    try {
        const url = `${BASE_URL}${cart_remove}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const user = await _retrieveData('USER');
         const sessionId = await _retrieveData('SESSION_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code,
            customer_id: user ? user[0].customer_id : null,
            sessionid: sessionId,
            cart_id: cartId,
        }
        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            await _storeData("CART_PRODUCT_COUNT", response.data?.cartproductcount);
            await _storeData("CART_PRODUCT_AMOUNT", response.data?.cartproducttotal);
            return response.data;
        }

    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};
