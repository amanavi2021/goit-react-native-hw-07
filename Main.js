import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "./redux/auth/selectors";

import useRoute from "./useRoute";
import { authStateChanged } from "./redux/auth/operations";

export default function Main() {
  const { stateChanged } = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChanged());
  }, []);

  const routing = useRoute(stateChanged);

  return <NavigationContainer>{routing}</NavigationContainer>;
}
