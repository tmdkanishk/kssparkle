import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import BackgroundWrapper from './BackgroundWrapper';
import { IconComponentClose } from '../../constants/IconComponents';
import GlassContainer from './GlassContainer';

const SelectModalField = ({
  label,
  required = false,
  value,
  data = [],
  error,
  onSelect,
  placeholder = 'Select',
  renderItemLabel = (item) => item?.name,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* FIELD */}
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          {required && <Text style={[styles.label, { color: 'red' }]}>*</Text>}
          <Text style={[styles.label, { color: '#fff' }]}>{label}</Text>
        </View>

        <GlassContainer padding={0.1}  style={{
          // borderWidth: 1,
          // height: 54,
          // justifyContent: 'center',
          // paddingLeft: 20,
          // borderRadius: 12,
          // backgroundColor: 'rgba(255,255,255,0.05)',
        }}>
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={[
              styles.input,
              { borderColor: error ? 'red' : 'rgba(255,255,255,0.6)' },
            ]}
          >
            <Text style={{ color: '#fff' }}>
              {value ? renderItemLabel(value) : placeholder}
            </Text>
          </TouchableOpacity>
        </GlassContainer>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>


      {/* MODAL */}
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={{ flex: 1 }}>

          {/* BLUR BACKGROUND */}
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={15}
            reducedTransparencyFallbackColor="rgba(0,0,0,0.6)"
          />

          {/* DARK OVERLAY */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          />

          {/* MODAL CONTENT */}
          <View
            style={{
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ width: '90%', height: '70%' }}>
              <BackgroundWrapper>

                {/* CLOSE BUTTON HEADER */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: 12,
                  }}
                >
                  <View />
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <IconComponentClose color="rgba(255,255,255,0.6)" />
                  </TouchableOpacity>
                </View>

                {/* LIST */}
                <FlatList
                  data={data}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ padding: 16, gap: 20 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        onSelect(item);
                        setVisible(false);
                      }}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255,255,255,0.6)',
                        paddingBottom: 12,
                      }}
                    >
                      <Text style={{ color: '#fff' }}>
                        {renderItemLabel(item)}
                      </Text>
                    </TouchableOpacity>
                  )}

                />

              </BackgroundWrapper>
            </View>
          </View>

        </View>
      </Modal>

    </>
  );
};

export default SelectModalField;


const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    // borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    paddingLeft: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  error: {
    color: 'red',
    marginTop: 6,
  },
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '90%',
    height: '80%',
  },
  itemText: {
    color: 'white',
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: 'rgba(255,255,255,0.6)',
  },
});
