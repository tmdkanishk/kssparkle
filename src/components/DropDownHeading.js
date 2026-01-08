import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { IconComponentDownArrow, IconComponentUpArrow } from '../constants/IconComponents'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext'

const DropDownHeading = ({ headingText, onClickIcon, isShowIcon }) => {
  const { Colors } = useCustomContext();
  return (
    <TouchableOpacity onPress={() => onClickIcon()} style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.softGray, height: 50, alignItems: 'center', padding: 12 }}>
      <Text style={commonStyles.smallHeading}>{headingText ? headingText : 'Use Coupon Code'}</Text>
      {
        isShowIcon ? (
          <IconComponentUpArrow />
        ) : <IconComponentDownArrow />
      }

    </TouchableOpacity>
  )
}

export default DropDownHeading