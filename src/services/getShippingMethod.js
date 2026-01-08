import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const getShippingMethod = async (countryId, zodeId, postCode, cart_estimateshipping) => {
    try {
        const url = `${BASE_URL}${cart_estimateshipping}`;
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
            sessionid: sessionId,
            customer_id: user ? user[0]?.customer_id : null,
            country_id: countryId,
            zone_id: zodeId,
            postcode: postCode ? postCode : null
        }

        console.log("body", body);

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
       throw error;
    }
};
