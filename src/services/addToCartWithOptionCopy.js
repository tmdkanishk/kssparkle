import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData, _storeData } from '../utils/storage';


export const addToCartWithOptionCopy = async (productid, quantity, radioData, checkboxData, selectData, textAreaData, cart_add) => {
    try {
        const url = `${BASE_URL}${cart_add}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const user = await _retrieveData("CUSTOMER_ID");
        const sessionId = await _retrieveData('SESSION_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code,
            customer_id: user ? user : null,
            product_id: productid,
            sessionid: sessionId,
            quantity: quantity ? quantity : "1",
        }

      const mergedObj = { ...body, ...radioData, ...checkboxData, ...selectData, ...textAreaData };

                           console.log("functions calling", mergedObj)

         console.log("function is hitting", url, mergedObj)
        
        const response = await axios.post(url, mergedObj, { headers: headers });


        if (response.status === HttpStatusCode.Ok) {
            await _storeData("CART_PRODUCT_COUNT", response.data?.cartproductcount);
            await _storeData("CART_PRODUCT_AMOUNT", response.data?.cartproducttotal);
            return response.data;
        }

    } catch (error) {
        console.log("error in addToCartWithOptionCopy", error.response.data)
        throw error;
    }

}

