import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const SquareIconComponent = ({width,height,borderRadius,backgroundColor, onClickIcon, IconComponent, iconProps}) => {
   
    return (
    <TouchableOpacity style={{ 
        backgroundColor: backgroundColor?backgroundColor:Colors.primary, 
        width: width?width:40, 
        height:height?height:40, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: borderRadius?borderRadius:5 
         }} onPress={()=>onClickIcon()}>

        {IconComponent && <IconComponent {...iconProps} />}
       
    </TouchableOpacity>
 
  )
}

export default SquareIconComponent