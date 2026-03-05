import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const getAllCouponCode = async (coupon_list) => {
    try {

        const url = `${BASE_URL}${coupon_list}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData('CUSTOMER_ID');
        // const user = await _retrieveData('USER');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };



        const body = {
            code: lang?.code,
            currency: cur?.code,
            sessionid: sessionId,
            // customer_id: user ? user[0]?.customer_id : null
            customer_id: user
        }

        console.log("coupon list post", body, url)

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            console.log("fetch coupon code data",response.data)
            return response.data;
        }
    } catch (error) {
        // 
        throw error;
    }
};
