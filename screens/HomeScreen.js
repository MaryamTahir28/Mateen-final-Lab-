import React, {useLayoutEffect , useEffect} from 'react';
import { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Linking , ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../ThemeContext';
import * as Location from 'expo-location';
import { phoneNumber , setnameglobal } from './global';
import { collection, addDoc, query, getDocs, where, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config';
import useSendEmergencyAlert from './customhook';

const HomeScreen = ({ navigation }) => {
  const { darkMode } = useTheme();
  const themeStyles = darkMode ? darkTheme : lightTheme;
  const [loading, setLoading] = useState(false);

useLayoutEffect(() => {
   navigation.setOptions({
    headerStyle: {
      backgroundColor: '#A94064', // Pink color for the header background
    },
    headerTintColor: '#fff', 
  });
}, [navigation]);

useEffect(() => {
  const fetchUserName = async () => {
    try {
      const userDoc = await db.collection('Profile').doc(phoneNumber).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const fetchedName = userData.name;
        //setName(fetchedName);
        setnameglobal(fetchedName); // Set the global username
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    } finally {
      setLoading(false);
    }
  }
  fetchUserName();
  }, []);


  const LoadingOverlay = () => (
    <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
      <ActivityIndicator size="large" color="#800080" />
    </View>
  );

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const generateMapUrl = (latitude, longitude) => {
    const baseUrl = 'https://www.google.com/maps';
    return `${baseUrl}?q=${latitude},${longitude}`;
  };

  const handleAlert = async () => {
    Alert.alert(
      "Emergency Alert",
      "Are you sure you want to send an emergency alert?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Send",
          onPress: async () => {
            useSendEmergencyAlert(phoneNumber);
          style: "destructive"
        }
      }
      ]
    );
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={[styles.container, themeStyles.container]}>
        <View style={[styles.titleBar, themeStyles.titleBar]}>
          <Text style={[styles.titleText, themeStyles.titleText]}>"Welcome to Women's Safety App"</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: 'white', borderColor: '#800080' }]}
            onPress={() => navigation.navigate('SafetyTips')}>
            <Text style={[styles.buttonText, themeStyles.buttonText]}>Safety Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: 'white', borderColor: '#800080' }]}
            onPress={() => navigation.navigate('ChatList')}>
            <Text style={[styles.buttonText, themeStyles.buttonText]}>Live Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: 'white', borderColor: '#800080' }]}
            onPress={() => {
                navigation.navigate('Resources');
            }}
          >
            <Text style={[styles.buttonText, themeStyles.buttonText]}>Resources</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.inputContainer, themeStyles.inputContainer]} onPress={() => navigation.navigate('Location')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4662/4662384.png' }}
            style={styles.inputIcon}
          />
          <Text style={[styles.inputText, themeStyles.inputText]}>GPS Tracking</Text>
          <Text style={[styles.arrowText, themeStyles.arrowText]}>{">"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.inputContainer, themeStyles.inputContainer]} onPress={() => navigation.navigate('EmergencyContact')}>
          <Image
            source={{ uri: 'https://www.vhv.rs/dpng/d/487-4876016_green-phone-icon-png-transparent-png.png' }}
            style={styles.inputIcon}
          />
          <Text style={[styles.inputText, themeStyles.inputText]}>Emergency Contacts</Text>
          <Text style={[styles.arrowText, themeStyles.arrowText]}>{">"}</Text>
        </TouchableOpacity>

        {/* Call Buttons */}
        <View style={styles.callButtonRow}>
          <TouchableOpacity style={[styles.callButton, themeStyles.callButton]} onPress={() => makeCall('1124')}>
            <View style={[styles.innerBorder, themeStyles.innerBorder]}>
              <Icon name="phone" size={20} color={themeStyles.iconColor.color} style={styles.iconStyle} />
              <View style={styles.textContainer}>
                <Text style={[styles.callButtonNumber, themeStyles.callButtonNumber]}>1124</Text>
                <Text style={[styles.callButtonLabel, themeStyles.callButtonLabel]}>Call Punjab Highway Patrol</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.callButton, themeStyles.callButton]} onPress={() => makeCall('1122')}>
            <View style={[styles.innerBorder, themeStyles.innerBorder]}>
              <Icon name="phone" size={20} color={themeStyles.iconColor.color} style={styles.iconStyle} />
              <View style={styles.textContainer}>
                <Text style={[styles.callButtonNumber, themeStyles.callButtonNumber]}>1122</Text>
                <Text style={[styles.callButtonLabel, themeStyles.callButtonLabel]}>Call Rescue Helpline</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.callButtonRow}>
          <TouchableOpacity style={[styles.callButton, themeStyles.callButton]} onPress={() => makeCall('130')}>
            <View style={[styles.innerBorder, themeStyles.innerBorder]}>
              <Icon name="phone" size={20} color={themeStyles.iconColor.color} style={styles.iconStyle} />
              <View style={styles.textContainer}>
                <Text style={[styles.callButtonNumber, themeStyles.callButtonNumber]}>130</Text>
                <Text style={[styles.callButtonLabel, themeStyles.callButtonLabel]}>Call Motorway Police</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.callButton, themeStyles.callButton]} onPress={() => makeCall('1991')}>
            <View style={[styles.innerBorder, themeStyles.innerBorder]}>
              <Icon name="phone" size={20} color={themeStyles.iconColor.color} style={styles.iconStyle} />
              <View style={styles.textContainer}>
                <Text style={[styles.callButtonNumber, themeStyles.callButtonNumber]}>1991</Text>
                <Text style={[styles.callButtonLabel, themeStyles.callButtonLabel]}>Call Cyber Crime Helpline</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* FooterBar */}
        <View style={[styles.footerBar, themeStyles.footerBar]}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('Profile')}>
            <Icon name="user" size={20} color="#800080" style={styles.footerIcon} />
            <Text style={[styles.footerButtonText, themeStyles.footerButtonText]}>Go to Profile</Text>
          </TouchableOpacity>

          {/* Alert Button */}
        <TouchableOpacity style={[styles.alertButton, { backgroundColor: '#DC143C', borderColor: '#DC143C' }]} onPress={handleAlert}>
          <Text style={[styles.buttonText, { color: 'white' }]}>Alert</Text>
        </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog" size={20} color="#800080" style={styles.footerIcon} />
            <Text style={[styles.footerButtonText, themeStyles.footerButtonText]}>Settings</Text>
          </TouchableOpacity>
        </View>
        {/* Conditional rendering of the loading overlay */}
        {loading && <LoadingOverlay />}
      </View>
    </ScrollView>
  );
};

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
  },
  titleBar: {
    backgroundColor: 'pink',
  },
  titleText: {
    color: 'white',
  },
  buttonText: {
    color: '#800080',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderColor: '#800080',
  },
  inputText: {
    color: '#800080',
  },
  arrowText: {
    color: '#800080',
  },
  callButton: {
    backgroundColor: 'white',
    borderColor: '#800080',
  },
  innerBorder: {
    borderColor: '#800080',
  },
  callButtonNumber: {
    color: '#800080',
  },
  callButtonLabel: {
    color: '#800080',
  },
  footerBar: {
    backgroundColor: 'pink',
  },
  footerButtonText: {
    color: '#800080',
  },
  iconColor: {
    color: '#800080',
  },
});


