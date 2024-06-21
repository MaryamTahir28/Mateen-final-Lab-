// hooks/useChatData.js
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../config'; // Adjust the path according to your file structure

const useChatData = (userPhone, predefinedContacts) => {
  const [conversations, setConversations] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchConversations = () => {
      const q = query(collection(db, 'conversations'), where('participants', 'array-contains', userPhone));
      return onSnapshot(q, querySnapshot => {
        const convos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setConversations(convos);
      });
    };

    const fetchEmergencyContacts = async () => {
      const q = query(collection(db, 'emergencyContacts'), where('userPhone', '==', userPhone));
      const querySnapshot = await getDocs(q);
      const contacts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmergencyContacts(contacts);
    };

    const unsubscribeConversations = fetchConversations();
    fetchEmergencyContacts().then(() => setLoading(false));

    return () => {
      unsubscribeConversations();
    };
  }, [userPhone]);

  const filteredPredefinedContacts = predefinedContacts.filter(contact => contact.phone !== userPhone);

  const combinedData = filteredPredefinedContacts.concat(emergencyContacts).map(contact => {
    const conversation = conversations.find(convo => convo.participants.includes(contact.phone));
    return {
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      lastMessage: conversation ? conversation.lastMessage : null,
      lastMessageDate: conversation ? conversation.lastMessageDate : null,
    };
  }).concat(conversations.filter(convo => ![...filteredPredefinedContacts, ...emergencyContacts].some(contact => contact.phone === convo.participants.find(p => p !== userPhone)))
    .map(convo => ({
      id: convo.id,
      name: convo.participants.find(p => p !== userPhone),
      phone: convo.participants.find(p => p !== userPhone),
      lastMessage: convo.lastMessage,
      lastMessageDate: convo.lastMessageDate,
    })));

  return { combinedData, loading };
};

export default useChatData;
