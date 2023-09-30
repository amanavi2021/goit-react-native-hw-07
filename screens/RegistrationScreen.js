import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/auth/selectors";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
} from "react-native";
import { registerDB } from "../redux/auth/operations";
import { onAuthStateChanged } from "firebase/auth";
import AddSvg from "../assets/images/add.svg";

const initialState = {
  login: "",
  email: "",
  password: "",
};

export default function RegistrationScreen() {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [showPassword, setIsShowPassword] = useState(false);
  const [state, setState] = useState(initialState);
  const [hasFocusLogin, setHasFocusLogin] = useState(false);
  const [hasFocusEmail, setHasFocusEmail] = useState(false);
  const [hasFocusPassword, setHasFocusPassword] = useState(false);
  const [user, setUser] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userId } = useSelector(selectUser);

  const handleSubmit = () => {
    keyboardHide();
    dispatch(registerDB(state));

    const authStateChanged = async (onChange = () => {}) => {
      onAuthStateChanged(async (user) => {
        onChange(user);
      });
    };

    setState(initialState);
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleFocusLogin = () => {
    setIsShowKeyboard(true);
    setHasFocusLogin(true);
  };

  const handleFocusEmail = () => {
    setIsShowKeyboard(true);
    setHasFocusEmail(true);
  };

  const handleFocusPassword = () => {
    setIsShowKeyboard(true);
    setHasFocusPassword(true);
  };

  const toggleShowPassword = () => {
    setIsShowPassword(!showPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View style={styles.wrapper}>
            <View style={styles.avatarWrapper}>
              <Image style={styles.avatar} />
              <AddSvg style={styles.addIcon} width={25} height={25} />
            </View>
            <View
              style={{
                ...styles.form,
                marginBottom: isShowKeyboard ? 20 : 79,
              }}
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Реєстрація</Text>
              </View>
              <View>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: hasFocusLogin ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Логін"
                  placeholderTextColor={"#BDBDBD"}
                  value={state.login}
                  onFocus={() => handleFocusLogin()}
                  onBlur={() => setHasFocusLogin(false)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: hasFocusEmail ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Адреса електронної пошти"
                  placeholderTextColor={"#BDBDBD"}
                  value={state.email}
                  onFocus={() => handleFocusEmail()}
                  onBlur={() => setHasFocusEmail(false)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View
                style={{
                  marginTop: 16,
                  position: "relative",
                }}
              >
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: hasFocusPassword ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Пароль"
                  placeholderTextColor={"#BDBDBD"}
                  value={state.password}
                  onFocus={() => handleFocusPassword()}
                  onBlur={() => setHasFocusPassword(false)}
                  onChangeText={(value) =>
                    setState((prevState) => ({
                      ...prevState,
                      password: value,
                    }))
                  }
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={toggleShowPassword}
                >
                  <Text style={styles.btnShowPasswordTitle}>Показати</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={handleSubmit}
              >
                <Text style={styles.btnTitle}>Зареєстуватися</Text>
              </TouchableOpacity>
              <View style={styles.linkWrapper}>
                <Text style={styles.link}>Вже є акаунт?</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.link}>Увійти</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        <ImageBackground
          style={styles.image}
          source={require("../assets/images/BG.jpg")}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  wrapper: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    marginHorizontal: 16,
  },
  inputTitle: {
    color: "#f0f8ff",
    marginBottom: 10,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,

    backgroundColor: "#F6F6F6",
    height: 51,
    padding: 16,
    borderRadius: 8,
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  btn: {
    height: 51,
    borderRadius: 100,
    marginTop: 43,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6C00",
    borderColor: "transparent",
  },
  btnTitle: {
    marginHorizontal: 20,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#fff",
  },
  header: {
    alignItems: "center",
    marginTop: 92,
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    color: "#212121",
  },
  linkWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  link: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#1B4371",
    marginTop: 16,
  },
  btnShowPasswordTitle: {
    display: "flex",
    position: "absolute",
    bottom: 16,
    right: 16,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#1B4371",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    position: "absolute",
    bottom: -63,
    left: 130,
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    marginRight: "auto",
    marginLeft: "auto",
  },
  addIcon: {
    position: "absolute",
    right: 132,
    top: 20,
  },
});
