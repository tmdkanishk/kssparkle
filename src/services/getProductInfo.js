import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const getProductInfo = async (productId, qty, keyOption, value, endpoint) => {
    try {
        console.log("getProductInfo calling")
        const url = `${BASE_URL}${endpoint}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const user = await _retrieveData('CUSTOMER_ID');
        const sessionId = await _retrieveData('SESSION_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code,
            sessionid: sessionId,
            customer_id: user ? user : null,
            product_id: productId,
            quantity: qty,
            [`option[${keyOption}]`]: value,
        }

        console.log("body", body, url);
        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        console.log(error)
        throw error;
    }
};
