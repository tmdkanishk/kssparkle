import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const searchProductsApi = async (query, search) => {
    try {
        const url = `${BASE_URL}${search}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData('CUSTOMER_ID');

        console.log("cur", cur);

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang,
            currency: cur,
            customer_id: user,
            sessionid: sessionId,
            search: query
        }
        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};
