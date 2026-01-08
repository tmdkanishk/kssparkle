import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext'
import { IconComponentImage } from '../constants/IconComponents'

const CategoryLayout2 = ({ onClick, text, img }) => {
    const {Colors} = useCustomContext();

    return (
        <TouchableOpacity onPress={onClick}  style={{ width: '48%', height: 200, borderRadius: 6, justifyContent: 'space-between' }}>

            <View style={{ height: '70%', width: '100%' }}>
                <ImageBackground
                    source={require('../assets/images/cartbg.png')}
                    resizeMode='cover'
                    style={{
                        width: '100%', height: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6,
                        overflow: 'hidden',
                    }}>
                    <View style={{ width: '100%', height: '100%', alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
                         {
                                            img ? (
                                                <Image source={{ uri: img }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                            ) : (
                                               <IconComponentImage />
                                            )
                                        }
                    </View>
                </ImageBackground>
            </View>

            <View style={{ borderBottomLeftRadius: 6, borderBottomRightRadius: 6, backgroundColor: Colors.primary, width: '100%', alignItems: 'center', justifyContent: 'center', height: '30%' }}>
                <Text style={commonStyles.textWhiteBold}>{text}</Text>
                {/* <Text style={commonStyles.textwhite}>Shop Now</Text> */}
            </View>
        </TouchableOpacity>
    )
}

export default CategoryLayout2