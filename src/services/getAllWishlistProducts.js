import axios, { HttpStatusCode } from "axios";
import { API_KEY, BASE_URL } from "../utils/config";
import { _retrieveData } from "../utils/storage";

export const getAllWishlistProducts = async (accountdashboard_getAllWishlists) => {
    try {

        const url = `${BASE_URL}${accountdashboard_getAllWishlists}`;
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
            currency: cur,
            customer_id: user,
            sessionId: sessionId,
        }

        console.log("body  reepu indita", body, url)

        const response = await axios.post(url, body, { headers: headers });
        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }
}