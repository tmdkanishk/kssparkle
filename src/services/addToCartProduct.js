import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData, _storeData } from '../utils/storage';


export const addToCartProduct = async (productid, quantity, cart_add) => {
    try {
        const url = `${BASE_URL}${cart_add}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const user = await _retrieveData("USER");
        const sessionId = await _retrieveData('SESSION_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            // code: lang?.code || null,
            // currency: cur?.code || null,
            // customer_id: user ? user[0]?.customer_id : null,
            product_id: productid,
            sessionid: sessionId,
            quantity: quantity ? quantity : 1
        }
        console.log("product detail body", body, url);
        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            console.log("addToCartProduct response", response?.data)
            return response.data;
        }
    } catch (error) {
        console.log("error addToCartProduct", error.response)
        throw error;
    }

}

