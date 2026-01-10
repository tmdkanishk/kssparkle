import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const shareAllUrlProdcuts = async (productIds, share) => {
    try {

        const url = `${BASE_URL}${share}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        // const user = await _retrieveData('');
        const user = await _retrieveData("CUSTOMER_ID");
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
            // product_id: 0,
            product_ids: productIds
        }

        console.log("shareAllUrlProdcuts", body);

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};
