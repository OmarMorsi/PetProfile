import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import supabase from "../../utils/supabase";

const mockData = [
  { id: "1", weight: 25.5, date: "2024-03-01T10:00:00Z" },
  { id: "2", weight: 26.0, date: "2024-02-20T12:00:00Z" },
  { id: "3", weight: 24.8, date: "2024-01-15T14:00:00Z" },
];

export function WeightLogsScreen() {
  const [weightLogs, setWeightLogs] = useState(mockData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeightLogs();
  }, []);

  const fetchWeightLogs = async () => {
    const { data, error } = await supabase
      .from("weight_logs")
      .select("*")
      .order("date", { ascending: false });
    if (error) {
      console.error("Error fetching weight logs:", error);
    } else if (data.length > 0) {
      setWeightLogs(data);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.weightText}>{item.weight} kg</Text>
      <Text style={styles.dateText}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Weight Logs</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={weightLogs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
        <Button
          title="Add New Weight Log"
          onPress={() => console.log("Navigate to Add Log Screen")}
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
  weightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "gray",
  },
});
