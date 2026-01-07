import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useReturns } from "../../context/ReturnsContext";

type RmaResponse = {
  rma_id: string;
  order_number: string;
  created_at: string;
  barcode: string;
  line_items: {
    line_item_id: string;
    title: string;
    image_src: string;
    quantity: number;
    return_reason: string;
  }[];
};

export default function LoadingScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams<{ barcode: string }>();

  const [error] = useState<string | null>(null);
  const { recentReturns } = useReturns();

  useEffect(() => {
    async function fetchRma() {

      const alreadyProcessed = recentReturns.some(
        (return_data) => return_data.barcode === barcode
      );
      
      if (alreadyProcessed) {
        Toast.show({
          type: "error",
          text1: "Duplicate scan",
          text2: "This return has already been processed",
        });

        setTimeout(() => {
          router.replace("/scan");
        }, 1500);

        return;
      }

      try {
        const response = await fetch(
          `https://4b537fa7-fb87-48a9-9599-788f69604898.mock.pstmn.io/rma/barcode/${barcode}`
        );

        if (!response.ok) {
          throw new Error("Invalid barcode");
        }

        const data: RmaResponse = await response.json();

        // Simulate minimum loading time (UX requirement)
        setTimeout(() => {
          router.replace({
            pathname: "/details",
            params: {
              rma: JSON.stringify(data),
            },
          });
        }, 10);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Invalid barcode",
          text2: "Unable to find an order for this barcode",
        });
        
        setTimeout(() => {
          router.replace("/scan");
        }, 1500);
      }
    }

    if (barcode) {
      fetchRma();
    }
  }, [barcode]);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <ActivityIndicator size="large" color="#8f8e94" />
          <Text style={styles.text}>Finding order...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#8f8e94",
  },

  error: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
  },
});
