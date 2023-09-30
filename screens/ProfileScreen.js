import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectUserLogin, selectUser } from "../redux/auth/selectors";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { logOutDB } from "../redux/auth/operations";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import DeleteSvg from "../assets/images/delete.svg";
import LogOutSvg from "../assets/images/log-out.svg";
import AvatarImage from "../assets/images/avatar.png";
import MapSvg from "../assets/images/map-pin.svg";
import MessageSvg from "../assets/images/message-circle.svg";
import ThumbSvg from "../assets/images/thumbs-up.svg";
import ThumbActiveSvg from "../assets/images/thumbs-up-active.svg";

export default function ProfileScreen() {
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState([]);
  const navigation = useNavigation();
  const login = useSelector(selectUserLogin);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logOutDB());
  };

  const getAllPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "posts"));
      snapshot.forEach((doc) => {
        getAllCommentsCount(doc.id);
        setPosts((posts) => [
          ...posts,
          { ...doc.data(), id: doc.id, likes: 0 },
        ]);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getAllCommentsCount = async (id) => {
    let comments = [];
    try {
      const snapshot = await getDocs(collection(db, `posts/${id}/comments`));
      snapshot.forEach((doc) => {
        comments.push({ ...doc.data() });
      });
      await setCommentsCount((prevState) => [
        ...prevState,
        {
          id,
          count: comments.length,
        },
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getCount = (id) => {
    const findingPost = commentsCount.find((post) => post.id === `${id}`);
    if (findingPost) {
      return findingPost.count;
    }
    return 0;
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.avatarWrapper}>
          <Image style={styles.avatar} source={AvatarImage} />
          <DeleteSvg style={styles.deleteIcon} width={37} height={37} />
          <TouchableOpacity activeOpacity={0.8} onPress={logOut}>
            <LogOutSvg style={styles.logOutIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{login}</Text>
        </View>
      </View>
      <ImageBackground
        style={styles.image}
        source={require("../assets/images/BG.jpg")}
      />
      <FlatList
        style={styles.postsWrapper}
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postWrapper}>
            <Image source={{ uri: item.photoURL }} style={styles.photo} />

            <Text style={styles.photoTitle}>{item.name}</Text>

            <View style={styles.infoWrapper}>
              <View style={styles.groupWrapper}>
                <View style={styles.commentWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate("Comments", {
                        postId: item.id,
                        photo: item.photoURL,
                      })
                    }
                  >
                    <MessageSvg
                      fill={getCount(item.id) ? "#FF6C00" : "transparent"}
                      // stroke={getCount(item.id) ? "#FF6C00" : "transparent"}
                    />
                  </TouchableOpacity>
                  <Text style={styles.commentsCount}>{getCount(item.id)}</Text>
                </View>
                {/*  */}
                <View style={styles.commentWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    // onPress={() =>
                    //   navigation.navigate("Comments", {
                    //     postId: item.id,
                    //     photo: item.photoURL,
                    //   })
                    // }
                  >
                    {true ? <ThumbActiveSvg /> : <ThumbSvg />}
                  </TouchableOpacity>
                  <Text style={styles.commentsCount}>{item.likes}</Text>
                </View>
              </View>
              {/*  */}

              <View style={styles.locationWrapper}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("Map", {
                      latitude: item.latitude,
                      longitude: item.longitude,
                    })
                  }
                >
                  <MapSvg />
                </TouchableOpacity>
                <Text style={styles.location}>{item.place}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  image: {
    // flex: 1,
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
    marginTop: 147,
  },
  header: {
    alignItems: "center",
    marginTop: 92,
    // marginBottom: 32,
  },
  headerTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    color: "#212121",
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
  deleteIcon: {
    position: "absolute",
    right: 128,
    top: 16,
  },
  logOutIcon: {
    position: "absolute",
    right: 16,
    top: 22,
  },
  postsWrapper: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#fff",
  },
  postWrapper: {
    marginBottom: 10,
    marginTop: 32,
    justifyContent: "center",
  },
  photo: {
    height: 240,
    borderRadius: 8,
  },

  photoTitle: {
    marginTop: 8,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: "#212121",
  },
  infoWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  groupWrapper: {
    flexDirection: "row",
    gap: 24,
  },
  locationWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
  location: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#212121",
    textDecorationStyle: "dashed",
    textDecorationLine: "underline",
  },
  commentWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
  },
  commentsCount: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#212121",
  },
});
