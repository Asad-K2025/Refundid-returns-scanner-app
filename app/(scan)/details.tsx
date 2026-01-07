import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


type LineItem = {  // type is simlar to class
  line_item_id: string;
  title: string;
  image_src: string;
  quantity: number;
  return_reason: string;
};

type RmaData = {
  rma_id: string;
  order_number: string;
  created_at: string;
  barcode: string;
  line_items: LineItem[];
};

export default function DetailsScreen() {
  const router = useRouter();
  const { rma } = useLocalSearchParams<{ rma?: string }>();

if (typeof rma !== "string") {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Invalid navigation: missing RMA</Text>
    </SafeAreaView>
  );
}

let data: RmaData;

try {
  data = JSON.parse(rma);
} catch {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Invalid RMA data</Text>
    </SafeAreaView>
  );
}

  const insets = useSafeAreaInsets();  // used for back button

  return (   
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <Pressable
        style={[
          styles.backButton,
          { top: insets.top + 4 }
        ]}
        onPress={() => router.replace("/scan")}
      >
        <Feather name="arrow-left" size={20} color="#000" />
      </Pressable>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 30 }}
      >

        <Text style={styles.bold_header}>
          Parcel ID: <Text style={styles.header}>{data.barcode}</Text> {/* nested text overrides outer text */} 
        </Text>  


        {/* info card, uses reusable component */}
        <View style={styles.card}>
          <InfoRow label="Customer" value="J. Sm***th"/>  {/*Placeholder customer name (not available in api)*/}
          <InfoRow label="Order #" value={data.order_number} />
          <InfoRow label="Return ID" value={data.rma_id} />
          <InfoRow label="Channel" value="Online" />
          <InfoRow
            label="Date received"
            value={new Date(data.created_at).toLocaleDateString()}
          /> {/* format date to user's region*/}
          <InfoRow
            label="Item Count"
            value={`${data.line_items.length}`}
          />
        </View>

        {/* items */}
        <Text style={styles.sectionTitle}>Items</Text>

        {data.line_items.map((item) => (
          <View key={item.line_item_id} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.itemContentRow}>
              <Image
                source={{ uri: item.image_src }}
                style={styles.image}
              />
              
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabels}>
                  SKU: <Text style={styles.itemDetails}>{item.line_item_id}</Text>
                </Text>
                <Text style={styles.itemLabels}>
                  Size/Variant: <Text style={styles.itemDetails}>Blue</Text>  {/* placeholder */}
                </Text>
                <Text style={styles.itemLabels}>
                  Qty: <Text style={styles.itemDetails}>{String(item.quantity)}</Text>
                </Text>
                <View style={styles.returnReasonContainer}>
                  <Text style={styles.itemLabels}>
                    Reason: <Text style={styles.itemDetails}>{item.return_reason}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <Pressable
          style={styles.approveButton}
          onPress={() =>
            router.replace({
              pathname: "/result",
              params: {
                status: "approved",
                rma_id: data.rma_id,
                barcode: data.barcode,
              },
            })
          }
        >
          <Text style={styles.approveText}>Approve return</Text>
        </Pressable>


        <Pressable
          style={styles.declineButton}
          onPress={() =>
            router.push({
              pathname: "/decline",
              params: {
                rma_id: data.rma_id,
                barcode: data.barcode,
              },
            })
          }
        >
          <Text style={styles.declineText}>Decline return</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Reusable row component */
function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}> {String(value ?? "")}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 16,
  },

  bold_header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    paddingTop: 10,
    color: "#111827",
  },

  header: {
    fontWeight: "400",
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

  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#cdced3ff",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },

  itemCard: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderColor: "#cdced3ff",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },

  itemContentRow: {
    flexDirection: "row",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },

  itemInfo: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },

  itemLabels: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6b7280ff",
    marginBottom: 2,
  },

  itemDetails: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280ff",
    marginBottom: 2,
  },

  returnReasonContainer: {
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#C7CBD1",
    backgroundColor: "#F9FAFB",
    paddingVertical: 1,
    paddingHorizontal: 1,
    borderRadius: 6,
    marginTop: 1,
  },

  approveButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },

  approveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  declineButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 32,
  },

  declineText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
});
