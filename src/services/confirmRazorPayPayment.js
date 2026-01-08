import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';

export const confirmRazorPayPayment = async (razorPayCredential, isRazorPayData, payment_razorpay_callback) => {
    try {
        const url = `${BASE_URL}${payment_razorpay_callback}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData('USER');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            code: lang?.code,
            currency: cur?.code,
            sessionid: sessionId,
            customer_id: user ? user[0]?.customer_id : null,
            payment_razorpay_key_id: razorPayCredential?.payment_razorpay_key_id,
            payment_razorpay_key_secret: razorPayCredential?.payment_razorpay_key_secret,
            razorpay_payment_id: isRazorPayData?.razorpay_payment_id,
            razorpay_signature: isRazorPayData?.razorpay_signature,
            razorpay_order_id: isRazorPayData?.razorpay_order_id
        }

        console.log("body order id", body)
        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }
};
