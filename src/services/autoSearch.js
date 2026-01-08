import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const autoSearch = async (query, search) => {
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
            code: lang?.code,
            currency: cur,
            customer_id: user,
            sessionid: sessionId,
            search: query
        }
        console.log("body,url", body, url)
        const response = await axios.post(url, body, { headers: headers });

        console.log("response.data", response.data)
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }
};