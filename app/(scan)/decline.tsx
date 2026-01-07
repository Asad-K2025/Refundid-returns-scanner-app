import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const reasons = [
  "Damaged",
  "Worn",
  "Wrong item returned",
  "Other",
];

export default function DeclineScreen() {
  const router = useRouter();
  const { rma_id, barcode } = useLocalSearchParams<{ rma_id: string, barcode: string }>();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const insets = useSafeAreaInsets();  // used for back button

  function submitDecline() {
    if (!selectedReason) return;

    if (selectedReason === "Other" && !otherReason.trim()) {
      setError("Please enter a reason");
      return;
    }

    setError(""); // clear error if validated

    router.replace({
      pathname: "/result",
      params: {
        status: "declined",
        rma_id,
        barcode,
        reason:
          selectedReason === "Other"
            ? otherReason.trim()
            : selectedReason,
      },
  });}

  async function uploadPhoto() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Gallery permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Camera permission is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <Pressable
        style={[
          styles.backButton,
          { top: insets.top + 4 }
        ]}
        onPress={() => router.back()}
      >
        <Feather name="arrow-left" size={20} color="#000" />
      </Pressable>

      <View 
        style={[styles.container, {paddingTop: 30}]}
      >

        <Text style={styles.title}>Decline return</Text>
        <Text style={styles.return_id}>
          Return ID: {rma_id}
        </Text>
        <Text style={styles.reason}>
          Select a reason for declining this return
        </Text>

        {/* Dropdown */}
        <Pressable
          style={styles.dropdown}
          onPress={() => setOpen(true)}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedReason && { color: "#9CA3AF" },
            ]}
          >
          {selectedReason || "Select a reason..."}
          </Text>
        </Pressable>

        {/* Modal */}
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Select reason</Text>

              {reasons.map((reason) => (
                <Pressable
                  key={reason}
                  style={styles.option}
                  onPress={() => {
                    setSelectedReason(reason);
                    setOpen(false);
                    setError("");
                  }}
                >
                  <Text style={styles.optionText}>{reason}</Text>
                </Pressable>
              ))}

              <Pressable
                style={styles.cancel}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {selectedReason === "Other" && (
          <TextInput
            style={styles.textInput}
            placeholder="Enter reason"
            value={otherReason}
            placeholderTextColor="#9CA3AF"
            onChangeText={(text) => {
              setOtherReason(text);
              if (error) setError("");
            }}
            multiline
          />
        )}

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Text style={styles.photoLabel}>
          Photo (Optional)
        </Text>

        <View style={styles.photoBox}>
          <Pressable style={styles.photoOption} onPress={uploadPhoto}>
            <Text style={styles.photoIcon}>🖼️</Text>
            <Text style={styles.photoText}>Upload a photo</Text>
          </Pressable>

          <View style={styles.photoDivider} />

          <Pressable style={styles.photoOption} onPress={takePhoto}>
            <Text style={styles.photoIcon}>📷</Text>
            <Text style={styles.photoText}>Take a photo</Text>
          </Pressable>
        </View>

        {photo && (
          <Image
            source={{ uri: photo }}
            style={styles.photoPreview}
          />
        )}


        <Pressable
          style={[
            styles.submitButton,
            !selectedReason && styles.disabledButton,
          ]}
          onPress={submitDecline}
          disabled={!selectedReason}
        >
          <Text style={styles.submitText}>Submit decline</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 16,
  },

  backButton: {
    position: "absolute",
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#c1c6d1ff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 26,
    marginBottom: 8,
  },

  return_id: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },

  reason: {
    fontSize: 14,
    color: "#111827",
  },

  reasonOption: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  selectedOption: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  reasonText: {
    fontSize: 15,
    color: "#111827",
  },

  selectedText: {
    fontWeight: "600",
  },

  submitButton: {
    marginTop: 24,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.5,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    marginVertical: 12,
  },

  dropdownText: {
    fontSize: 15,
    color: "#111827",
  },

  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    minHeight: 80,
    marginTop: 8,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },

  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  optionText: {
    fontSize: 15,
    color: "#111827",
  },

  cancel: {
    paddingVertical: 14,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "600",
  },

  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 13,
  },

  photoLabel: {
    marginTop: 16,
    fontSize: 14,
    color: "#111827",
  },

  photoBox: {
    flexDirection: "row",
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  photoOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  photoDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },

  photoIcon: {
    fontSize: 24,
    marginBottom: 6,
  },

  photoText: {
    fontSize: 14,
    color: "#111827",
  },

  photoPreview: {
    marginTop: 12,
    width: "100%",
    height: 160,
    borderRadius: 10,
  },
});
