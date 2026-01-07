import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useReturns } from "../context/ReturnsContext";


export default function HomeScreen() {
  const router = useRouter();
  const { operator, login, recentReturns } = useReturns();
  const OPERATORS = [
    "John Smith",
    "Sarah Lee",
    "Alex Johnson",
  ];
  const [showOperatorModal, setShowOperatorModal] = useState(false);

  function formatDate(timestamp: number) {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000); // seconds

    if (diff < 60) return "Just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60)
      return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24)
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  function capitalise(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function startShift() {
    if (!operator) {
      login("John Smith"); // fake login
    }
    router.push("/scan");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Returns Quick View</Text>

      {recentReturns.length > 0 && (
        <View style={styles.returnsView}>
          {/* Header row */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.headerText, styles.colRma]}>RMA</Text>
            <Text style={[styles.headerText, styles.colOperator]}>Operator</Text>
            <Text style={[styles.headerText, styles.colTime]}>Process Date</Text>
            <Text style={[styles.headerText, styles.colStatus]}>Status</Text>
          </View>

          {/* Data rows */}
          {recentReturns.slice(0, 3).map((return_data) => (  // limiting to 3 returns
            <View key={return_data.timestamp} style={styles.row}>
              <Text style={[styles.rma, styles.colRma]}>{return_data.rma_id}</Text>
              <Text style={[styles.rma, styles.colOperator]}>{return_data.operator}</Text>
              <Text style={[styles.rma, styles.colTime]}>{formatDate(return_data.timestamp)}</Text>
              <Text
                style={[
                  styles.cellText,
                  styles.colStatus,
                {
                  color: return_data.status === "approved" ? "#16A34A" : "#DC2626",
                  fontWeight: "600",
                },
              ]}
              >
                {capitalise(return_data.status)}  {/* Called as status is stored in lower case*/}
              </Text>
            </View>
          ))}
        </View>
        )}

      <View style={styles.card}>
        <Text style={styles.label}>Logged in as</Text>
        <Text style={styles.operator}>
          {operator ?? "John Smith"}
        </Text>

        <Pressable style={styles.loginButton} onPress={startShift}>
          <Text style={styles.buttonText}>Login for shift</Text>
        </Pressable>

        <Pressable
          style={styles.changeButton}
          onPress={() => setShowOperatorModal(true)}
        >
          <Text style={styles.changeButtonText}>Change over shift</Text>
        </Pressable>

      </View>
      <Modal
        visible={showOperatorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOperatorModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select operator</Text>

            {OPERATORS.map((name) => (
              <Pressable
                key={name}
                style={styles.modalOption}
                onPress={() => {
                  login(name);
                  setShowOperatorModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{name}</Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.modalCancel}
              onPress={() => setShowOperatorModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    elevation: 3,
    minHeight: 120,
    justifyContent: "center",
  },

  returnsView: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    borderColor: "#cdced3ff",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },

  operator: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600",
    color: "#111827",
  },

  loginButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },

  changeButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    color: "#111827",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  changeButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },

  row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 8,
  },

  rma: {
    fontSize: 14,
    color: "#111827",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "#FFFFFF",
    width: "85%",
    borderRadius: 14,
    padding: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },

  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  modalOptionText: {
    fontSize: 15,
    color: "#111827",
  },

  modalCancel: {
    paddingVertical: 14,
    alignItems: "center",
  },

  modalCancelText: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "600",
  },

  headerRow: {
  borderBottomWidth: 1,
  borderBottomColor: "#E5E7EB",
  paddingBottom: 6,
  marginBottom: 6,
  },

  headerText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  cellText: {
    fontSize: 14,
    color: "#111827",
  },

  colRma: {
    flex: 2,
  },

  colOperator: {
    flex: 2,
  },

  colTime: {
    flex: 2,
  },

  colStatus: {
    flex: 1,
    textAlign: "right",
  },
});
