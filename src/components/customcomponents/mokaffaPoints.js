import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const MokaffaPoints = () => {
    return (
        <View style={styles.footerTopRow}>
            <Text style={styles.pointsText}>Earn 157 Mokafaa Points</Text>
            <View style={styles.horizontalLine} />
        </View>
    )
}

const styles = StyleSheet.create({
   
    footerTopRow: {
        flexDirection: "row",       // ← align text + line horizontally
        alignItems: "center",       // ← vertically center both
        justifyContent: "flex-end", // ← move both to the right
    },
    pointsText: {
        color: "#fff",
        fontSize: 13,
        // marginBottom: 10,
    }, 
    horizontalLine: {
        height: 1,
        width: 50,
        backgroundColor: "#fff",
        marginLeft: 8,
        marginBottom: -10,
        marginRight: 10
    },
});
export default MokaffaPoints