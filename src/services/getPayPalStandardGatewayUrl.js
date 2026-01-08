import axios, { HttpStatusCode } from "axios";
import { API_KEY, BASE_URL } from "../utils/config";
import { _retrieveData } from "../utils/storage";

export const getPayPalStandardGatewayUrl = async (orderId, payment_pp_standard) => {
    try {
        const url = `${BASE_URL}${payment_pp_standard}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const user = await _retrieveData("USER");
        const sessionId = await _retrieveData("SESSION_ID");

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code,
            customer_id: user ? user[0]?.customer_id : null,
            sessionid: sessionId,   
            order_id: orderId
        
        }

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data
        }
    } catch (error) {
        throw error;
    }
}