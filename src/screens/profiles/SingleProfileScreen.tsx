import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import supabase from "../../utils/supabase";

export const SingleProfileScreen = () => {
  const petId = "3527e9c9-ace3-4fbe-9dea-34d23c074256";

  const [pet, setPet] = useState(null);
  const [latestWeight, setLatestWeight] = useState(null);
  const [vetVisitLogs, setVetVisitLogs] = useState(null);
  const [bodyConditionLogs, setBodyConditionLogs] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPetDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", petId)
        .single();

      if (error) throw error;
      setPet(data);
    } catch (error) {
      console.error("Error fetching pet:", error);
    }
  };

  const fetchLatestWeightLog = async () => {
    try {
      const { data, error } = await supabase
        .from("weight_logs")
        .select("weight, date")
        .eq("pet_id", petId)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) setLatestWeight(data.weight);
    } catch (error) {
      console.error("Error fetching weight log:", error);
    }
  };

  const fetchLatestVetVisitLog = async () => {
    try {
      const { data, error } = await supabase
        .from("vet_visit_logs")
        .select("notes, date")
        .eq("pet_id", petId)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error) setVetVisitLogs(data);
    } catch (error) {
      console.error("Error fetching latest vet visit log:", error);
    }
  };

  const fetchLatestBodyConditionLog = async () => {
    try {
      const { data, error } = await supabase
        .from("body_condition_logs")
        .select("body_condition, date")
        .eq("pet_id", petId)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error) setBodyConditionLogs(data);
    } catch (error) {
      console.error("Error fetching latest body condition log:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchPetDetails();
    await fetchLatestWeightLog();
    await fetchLatestVetVisitLog();
    await fetchLatestBodyConditionLog();
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No pets found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: pet.image_url || "https://placedog.net/800/300",
          }}
          style={styles.petImage}
        />
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petDetails}>Species: {pet.species}</Text>
        <Text style={styles.petDetails}>Age: {pet.age} years</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name="weight" size={20} color="#FF9800" />
          <Text style={styles.header}>Latest Weight</Text>
        </View>
        <Text style={styles.dataText}>
          {latestWeight !== null ? `${latestWeight} kg` : "No data available"}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="medical-services" size={22} color="#FF9800" />
          <Text style={styles.header}>Latest Vet Visit</Text>
        </View>
        {vetVisitLogs ? (
          <Text style={styles.dataText}>
            {vetVisitLogs.notes} -{" "}
            {new Date(vetVisitLogs.date).toLocaleDateString()}
          </Text>
        ) : (
          <Text style={styles.noDataText}>No vet visit records found</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name="heartbeat" size={20} color="#FF9800" />
          <Text style={styles.header}>Latest Body Condition</Text>
        </View>
        {bodyConditionLogs ? (
          <Text style={styles.dataText}>
            {bodyConditionLogs.body_condition} -{" "}
            {new Date(bodyConditionLogs.date).toLocaleDateString()}
          </Text>
        ) : (
          <Text style={styles.noDataText}>No body condition records found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E0",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    backgroundColor: "#FF9800",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  petImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  petDetails: {
    fontSize: 16,
    color: "#FFF",
  },
  section: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#FF9800",
  },
  dataText: {
    fontSize: 16,
    color: "#333",
  },
  noDataText: {
    fontSize: 16,
    color: "#777",
    fontStyle: "italic",
  },
});

export default SingleProfileScreen;
