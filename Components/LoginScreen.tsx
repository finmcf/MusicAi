import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as AuthSession from "expo-auth-session";
import axios from "axios"; // Import axios

const spotifyClientId = "ffd2b6481cb84901932381a5ba9e8554";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: spotifyClientId,
      scopes: ["user-read-private", "playlist-read-private"],
      redirectUri: Platform.select({
        web: "http://localhost:19006/",
        default: AuthSession.makeRedirectUri({ useProxy: true }),
      }),
    },
    {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
    }
  );

  if (request) {
    console.log("Generated redirect URI:", request.redirectUri);
  }

  React.useEffect(() => {
    if (response) {
      console.log("Auth response:", response);
    }
    if (response?.type === "success") {
      const { access_token } = response.params;
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((res) => {
          console.log("User scopes:", res.data);
          navigation.navigate("Music");
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => promptAsync()}
      >
        <Text style={styles.loginText}>Log in with Spotify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#1DB954",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LoginScreen;
