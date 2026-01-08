import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';


export const checkSessionStatus = async () => {
    try {
        const url = 'https://beddenplein4045.nl/index.php?route=extension/restapi/checksession';
       
        const sessionId = await _retrieveData('SESSION_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };
        const body = {
            sessionid: sessionId
        }

        const response = await axios.post(url, body, { headers: headers });

        if (response.status === HttpStatusCode.Ok) {
            return response.data;
        }

    } catch (error) {
        console.error('Error searching products option:', error);
        throw error;
    }

}