import axios, { HttpStatusCode } from "axios";
import { API_KEY, BASE_URL } from "../utils/config";
import { _retrieveData } from "../utils/storage";

export const verifyOtp = async (otpCheck, telephone, code, otpCodeFromBackend) => {
    try {
        const url = `${BASE_URL}${otpCheck}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData("USER");

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            // code: lang?.code,
            // currency: cur?.code,
            sessionid: sessionId,
            telephone: telephone || "",
            otp:code || "",
            otpcode: otpCodeFromBackend || ""
            // customer_id: user ? user[0]?.customer_id : null,
            // email: email,
            // password: password
        }


        console.log("body verifyOtp", body,  url);


        const response = await axios.post(url, body, { headers: headers });


        if (response.status === HttpStatusCode.Ok) {
            console.log("respnse of verify Otp", response.data)
            return response.data;
        }

    } catch (error) {
        throw error;
    }

}