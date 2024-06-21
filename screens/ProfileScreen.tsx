import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config'; // Import your Firebase configuration
import { phoneNumber } from './global';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [cnic, setCnic] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [formChanged, setFormChanged] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', // Pink color for the header background
      },
      headerTintColor: '#fff',
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Fetching user data for phone number:', phoneNumber);

      try {
        const userDoc = await db.collection('Profile').doc(phoneNumber).get();
        if (userDoc.exists) {
          console.log('User data retrieved from Firestore:', userDoc.data());
          const userData = userDoc.data();
          setName(userData?.name || '');
          setCnic(userData?.cnic || '');
          setEmail(userData?.email || '');
          setDistrict(userData?.district || '');
          setGender(userData?.gender || '');
          setAge(userData?.age || '');
          setAddress(userData?.address || '');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFieldChange = () => {
    setFormChanged(true);
    setSubmitDisabled(false); // Enable submit button when any field changes
  };

  const handleSubmit = async () => {
    if (formChanged) {
      setLoading(true); // Enable loading state when submit is clicked
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        if (
          !name ||
          !cnic ||
          !email ||
          !district ||
          !gender ||
          !age ||
          !address
        ) {
          Alert.alert('Error', 'All fields are required');
          setLoading(false);
          return;
        }
        if (!/^[a-zA-Z ]*$/.test(name)) {
          Alert.alert('Error', 'Name should contain alphabets only');
          setLoading(false);
          return;
        }
        if (!/^[0-9-]*$/.test(cnic)) {
          Alert.alert('Error', 'CNIC should contain numbers and dashes only');
          setLoading(false);
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Alert.alert('Error', 'Please enter a valid email address');
          setLoading(false);
          return;
        }
        if (!/^[0-9]*$/.test(age)) {
          Alert.alert('Error', 'Age should be a number');
          setLoading(false);
          return;
        }

        const userDataRef = db.collection('Profile').doc(phoneNumber);
        userDataRef.set({
          name,
          cnic,
          email,
          district,
          gender,
          age,
          address,
        }).then(() => {
          console.log('User data saved successfully!');
          Alert.alert('Success', 'User data saved successfully!');
          navigation.replace('Home');
        }).catch((error) => {
          console.error('Error saving user data:', error);
          Alert.alert('Error', 'Failed to save user data');
        }).finally(() => {
          setLoading(false);
        });
      } else {
        Alert.alert('Error', 'User is not logged in');
      }
    } else {
      Alert.alert('Error', 'Please make changes to the form before submitting.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#800080" />
      ) : (
        <>
          {renderInputField("Name", name, setName, "user", handleFieldChange)}
          {renderInputField("CNIC", cnic, setCnic, "address-card", handleFieldChange)}
          {renderInputField("Email", email, setEmail, "envelope", handleFieldChange)}
          {renderInputField("Enter Your District", district, setDistrict, "globe", handleFieldChange)}
          {renderInputField("Enter Your Gender", gender, setGender, "transgender-alt", handleFieldChange)}
          {renderInputField("Enter Your Age", age, setAge, "birthday-cake", handleFieldChange)}
          {renderInputField("Address", address, setAddress, "home", handleFieldChange)}
          <TouchableOpacity
            style={[styles.buttonContainer, submitDisabled && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={submitDisabled}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

// Function to render input field
const renderInputField = (
  placeholder: string,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  iconName: string,
  onChange: () => void
) => (
  <View style={styles.inputContainer}>
    <Icon name={iconName} size={24} color="#800080" />
    <TextInput
       style={[styles.input, {color: '#800080'}]} // Move color to the style prop
      placeholder={placeholder}
      placeholderTextColor="#800080"
      value={value}
      onChangeText={(text) => { setValue(text); onChange && onChange(); }} // Call handleFieldChange on input change
      autoCapitalize="none"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'pink',
    color: 'white',
    padding: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
    borderColor: 'pink',
    borderWidth: 2,
    fontFamily: 'serif',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'pink',
    borderRadius: 5,
    width: '100%',
    padding: 5,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#800080',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'pink',
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '30%',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    padding: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default ProfileScreen;
