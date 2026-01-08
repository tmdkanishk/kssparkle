import { View, Text, Linking, Alert } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import { IconComponentCallWithRing, IconComponentEmail, IconComponentOfficeBuilding } from '../constants/IconComponents'
import IconTextHeading from './IconTextHeading'
import { useCustomContext } from '../hooks/CustomeContext'

const ContactInformation = ({ text, textValue }) => {
    const { Colors } = useCustomContext();

    const handlePress = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
            Alert.alert('Error', 'Unable to open dialer')
        );
    };

    const handleEmailPress = (emailAddress) => {
        const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent('')}&body=${encodeURIComponent('')}`;

        Linking.openURL(emailUrl).catch((err) =>
            Alert.alert('Error', 'Unable to open email client')
        );
    };


    return (
        <View style={{ borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 5, paddingHorizontal: 12, gap: 18, paddingVertical: 12 }}>
            <View style={{ width: '100%', height: 50, justifyContent: 'center', borderBottomWidth: 1, borderColor: Colors.lightGray }}>
                <Text style={commonStyles.heading}>{text?.contactinfoheading}</Text>
            </View>

            <IconTextHeading IconComponent={IconComponentEmail} iconProps={{
                size: 30,
                color: Colors.primary
            }}
                title={text?.contactinfoemaillabel}
                text={textValue?.email}
                onPressEvent={() => handleEmailPress(textValue?.email)}
            />

            <IconTextHeading IconComponent={IconComponentCallWithRing} iconProps={{
                size: 28,
                color: Colors.primary
            }}
                title={text?.contactinfophonelabel}
                text={textValue?.telephone}
                onPressEvent={() => handlePress(textValue?.telephone)}
            />

            <IconTextHeading IconComponent={IconComponentOfficeBuilding} iconProps={{
                size: 30,
                color: Colors.primary
            }}
                title={text?.contactinfoaddreslabel}
                text={textValue?.address}
            />
        </View>
    )
}

export default ContactInformation