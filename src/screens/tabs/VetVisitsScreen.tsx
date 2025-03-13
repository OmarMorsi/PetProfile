import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";

// Mock data for now
const mockVetVisitData = [
  {
    id: "1",
    notes: "Routine check-up, all good!",
    date: "2024-03-05T09:30:00Z",
  },
  { id: "2", notes: "Vaccination completed", date: "2024-02-18T14:15:00Z" },
  {
    id: "3",
    notes: "Minor ear infection treated",
    date: "2024-01-10T11:45:00Z",
  },
];

export function VetVisitsScreen() {
  const [vetVisitLogs, setVetVisitLogs] = useState(mockVetVisitData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVetVisitLogs();
  }, []);

  // Function to fetch from Supabase (once real data is added)
  const fetchVetVisitLogs = async () => {
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In the future, replace this with Supabase fetch
      // const { data, error } = await supabase.from("vet_visit_logs").select("*").order("date", { ascending: false });
      // if (!error) setVetVisitLogs(data);
    } catch (error) {
      console.error("Error fetching vet visit logs:", error);
    }
    setLoading(false);
  };

  // Render each item in the list
  const renderVetVisitItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.notesText}>{item.notes}</Text>
      <Text style={styles.dateText}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Vet Visit Logs</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={vetVisitLogs}
            keyExtractor={(item) => item.id}
            renderItem={renderVetVisitItem}
          />
        )}
        <Button
          title="Add New Vet Visit"
          onPress={() => console.log("Navigate to Add Vet Visit Screen")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  logItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  notesText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "gray",
  },
});
