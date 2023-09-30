import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import MapSvg from "../../assets/images/map-pin.svg";
import MessageSvg from "../../assets/images/message-circle.svg";

export default function DefaultScreen({ route }) {
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState([]);
  const navigation = useNavigation();

  const getAllPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "posts"));
      snapshot.forEach((doc) => {
        getAllCommentsCount(doc.id);
        setPosts((posts) => [...posts, { ...doc.data(), id: doc.id }]);
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
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postWrapper}>
            <Image source={{ uri: item.photoURL }} style={styles.photo} />

            <Text style={styles.photoTitle}>{item.name}</Text>
            <View style={styles.infoWrapper}>
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
                  />
                </TouchableOpacity>

                <Text style={styles.commentsCount}>{getCount(item.id)}</Text>
              </View>
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
    paddingLeft: 16,
    paddingRight: 16,
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
    color: "#BDBDBD",
  },
});
