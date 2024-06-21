import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../config'; // Import your Firebase configuration
import { phoneNumber } from './global';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      cnic: '',
      email: '',
      district: '',
      gender: '',
      age: '',
      address: '',
      loading: true,
      formChanged: false, 
      submitDisabled: true, 
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.fetchUserData();

    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', // Pink color for the header background
      },
      headerTintColor: '#fff',
    });
  }

  fetchUserData = async () => {
    console.log('Fetching user data for phone number:', phoneNumber);

    try {
      const userDoc = await db.collection('Profile').doc(phoneNumber).get();
      if (userDoc.exists) {
        console.log('User data retrieved from Firestore:', userDoc.data());
        const userData = userDoc.data();
        this.setState({
          ...userData,
          loading: false,
        });
      } else {
        console.log('No such document!');
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
      this.setState({ loading: false });
    }
  };

  handleFieldChange = () => {
    this.setState({ formChanged: true, submitDisabled: false });
  };

  handleSubmit = async () => {
    const { name, cnic, email, district, gender, age, address, formChanged } = this.state;
    const { navigation } = this.props;

    if (formChanged) {
      this.setState({ loading: true });

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
        this.setState({ loading: false });
        return;
      }
      if (!/^[a-zA-Z ]*$/.test(name)) {
        Alert.alert('Error', 'Name should contain alphabets only');
        this.setState({ loading: false });
        return;
      }
      if (!/^[0-9-]*$/.test(cnic)) {
        Alert.alert('Error', 'CNIC should contain numbers and dashes only');
        this.setState({ loading: false });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        this.setState({ loading: false });
        return;
      }
      if (!/^[0-9]*$/.test(age)) {
        Alert.alert('Error', 'Age should be a number');
        this.setState({ loading: false });
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
        this.setState({ loading: false });
      });
    } else {
      Alert.alert('Error', 'Please make changes to the form before submitting.');
    }
  };

  renderInputField = (placeholder, value, setValue, iconName, onChange) => (
    <View style={styles.inputContainer}>
      <Icon name={iconName} size={24} color="#800080" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#800080"
        value={value}
        onChangeText={(text) => {
          setValue(text);
          onChange && onChange();
        }}
        autoCapitalize="none"
        color="#800080"
      />
    </View>
  );

  render() {
    const { name, cnic, email, district, gender, age, address, loading, submitDisabled } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Update Profile</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#800080" />
        ) : (
          <>
            {this.renderInputField("Name", name, (text) => this.setState({ name: text }), "user", this.handleFieldChange)}
            {this.renderInputField("CNIC", cnic, (text) => this.setState({ cnic: text }), "address-card", this.handleFieldChange)}
            {this.renderInputField("Email", email, (text) => this.setState({ email: text }), "envelope", this.handleFieldChange)}
            {this.renderInputField("Enter Your District", district, (text) => this.setState({ district: text }), "globe", this.handleFieldChange)}
            {this.renderInputField("Enter Your Gender", gender, (text) => this.setState({ gender: text }), "transgender-alt", this.handleFieldChange)}
            {this.renderInputField("Enter Your Age", age, (text) => this.setState({ age: text }), "birthday-cake", this.handleFieldChange)}
            {this.renderInputField("Address", address, (text) => this.setState({ address: text }), "home", this.handleFieldChange)}
            <TouchableOpacity
              style={[styles.buttonContainer, submitDisabled && styles.disabledButton]}
              onPress={this.handleSubmit}
              disabled={submitDisabled}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    );
  }
}

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