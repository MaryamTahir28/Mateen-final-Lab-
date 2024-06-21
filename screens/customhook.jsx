import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { collection, addDoc, query, getDocs, where, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config'; // Adjust the import based on your project structure

const useSendEmergencyAlert = (phoneNumber) => {
  const [loading, setLoading] = useState(false);

  const generateMapUrl = (latitude, longitude) => {
    const baseUrl = 'https://www.google.com/maps';
    const url = `${baseUrl}?q=${latitude},${longitude}`;
    return url;
  };

  const sendEmergencyAlert = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({});
      const locationUrl = generateMapUrl(location.coords.latitude, location.coords.longitude);

      if (locationUrl) {
        setLoading(true);
        const { latitude, longitude } = location.coords;
        const locationUrl = generateMapUrl(latitude, longitude);

        try {
          const profileDoc = await getDoc(doc(db, 'Profile', phoneNumber));
          const userName = profileDoc.exists() ? profileDoc.data().name : 'Unknown';

          const querySnapshot = await getDocs(query(collection(db, 'conversations'), where('participants', 'array-contains', phoneNumber)));

          // Send emergency message to existing conversations
          const updatePromises = querySnapshot.docs.map(async (cdoc) => {
            const conversationId = cdoc.id;

            console.log('Adding emergency message to conversation:', conversationId);

            await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
              _id: new Date().getTime().toString(),
              createdAt: new Date(),
              text: 'Help Needed, I am in danger. Here is My Current Location',
              user: { _id: phoneNumber, name: userName }
            });

            console.log('Updating last message in conversation:', conversationId);

            await setDoc(doc(db, 'conversations', conversationId), {
              participants: conversationId.split('_'),
              lastMessage: 'Help Needed, I am in danger. Here is My Current Location',
              lastMessageDate: new Date(),
            }, { merge: true });
          });

          await Promise.all(updatePromises);

          // Send location message to existing conversations
          const locationPromises = querySnapshot.docs.map(async (cdoc) => {
            const conversationId = cdoc.id;

            console.log('Adding location message to conversation:', conversationId);

            await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
              _id: new Date().getTime().toString(),
              createdAt: new Date(),
              text: locationUrl,
              user: { _id: phoneNumber, name: userName }
            });

            console.log('Updating last message in conversation:', conversationId);

            await setDoc(doc(db, 'conversations', conversationId), {
              participants: conversationId.split('_'),
              lastMessage: locationUrl,
              lastMessageDate: new Date(),
            }, { merge: true });
          });

          await Promise.all(locationPromises);

          // Check for uncontacted emergency contacts and send them the messages
          const emergencyContactsSnapshot = await getDocs(
            query(collection(db, 'emergencyContacts'), where('userPhoneNumber', '==', phoneNumber))
          );
          const emergencyContacts = emergencyContactsSnapshot.docs.map(doc => doc.data().phone);
          console.log('Emergency Contacts:', emergencyContacts);

          const conversationIDs = querySnapshot.docs.map(doc => doc.id);
          console.log('Conversation IDs:', conversationIDs);

          const isPhoneInConversation = (phone, conversationIDs) => {
            return conversationIDs.some(id => {
              const participants = id.split('_');
              return participants.includes(phone) && participants.includes(phoneNumber);
            });
          };

          const uncontactedEmergencies = emergencyContacts.filter(contact => {
            console.log(`Checking if contact ${contact} is in any conversation...`);
            return !isPhoneInConversation(contact, conversationIDs);
          });

          if (uncontactedEmergencies.length > 0) {
            console.log('There are emergency contacts with whom no chat has taken place:', uncontactedEmergencies);

            const uncontactedPromises = uncontactedEmergencies.map(async (contact) => {
              const conversationId = `${phoneNumber}_${contact}`;

              console.log('Creating new conversation and adding emergency message:', conversationId);

              await setDoc(doc(db, 'conversations', conversationId), {
                participants: [phoneNumber, contact],
                lastMessage: 'Help Needed, I am in danger. Here is My Current Location',
                lastMessageDate: new Date(),
              });

              await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
                _id: new Date().getTime().toString(),
                createdAt: new Date(),
                text: 'Help Needed, I am in danger. Here is My Current Location',
                user: { _id: phoneNumber, name: userName }
              });

              await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
                _id: new Date().getTime().toString(),
                createdAt: new Date(),
                text: locationUrl,
                user: { _id: phoneNumber, name: userName }
              });

              console.log('New conversation created and messages sent:', conversationId);
            });

            await Promise.all(uncontactedPromises);
          } else {
            console.log('All emergency contacts have been contacted.');
          }

          Alert.alert('Success', 'Emergency alert sent successfully');
        } catch (error) {
          console.error('Error sharing location:', error);
          Alert.alert('Error', 'Failed to share location');
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Location is not available.');
      }
    } catch (error) {
      console.error('Error sending location:', error);
      Alert.alert('Error', 'Failed to share location');
    }
  };

  return {
    sendEmergencyAlert,
    loading,
  };
};

export default useSendEmergencyAlert;
