import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { IconComponentCheckSquare, IconComponentDownArrow, IconComponentSquare } from '../constants/IconComponents'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext'

const DropDownExpendableComponent = ({ lable, data, onClickDownArrow , onClickCheckBox, itemKey, itemkeyList , subIdList}) => {
  const {Colors} = useCustomContext();
  const dataList = data;

  console.log("dataList", dataList);
  console.log("subIdList", subIdList);
  return (
    <View>

      <TouchableOpacity onPress={onClickDownArrow} style={{ height: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: Colors.lightGray }}>
        <Text style={commonStyles.text_lg}>{lable ? lable : 'Lable'}</Text>
        <IconComponentDownArrow />
      </TouchableOpacity>

      
      {
        dataList && itemkeyList.includes(itemKey) ? (

          dataList.map((item, index) => (
            <View style={{flexDirection:'row', gap:10, marginTop:12}} key={index}>
              <TouchableOpacity onPress={()=>onClickCheckBox(item?.filter_id)}>
                {
                  subIdList.includes(item?.filter_id) ? (
                    <IconComponentCheckSquare />
                  ) : <IconComponentSquare />
                }
              </TouchableOpacity>
              <Text>{item?.name}</Text>
            </View>
          ))

        ):null
        
      }

    </View>
  )
}

export default DropDownExpendableComponent