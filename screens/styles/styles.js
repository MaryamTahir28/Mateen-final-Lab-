// styles/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  conversationTextContainer: {
    flex: 1,
  },
  emergencyConversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800080',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800080',
  },
  conversationMessage: {
    fontSize: 14,
    color: 'plum',
  },
  conversationDate: {
    fontSize: 12,
    color: 'plum',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
