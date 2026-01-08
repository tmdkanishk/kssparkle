import React, { useState } from 'react'
import CustomDropdown from './CustomDropdown';

const Qty = () => {
    return (
        // <View style={{ borderWidth: 1, width: '35%', height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderColor: Colors.lightGray, borderRadius: 6 }}>
        //     <Text style={commonStyles.text_lg}>Qty</Text>
        //     <IconComponentDownArrow size={18} />
        // </View>
        <CustomDropdown 
        items={[1,2,3,4]} 
        borderColor={Colors.lightGray} 
        backgroundColor={Colors.white} 
        borderRadius={8} 
        pickerWidth={'100%'}
        alignItems={'center'}
        width={'100%'}
        hidelable={true}
        />
    )
  
};




export default Qty