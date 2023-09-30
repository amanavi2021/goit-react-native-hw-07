import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { enableLatestRenderer } from "react-native-maps";

export default function MapScreen({ route }) {
  enableLatestRenderer();
  const [coords, setCoords] = useState({});
  useEffect(() => {
    if (route.params) {
      setCoords(route.params);
    }
  }, [route.params]);
  console.log("route", route);
  console.log("coords", coords);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapView}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          // latitude: 50.516339,
          // longitude: 30.602185,
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
            // latitude: 50.516339,
            // longitude: 30.602185,
          }}
          title="photo was here"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
