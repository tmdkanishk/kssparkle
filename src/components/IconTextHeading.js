import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext'

const IconTextHeading = ({ width, height, borderRadius, backgroundColor, IconComponent, iconProps, title, text, onPressEvent }) => {
    const { Colors } = useCustomContext();
    return (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{
                width: width ? width : 50,
                height: height ? height : 50,
                borderRadius: borderRadius ? borderRadius : 25,
                backgroundColor: backgroundColor ? backgroundColor : Colors.paleSkyBlue,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {IconComponent && <IconComponent {...iconProps} />}
            </View>
            <View style={{ 'width': '80%' }}>
                <Text style={commonStyles.text_lg}>{title}</Text>
                {onPressEvent ? <TouchableOpacity onPress={() => onPressEvent()}>
                    <Text style={commonStyles.text}>{text}</Text>
                </TouchableOpacity> : <Text style={commonStyles.text}>{text}</Text>
                }
        </View>
        </View >
    )
}

export default IconTextHeading