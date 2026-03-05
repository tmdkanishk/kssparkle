import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const addBillingAndShippingAddress = async (
    shippingAddressId,
    billingAddressId,
    checkout_Shippingandpaymentaddress,
    giftDetails = null
) => {

    try {
        const url = `${BASE_URL}${checkout_Shippingandpaymentaddress}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData('CUSTOMER_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };
        const body = {
            code: lang?.code,
            currency: cur?.code,
            sessionid: sessionId,
            customer_id: user ? user : null,
            shipping_address_id: shippingAddressId,
            payment_address_id: billingAddressId,
            gift_flag:0
        }; 


        if (giftDetails) {
            body.gift_flag = 1
            body.gift_full_name = giftDetails.fullName;
            body.gift_phone = giftDetails.phone;
            body.gift_address = giftDetails.address;
            body.gift_city = giftDetails.city;
            body.gift_postcode = giftDetails.postCode;
            body.gift_message = giftDetails.message;
        }



        console.log("body of shipping and billing address api", body, url);

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            console.log("body of shipping and billing address api", body, url, response?.data);
            return response.data;
        }

    } catch (error) {
        throw error;
    }
};
