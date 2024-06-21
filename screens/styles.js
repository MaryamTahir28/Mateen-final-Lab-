import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    screen: {
        flex: 1,
      },
      titleBar: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleBarText: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'serif',
      },
      container: {
        flex: 1,
        marginHorizontal: 10,
      },
      header: {
        padding: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#cccccc',
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
      },
      title: {
        fontSize: 16,
      }
    });