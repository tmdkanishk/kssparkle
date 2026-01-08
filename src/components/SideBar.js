import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import React, { useCallback, useState } from 'react'
import { IconComponentClose, IconComponentEyesLine, IconComponentImage } from '../constants/IconComponents';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomContext } from '../hooks/CustomeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { _retrieveData } from '../utils/storage';


const SideBar = ({ isVisible, toggleSidebar, onClickLogout, onClickLogin, navigation }) => {
  const { Colors, Features, Menu } = useCustomContext();
  const [isLogin, setLogin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkUserLogin();
    }, [])
  );

  const checkUserLogin = async () => {
    const data = await _retrieveData("USER");
    if (data != null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }


  const onClickMenu = (menuName) => {
    if (menuName === 'Login') {
      onClickLogin();
      toggleSidebar();
    } if (menuName === 'Logout') {
      onClickLogout();
      toggleSidebar();
    } else {
      navigation.navigate(menuName);
      toggleSidebar();
    }
  }


  const translateX = new Animated.Value(-300); // Start off-screen


  // Animate the sidebar based on its visibility
  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();

    } else {
      Animated.timing(translateX, {
        toValue: -300,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    // transform: [{ translateX }],
    <Animated.View style={[styles.sidebar, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <View style={{ flexDirection: 'row', height: '100%' }}>
        <View style={styles.menuContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
              <IconComponentClose color={'black'} size={28} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: Features?.menu_logo_width, height: Features?.menu_logo_height, }}>
                {
                  Features?.menu_logo ? (
                    <Image source={{ uri: Features.menu_logo }} style={{ resizeMode: 'cover', width: '100%', height: '100%' }} />
                  ) : <IconComponentImage />
                }
              </View>
            </View>
            {
              Menu?.length > 0 ? (
                Menu?.filter(item => !(isLogin && item?.pagename === "Login") && !(!isLogin && item?.pagename === "AccountDashboard") && !(!isLogin && item?.pagename === "Logout")).map((item, index) => (
                  item?.status && <TouchableOpacity key={index} onPress={() => onClickMenu(item?.pagename)} style={{ borderBottomWidth: 1, borderColor: Colors?.border_color, height: 70, width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>
                    <View style={{ backgroundColor: Colors?.menuBackground, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                      <FontAwesome name={item?.icon} size={24} color={Colors?.menuName || "black"} />
                    </View>
                    <Text style={{ fontSize: 18, color: Colors?.menuName, fontWeight: '400' }}>{item?.label}</Text>
                  </TouchableOpacity>
                ))
              ) : null
            }
          </ScrollView>
        </View>
        <TouchableOpacity onPress={toggleSidebar} style={{ width: '30%', height: '100%', }} />
      </View>

    </Animated.View>
  )
}


const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
    alignItems: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  menuContainer: {
    paddingVertical: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    padding: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: '#000',
  },
});

export default SideBar