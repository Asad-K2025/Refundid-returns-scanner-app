import { Feather, Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";


export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<string | null>(null);
  const router = useRouter();
  const [torchOn, setTorchOn] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
  return (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionTitle}>
        Camera access required
      </Text>

      <Text style={styles.permissionSubtitle}>
        Allow camera access to scan return barcodes
      </Text>

      <Pressable
        style={styles.allowButton}
        onPress={() => requestPermission()}
      >
        <Text style={styles.allowButtonText}>
          Allow camera access
        </Text>
      </Pressable>
    </View>
  );
}


function handleBarcodeScanned({ data }: { data: string }) {
  setScanned(data);

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  // navigates to loading screen, passes barcode
  router.push({
    pathname: "/loading",
    params: { barcode: data },
  });
}

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace("/")}
      >
        <Feather
          name="arrow-left"
          size={20}
          color="#000000ff"
        />  
      </Pressable>

      <CameraView
        style={{ flex: 1 }}
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "code128", "qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
  
      <View style={styles.scanBoxContainer}>
        <View style={styles.scanBox} />

        <Pressable
          style={styles.torchButton}
          onPress={() => setTorchOn((prev) => !prev)}
        >
        
        <Ionicons
            name={torchOn ? "flashlight" : "flashlight-outline"}
            size={34}
            color="#000000ff"
          />
        </Pressable>
      </View>

      

      {scanned && (
        <View style={styles.overlay}>
          <Text>Scanned:</Text>
          <Text>{scanned}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" },

  overlay: { 
    position: "absolute", 
    bottom: 40, 
    left: 20, 
    right: 20, 
    padding: 16, 
    backgroundColor: "white", 
    borderRadius: 8 },

  permissionContainer: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
    marginBottom: 8,
  },

  permissionSubtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 32,
  },

  allowButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  allowButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9AA1AF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,  // ensure button stays above camera
  },

  scanBoxContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  scanBox: {
    width: 320,
    height: 160,
    borderWidth: 6,
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderStyle: "dashed",
  },

  torchButton: {
    borderRadius: 28,
    marginTop: 20,
    padding: 6,
    backgroundColor: "#9aa1afff",
    justifyContent: "center",
    alignItems: "center",
  },

});
