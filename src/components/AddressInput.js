import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../constants/Colors';
import DropDownHeading from './DropDownHeading';
import { Picker } from '@react-native-picker/picker';
import { getStates } from '../services/getStates';
import CustomButton from './CustomButton';
import { useCustomContext } from '../hooks/CustomeContext';

const AddressInput = ({ headingText, descText, selectCountryVlaue, setSelectedCountryValue, CountryList, isStatesList, setStateList, isPostCode, setPostCode, setZoneId }) => {
  const { Colors } = useCustomContext();

  const fetchStateList = async (countryId) => {
    try {
      // setLoading(true);
      console.log("isCountryId", selectCountryVlaue);
      const result = await getStates(countryId);
      console.log("zone list size", result?.zones);
      setStateList(result?.zones);
    } catch (error) {
      alert('something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <DropDownHeading headingText={headingText} />
      <View style={{ marginTop: 12 }} />
      <Text>{descText}</Text>

      <View style={{
        borderWidth: 1,      // Set border width here
        borderColor: Colors?.iconColor, // Set border color here
        height: 56,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        width: '100%',
        marginTop: 12
      }}>
        <Picker
          selectedValue={selectCountryVlaue}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: Colors?.inputFeildColor,
          }}
          onValueChange={(itemValue) => { fetchStateList(itemValue); setSelectedCountryValue(itemValue) }}
        >
          {
            CountryList?.length > 0 ? (
              CountryList?.map((item, index) => (
                <Picker.Item key={index} label={item?.name} value={item?.country_id} />
              ))
            ) : null
          }
        </Picker>
      </View>

      <View style={{
        borderWidth: 1,      // Set border width here
        borderColor: Colors.iconColor, // Set border color here
        height: 56,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        width: '100%',
        marginTop: 12
      }}>
        <Picker
          selectedValue={''}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: Colors?.inputFeildColor,
          }}
          onValueChange={(itemValue) => setZoneId(itemValue)}
        >
          <Picker.Item label={'-- Select state -- '} value={''} />
          {isStatesList?.length > 0 ? (
            isStatesList.map((item, index) => (

              <Picker.Item key={index} label={item?.name} value={item?.zone_id} />
            ))
          ) : null
          }

        </Picker>

      </View>

      <View style={{
        borderWidth: 1,      // Set border width here
        borderColor: Colors.iconColor, // Set border color here
        height: 56,
        borderRadius: 10,
        width: '100%',
        marginVertical: 12,
        paddingHorizontal: 12
      }}>
        <TextInput
          style={{ width: '100%', height: '100%' }}
          placeholder='Post Code'
          onChangeText={(code) => setPostCode(code)}
        />

      </View>

    </View>

  )
}

export default AddressInput