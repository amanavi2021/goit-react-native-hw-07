import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import GridSvg from "../assets/images/grid.svg";
import UserSvg from "../assets/images/user.svg";
import UnionSvg from "../assets/images/union.svg";
import ArrowSvg from "../assets/images/arrow-left.svg";

const Tabs = createBottomTabNavigator();

export default function Home() {
  const navigation = useNavigation();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Posts") {
            iconName = "";
            return <GridSvg />;
          }
          if (route.name === "CreatePosts") {
            iconName = "";
            return (
              <View style={styles.unionSvgWrapper}>
                <UnionSvg />
              </View>
            );
          }
          if (route.name === "Profile") {
            iconName = "";
            return <UserSvg />;
          }
        },
        tabBarLabelStyle: {
          display: "none",
        },
      })}
    >
      <Tabs.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          title: "Створити публікацію",
          headerTintColor: "#212121",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 17,
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ position: "relative" }}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <ArrowSvg style={styles.arrowSvg} width={25} height={25} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  unionSvgWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 9,
    marginBottom: 9,
    borderRadius: 20,
    backgroundColor: "#FF6C00",
    width: 70,
    height: 40,
  },
  logOutSvg: {
    position: "absolute",
    right: 16,
    top: -16,
  },
  arrowSvg: {
    position: "absolute",
    left: -370,
    top: -12,
  },
});
