import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../constants/Colors';
import commonStyles from '../constants/CommonStyles';
import CustomButton from './CustomButton';
import TouchableButton from './TouchableButton';
import { sortbtn } from '../utils/testData';

const BottomSortFilter = ({ onClick, sortsList, onClickRefineBtn, textLabel }) => {


    return (
        <View style={[styles.bottomBtnContainer, { borderColor: Colors.darkGray }]}>
            <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderColor: Colors.gray }}>
                <Text style={commonStyles.textGray_lg}>{textLabel?.sortby_label}</Text>
            </View>

            <View style={{ marginVertical: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                {
                    sortsList?.length > 0 ? (
                        sortsList.map((item, index) => (
                            <TouchableButton btnText={item?.text} key={index} onclick={() => onClick(item?.sort, item?.order)} />
                        ))
                    ) : null
                }

            </View>
            <CustomButton
                OnClickButton={() => onClickRefineBtn()}
                buttonText={textLabel?.refine_label}
                buttonStyle={{ w: '100%', h: 46, backgroundColor: Colors.primary, borderRadius: 2 }}
            />
        </View>
    )
}



const styles = StyleSheet.create({

    bottomBtnContainer: {
        position: 'absolute',
        bottom: '9%',
        width: '100%',
        // borderColor: '#F5F5F5',
        borderWidth: 1,
        padding: 10,
        opacity: 1,
        alignSelf: 'center',
        height: 'auto',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,

        shadowOffset: {
            width: 0,
            height: 4, // Adjust this for bottom shadow
        },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 20,
        shadowColor: '#000',
    }

})

export default BottomSortFilter