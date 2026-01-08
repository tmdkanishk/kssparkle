import axios, { HttpStatusCode } from "axios";
import { API_KEY, BASE_URL } from "../utils/config";
import { _retrieveData } from "../utils/storage";
import { useCustomContext } from "../hooks/CustomeContext";

export const getModuleData = async (route, position, endpointUrl) => {
   
    try {
        const url = `${BASE_URL}${endpointUrl}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const user = await _retrieveData("USER");
        const sessionId = await _retrieveData('SESSION_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        const body = {
            // code: lang?.code,
            // currency: cur?.code,
            // customer_id: user ? user[0]?.customer_id : null,
            sessionid: sessionId,
            route: route,
            position: position
        }

        console.log("url in getMOduleDATA", url, body)

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        throw error;
    }
}