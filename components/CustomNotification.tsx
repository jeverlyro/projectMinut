import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type NotificationType = 'success' | 'error' | 'info';

interface CustomNotificationProps {
  visible: boolean;
  type: NotificationType;
  message: string;
  onDismiss: () => void;
}

const CustomNotification: React.FC<CustomNotificationProps> = ({ 
  visible, 
  type, 
  message,
  onDismiss
}) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };
  
  const getIconName = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'info': return 'information-circle';
      default: return 'information-circle';
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'info': return '#2196f3';
      default: return '#2196f3';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: getBackgroundColor(),
          opacity: animation,
          transform: [
            { 
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              }) 
            }
          ]
        }
      ]}
    >
      <View style={styles.content}>
        <Icon name={getIconName()} size={24} color="white" />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Icon name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default CustomNotification;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
    fontFamily: 'GabaritoRegular',
  },
  closeButton: {
    padding: 5,
  }
});