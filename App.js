import "react-native-gesture-handler";
import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import { authMethods } from "./firebase/config";

import RegistrationScreen from "./screens/RegistrationScreen";
import LoginScreen from "./screens/LoginScreen";
import CommentsScreen from "./screens/nestedScreens/CommentsScreen";
import MapScreen from "./screens/nestedScreens/MapScreen";
// import PostsScreen from "./screens/PostsScreen";
// import Home from "./screens/Home";
import { selectUser } from "./redux/auth/selectors";
// import AddSvg from "./assets/images/add.svg";
import useRoute from "./useRoute";
import Main from "./Main";

export default function App() {
  const [fontLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  // const { user } = useSelector(selectUser);

  // const MainStack = createStackNavigator();
  // const AuthStack = createStackNavigator();
  // const routing = useRoute(true);

  if (!fontLoaded) {
    return null;
  }

  return (
    <Provider store={store.store}>
      <PersistGate
        loading={<Text>Loading...</Text>}
        persistor={store.persistor}
      >
        <Main />
        {/* <Text>Text</Text> */}

        {/* <NavigationContainer>
          {routing} */}
        {/* <MainStack.Navigator>
            <MainStack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{
                headerShown: false,
              }}
            />
            <MainStack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            /> */}
        {/* <MainStack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            /> */}
        {/* <MainStack.Screen
              name="Comments"
              component={CommentsScreen}
              options={{
                title: "Коментарі",
                headerTintColor: "#212121",
                headerTitleAlign: "center",
                headerTitleStyle: {
                  fontSize: 17,
                },
              }}
            /> */}
        {/* <MainStack.Screen
              name="Map"
              component={MapScreen}
              options={{
                title: "Мапа",
                headerTintColor: "#212121",
                headerTitleAlign: "center",
                headerTitleStyle: {
                  fontSize: 17,
                },
              }}
            /> */}
        {/* </MainStack.Navigator> */}
        {/* </NavigationContainer> */}
      </PersistGate>
    </Provider>
  );
}

// const styles = StyleSheet.create({
//   arrowSvg: {
//     position: "absolute",
//     left: -370,
//     top: -12,
//   },
// });
