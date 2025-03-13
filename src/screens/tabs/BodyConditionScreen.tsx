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
const mockBodyConditionData = [
  { id: "1", body_condition: "Ideal", date: "2024-03-01T10:00:00Z" },
  { id: "2", body_condition: "Overweight", date: "2024-02-20T12:00:00Z" },
  { id: "3", body_condition: "Underweight", date: "2024-01-15T14:00:00Z" },
];

export function BodyConditionScreen() {
  const [bodyConditionLogs, setBodyConditionLogs] = useState(
    mockBodyConditionData
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBodyConditionLogs();
  }, []);

  // Function to fetch from Supabase (once real data is added)
  const fetchBodyConditionLogs = async () => {
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In the future, replace this with Supabase fetch
      // const { data, error } = await supabase.from("body_condition_logs").select("*").order("date", { ascending: false });
      // if (!error) setBodyConditionLogs(data);
    } catch (error) {
      console.error("Error fetching body condition logs:", error);
    }
    setLoading(false);
  };

  // Render each item in the list
  const renderConditionItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.conditionText}>{item.body_condition}</Text>
      <Text style={styles.dateText}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Body Condition Logs</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={bodyConditionLogs}
            keyExtractor={(item) => item.id}
            renderItem={renderConditionItem}
          />
        )}
        <Button
          title="Add New Body Condition"
          onPress={() => console.log("Navigate to Add Condition Screen")}
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  conditionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "gray",
  },
});
