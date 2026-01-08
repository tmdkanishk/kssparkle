import AsyncStorage from "@react-native-async-storage/async-storage";

export const _storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue,);
    } catch (error) {
        // Error saving data
    }
};

export const _retrieveData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);

        const jsonData = jsonValue != null ? JSON.parse(jsonValue) : null;
        return jsonData;
    } catch (error) {
        // Error retrieving data
        console.log('error', error.message);
    }
};

export const _clearData = async (key) => {
    try {
        const value = await AsyncStorage.removeItem(key);
        if (value !== null) {
            // We have data!!
            console.log(value);
            return value;
        }
    } catch (error) {
        // Error retrieving data
        console.log('error', error.message);
    }
};

export const _clearAllData = async () => {
    try {
        const value = await AsyncStorage.clear();
        if (value !== null) {
            // We have data!!
            return value;
        }
    } catch (error) {
        // Error retrieving data
        console.log('error', error.message);
    }
};