import axios, { HttpStatusCode } from 'axios';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData, _storeData } from '../utils/storage';
import { convertImageToBase64 } from '../utils/helpers';

export const updateUserInfomation = async (userInfo, accountdashboard_userdetailseditValidation) => {
    try {
        const url = `${BASE_URL}${accountdashboard_userdetailseditValidation}`;
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        const sessionId = await _retrieveData('SESSION_ID');
        const user = await _retrieveData('CUSTOMER_ID');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Key: API_KEY,
        };

        userInfo['customer_id'] = user;
        userInfo['code'] = lang?.code;
        userInfo['currency'] = cur?.code;
        userInfo['sessionid'] = sessionId;

        await convertImageToBase64(userInfo?.image).then((base64) => {
            userInfo['image'] = `data:image/jpeg;base64,${base64}`;
        });

        console.log("url", url, userInfo)

        // console.log('base64', userInfo);

        const response = await axios.post(url, userInfo, { headers: headers });



        if (response.status === HttpStatusCode.Ok) {
            delete userInfo.code;
            delete userInfo.currency;
            delete userInfo.sessionid;
            delete userInfo.image;
            console.log("userInfo", userInfo);
            await _storeData('USER', [userInfo]);
            console.log("response.data", response.data)
            return response.data;
        }

    } catch (error) {
        throw error;
    }
};
