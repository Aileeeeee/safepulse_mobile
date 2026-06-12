import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { Text, View, Image } from 'react-native';

function TabIcon({ icon, label, focused }: {
  icon: any;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', gap: 4, marginTop: 6 }}>
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? Colors.primary : '#000000',
        }}
        resizeMode="contain"
      />
      <Text style={{
        fontSize: 11,
        color: focused ? Colors.primary : Colors.textMuted,
        fontWeight: focused ? '700' : '400',
      }}>
        {label}
      </Text>
    </View>
  );
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryMint,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require('../../assets/images/icon-home.png')}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require('../../assets/images/icon-contacts.png')}
              label="Contacts"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={require('../../assets/images/icon-settings.png')}
              label="Settings"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}