import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const getCategoryProducts = async (path, page, order, sort, endpoint) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
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
            path: path,
            order: order,
            sort: sort,
            page: page
        }


        console.log("body of category product", url, body);

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }
};