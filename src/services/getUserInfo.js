import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const getUserInfo = async (accountdashboard_userdetailsedit) => {
    try {
        const url = `${BASE_URL}${accountdashboard_userdetailsedit}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData('CUSTOMER_ID');

        console.log("url", url)

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };
        const body = {
            code: lang?.code,
            currency: cur,
            sessionid: sessionId,
            customer_id: user,
        }
        console.log("body", body)
        const response = await axios.post(url, body, { headers: headers });
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }
    } catch (error) {
        throw error;
    }
};
