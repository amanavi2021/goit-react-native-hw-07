import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { storage, db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { selectUser } from "../redux/auth/selectors";
import PhotoSvg from "../assets/images/photo.svg";
import TrashSvg from "../assets/images/trash.svg";
import MagPinSvg from "../assets/images/map-pin.svg";

export default function CreatePostsScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [name, setName] = useState("");
  const [place, setPlace] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { userId, login } = useSelector(selectUser);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // const { status } = await Location.requestBackgroundPermissionsAsync();
      const { status } = await Location.requestForegroundPermissionsAsync();
      // console.log("status location", status);
      if (status !== "granted") {
        // console.log("Permission to access location was denied");
      }
    })();
  }, []);

  const sendPost = async () => {
    // uploadPhotoToServer();
    uploadPostToServer();

    const location = await Location
      .getCurrentPositionAsync
      // {
      //   accuracy: Location.Accuracy.Highest,
      //   maximumAge: 10000,
      // }
      // {}
      ();
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);

    navigation.navigate("Default");
  };

  const handleDelete = () => {
    setPhoto(null);
    setPhotoURL(null);
    setName("");
    setPlace("");
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const uniquePostID = Date.now().toString();
    const storageRef = ref(storage, `postImages/${uniquePostID}`);

    await uploadBytes(storageRef, file).then((snapshot) => {});
    await getDownloadURL(ref(storage, `postImages/${uniquePostID}`))
      .then((url) => {
        setPhotoURL(url);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const uploadPostToServer = async () => {
    await uploadPhotoToServer();
    if (photoURL) {
      const post = {
        photoURL,
        name,
        place,
        latitude,
        longitude,
        userId,
        login,
      };

      try {
        const docRef = await addDoc(collection(db, "posts"), post);
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera </Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={setCameraRef}>
        {photo && (
          <View style={styles.takePhotoContainer}>
            <Image source={{ uri: photo }} style={{ height: 240 }} />
          </View>
        )}

        <View
          style={{
            ...styles.photoView,
            backgroundColor: photo ? "transparent" : "#F6F6F6",
          }}
        >
          <TouchableOpacity
            style={{
              ...styles.iconWrapper,
              backgroundColor: photo ? "rgba(225,225,225,0.3)" : "#FFF",
            }}
            onPress={async () => {
              // console.log(cameraRef);
              if (cameraRef) {
                const { uri } = await cameraRef.takePictureAsync();
                // const location = await Location.getCurrentPositionAsync();

                await MediaLibrary.createAssetAsync(uri);
                // console.log("location", location);
                setPhoto(uri);
              }
            }}
          >
            <PhotoSvg
              fill={photo ? "#FFF" : "#BDBDBD"}
              width={24}
              height={24}
            />
          </TouchableOpacity>
        </View>
      </Camera>
      <Text style={styles.photoTitle}>
        {photo ? "Редагувати фото" : "Завантажте фото"}
      </Text>

      <View style={styles.form}>
        <View>
          <TextInput
            style={{
              ...styles.input,
              fontFamily: "Roboto-Medium",
            }}
            placeholder="Назва..."
            placeholderTextColor={"#BDBDBD"}
            value={name}
            onChangeText={(value) => setName(value)}
          />
        </View>
        <View style={{ marginTop: 16, position: "relative" }}>
          <TextInput
            style={{
              ...styles.input,
              paddingLeft: 28,
            }}
            placeholder="Місцевість.."
            placeholderTextColor={"#BDBDBD"}
            value={place}
            onChangeText={(value) => setPlace(value)}
          />
        </View>
        <MagPinSvg style={styles.magPinSvg} />
        <TouchableOpacity
          style={{
            ...styles.btn,
            backgroundColor: photo ? "#FF6C00" : "#F6F6F6",
          }}
          activeOpacity={0.8}
          onPress={sendPost}
        >
          <Text
            style={{ ...styles.btnTitle, color: photo ? "#FFF" : "#BDBDBD" }}
          >
            Опубліковати
          </Text>
        </TouchableOpacity>

        {/* <View style={styles.trashSvgWrapper}> */}
        <TouchableOpacity
          style={styles.trashSvgWrapper}
          activeOpacity={0.8}
          onPress={handleDelete}
        >
          <TrashSvg />
        </TouchableOpacity>
        {/* </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 16,
    paddingRight: 16,
  },
  camera: {
    height: 240,
    marginTop: 20,
    alignItems: "center",
  },

  photoView: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 8,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    width: "100%",
  },
  takePhotoContainer: {
    position: "absolute",
    top: 0,

    width: "100%",
  },

  photoTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#BDBDBD",
    marginTop: 8,
  },
  iconWrapper: {
    position: "absolute",
    bottom: 90,
    position: "relative",
    alignSelf: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    width: 60,
    height: 60,
    borderRadius: 60,
  },
  form: {
    marginTop: 32,
  },
  input: {
    height: 50,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
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
    borderColor: "transparent",
  },
  btnTitle: {
    marginHorizontal: 20,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  trashSvgWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 9,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 20,
    backgroundColor: "#F6F6F6",
    width: 70,
    height: 40,
  },
  magPinSvg: {
    position: "absolute",
    top: 77,
    left: 2,
  },
});
