import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const getOrderHistoryAndText = async (page, order_orderhistory) => {
    try {
        const url = `${BASE_URL}${order_orderhistory}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData("CUSTOMER_ID");

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur,
            customer_id: user ? user: null,
            sessionid: sessionId,
            page: page
        }

        console.log("body text", body, url);

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }
};
