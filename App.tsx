import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SingleProfileScreen } from "./src/screens/profiles/SingleProfileScreen";
import { BodyConditionScreen } from "./src/screens/tabs/BodyConditionScreen";
import { VetVisitsScreen } from "./src/screens/tabs/VetVisitsScreen";
import { WeightLogsScreen } from "./src/screens/tabs/WeightLogsScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SingleProfile"
        component={SingleProfileScreen}
        options={{ title: "Pet Profile" }}
        initialParams={{ id: "1" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case "Profile":
                iconName = "dog";
                break;
              case "Body Condition":
                iconName = "heart-pulse";
                break;
              case "Vet Visits":
                iconName = "stethoscope";
                break;
              case "Weight Logs":
                iconName = "scale-bathroom";
                break;
              default:
                iconName = "help";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#6200ea",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Profile" component={ProfileStack} />
        <Tab.Screen name="Body Condition" component={BodyConditionScreen} />
        <Tab.Screen name="Vet Visits" component={VetVisitsScreen} />
        <Tab.Screen name="Weight Logs" component={WeightLogsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
