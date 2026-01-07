import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useReturns } from "../../context/ReturnsContext";

export default function ResultScreen() {
  const router = useRouter();
  const { status, rma_id, reason, barcode } = useLocalSearchParams<{
    status: "approved" | "declined";
    rma_id: string;
    barcode: string;
    reason?: string;
  }>();

  const { addReturn, operator } = useReturns();

  useEffect(() => {
    if (!operator || !barcode || !status) return;  // return in case data is not yet prcoessed

    addReturn({
      rma_id,
      barcode,
      status,
      operator,
      reason,
    });
  }, []);


  const isApproved = status === "approved";

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: isApproved ? "#16A34A" : "#DC2626" },
        ]}
      >
      {isApproved ? "Return approved successfully" : "Return declined successfully"}
      </Text>

      <Text style={styles.id}>
        Return ID: {rma_id}
      </Text>

      {!isApproved && (
        <Text style={styles.reason}>
          Reason: {reason}
        </Text>
      )}

      <Pressable
        style={styles.nextButton}
        onPress={() => router.replace("/scan")}
      >
        <Text style={styles.nextText}>Scan next</Text>
        <Feather
          name="arrow-right"
          size={20}
          color="#fff"
          style={{ marginLeft: 8 }}
        />  
      </Pressable>

      <Pressable
        style={styles.homeButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.homeText}>Return home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },

  id: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },

  reason: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },

  nextButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
  },

  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  homeButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  homeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
