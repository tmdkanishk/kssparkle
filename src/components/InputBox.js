import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { useCustomContext } from '../hooks/CustomeContext';

const InputBox = ({
    label,
    placeholder,
    inputStyle = {},
    InputType,
    textVlaue,
    openEyesIcon,
    closeEyesIcon,
    isShow,
    onClickEyesIcon,
    charLabel,
    onChangeText,
    multiline,
    editable,
    isRequired,
    ErrorMessage,
}) => {

    const { Colors } = useCustomContext();

    return (
        <View style={{ gap: 6 }}>
            {/* Label Row */}
            <View style={styles.labelRow}>
                <View style={styles.labelLeft}>
                    {isRequired && <Text style={styles.required}>* </Text>}
                    <Text style={styles.label}>{label}</Text>
                </View>

                {charLabel && <Text style={styles.charLabel}>{charLabel}</Text>}
            </View>

            {/* Input */}
            <View style={[styles.inputFieldContainer, {
                height: inputStyle.h || 48,
                paddingHorizontal: inputStyle.ph || 12,
                borderRadius: inputStyle.br || 12,
            }]}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    keyboardType={InputType}
                    secureTextEntry={isShow}
                    value={textVlaue}
                    onChangeText={onChangeText}
                    multiline={multiline || false}
                    editable={editable !== false}
                    style={[
                        styles.input,
                        {
                            width: openEyesIcon || closeEyesIcon ? '85%' : '100%',
                            height: multiline ? '100%' : '100%',
                        }
                    ]}
                />

                {(openEyesIcon || closeEyesIcon) && (
                    <TouchableOpacity onPress={onClickEyesIcon}>
                        {isShow ? openEyesIcon : closeEyesIcon}
                    </TouchableOpacity>
                )}
            </View>

            {/* Error */}
            {ErrorMessage && (
                <Text style={styles.error}>{ErrorMessage}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontWeight: '500',
    },
    required: {
        color: 'red',
    },
    charLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.6,
        borderColor: 'rgba(255,255,255,0.6)',
        backgroundColor: 'rgba(255,255,255,0.05)', // 🔥 subtle glass fill
    },
    input: {
        color: '#fff',
        fontSize: 15,
        paddingVertical: 0,
    },
    error: {
        color: '#ff6b6b',
        fontSize: 13,
        marginTop: 2,
    },
});

export default InputBox;
