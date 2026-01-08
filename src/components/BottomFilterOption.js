import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Colors from '../constants/Colors';
import commonStyles from '../constants/CommonStyles';
import CustomButton from './CustomButton';
import DropDownExpendableComponent from './DropDownExpendableComponent';


const BottomFilterOption = ({ onClickFilter, onClickClearBtn, selectedCheckBoxList, filterList, textLabel }) => {

    const [keyList, setkeyList] = useState([]);

    const [subIdList, setSubIdList] = useState(selectedCheckBoxList);

    // const filterOption = filterOptionData;
    // console.log("bottom filterList", filterList);

    return (

        <View style={[styles.bottomBtnContainer, { borderColor: Colors.darkGray }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
                    <Text style={commonStyles.textGray_lg}>{textLabel?.filter_label}</Text>
                    <TouchableOpacity onPress={() => onClickFilter([])}>
                        <Text style={commonStyles.textGray_lg}>{textLabel?.clearall_label}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginVertical: 12 }}>
                    {
                        filterList?.length > 0 ? (
                            filterList?.map((item, index) => (
                                <DropDownExpendableComponent
                                    data={item?.suboption}
                                    onClickDownArrow={() => {
                                        if (keyList.includes(index)) {
                                            setkeyList(keyList.filter(number => number !== index));
                                        } else {
                                            setkeyList([...keyList, index])
                                        }
                                    }}
                                    key={index}
                                    itemKey={index}
                                    itemkeyList={keyList}
                                    lable={item?.filtergroup_name}

                                    onClickCheckBox={(subId) => {
                                        if (subIdList.includes(subId)) {
                                            setSubIdList(subIdList.filter(number => number !== subId));
                                        } else {
                                            setSubIdList([...subIdList, subId])
                                        }
                                    }}

                                    subIdList={subIdList}
                                />
                            ))
                        ) : null
                    }
                </View>

                {
                    filterList?.length > 0 ? (
                        <View style={{ marginVertical: 12 }}>
                            <CustomButton
                                buttonText={textLabel?.refine_label}
                                buttonStyle={{ w: '100%', h: 46, backgroundColor: Colors.primary, borderRadius: 2 }}
                                OnClickButton={() => onClickFilter(subIdList)}
                            />
                        </View>
                    ) : null
                }






            </ScrollView>
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
        height: '40%',
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

export default BottomFilterOption



{/* <View style={{ marginVertical: 12 }}>
                    {
                        filterOption?.length > 0 ? (
                            filterOption.map((item, index) => (
                                <DropDownExpendableComponent
                                    data={item.subopt}
                                    onClickDownArrow={() => {
                                        if (keyList.includes(index)) {
                                            setkeyList(keyList.filter(number => number !== index));
                                        } else {
                                            setkeyList([...keyList, index])
                                        }

                                    }}
                                    key={index}
                                    itemKey={index}
                                    itemkeyList={keyList}
                                    lable={item.name}

                                    onClickCheckBox={(subId) => {
                                        if (subIdList.includes(subId)) {
                                            setSubIdList(subIdList.filter(number => number !== subId));
                                        } else {
                                            setSubIdList([...subIdList, subId])
                                        }
                                    }}

                                    subIdList={subIdList}
                                />
                            ))
                        ) : null
                    }
                </View> */}