const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  titleBar: {
    backgroundColor: 'pink',
  },
  titleText: {
    color: '#ffffff',
  },
  buttonText: {
    color: '#800080',
  },
  inputContainer: {
    backgroundColor: '#1f1f1f',
    borderColor: '#800080',
  },
  inputText: {
    color: '#ffffff',
  },
  arrowText: {
    color: 'pink',
  },
  callButton: {
    backgroundColor: '#1f1f1f',
    borderColor: '#800080',
  },
  innerBorder: {
    borderColor: '#800080',
  },
  callButtonNumber: {
    color: '#ffffff',
  },
  callButtonLabel: {
    color: '#ffffff',
  },
  footerBar: {
    backgroundColor: 'pink',
  },
  footerButtonText: {
    color: '#800080',
  },
  iconColor: {
    color: 'pink',
  },
});

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 120,
  },
  titleBar: {
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 19,
    textAlign: 'center',
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
  },
  circleButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 6,
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: '90%',
    marginBottom: 20,
    justifyContent: 'space-between', 
  },
  inputIcon: {
    width: 20,
    height: 20,
  },
  inputText: {
    fontSize: 16,
    flex: 1, 
    paddingLeft: 10,
  },
  arrowText: {
    fontSize: 16,
  },
  callButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '94%',
    marginTop: 10,
    marginBottom: 20,
  },
  callButton: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
    flexDirection: 'row', 
    alignItems: 'center',  
    justifyContent: 'flex-start', 
    width: '45%',
    margin: 5,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 10, 
  },
  textContainer: {
    flexDirection: 'column',
    flexShrink: 1, 
  },
  callButtonNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  callButtonLabel: {
    fontSize: 13,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  footerButton: {
    padding: 15,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footerIcon: {
    marginBottom: 5,
  },
  alertButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    borderWidth: 6,
    padding: 10,
    position: 'relative', 
    top: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.50,
    shadowRadius: 5.65,
    elevation: 8,
  },
});

export default HomeScreen;
