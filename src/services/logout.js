import axios, { HttpStatusCode } from "axios";
import { API_KEY, BASE_URL } from "../utils/config";
import { _clearData, _retrieveData } from "../utils/storage";

export const logout = async (logout) => {
    try {
        const url = `${BASE_URL}${logout}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');


        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code
        }

        const response = await axios.post(url, body, { headers: headers });


        if (response.status === HttpStatusCode.Ok) {
            await _clearData('CART_PRODUCT_COUNT');
            await _clearData('CART_PRODUCT_AMOUNT');
            return response.data;
        }

    } catch (error) {
        throw error;
    }

}