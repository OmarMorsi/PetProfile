import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase from "../../utils/supabase";

export function WeightLogsScreen() {
  const [petId, setPetId] = useState(null);
  const [weightLogs, setWeightLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchLatestPet = async () => {
      try {
        const { data, error } = await supabase
          .from("pets")
          .select("id")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        if (data) {
          setPetId(data.id);
        }
      } catch (error) {
        console.error("Error fetching latest pet:", error);
      }
    };

    fetchLatestPet();
  }, []);

  useEffect(() => {
    if (petId) {
      fetchWeightLogs();
    }
  }, [petId]);

  const fetchWeightLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("pet_id", petId)
        .order("date", { ascending: false });

      if (!error) setWeightLogs(data);
    } catch (error) {
      console.error("Error fetching weight logs:", error);
    }
    setLoading(false);
  };

  const addWeightLog = async () => {
    if (!weight || !date || !petId) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const { error } = await supabase.from("weight_logs").insert([
        {
          pet_id: petId,
          weight: parseFloat(weight),
          date: date.toISOString(),
        },
      ]);
      if (!error) {
        setModalVisible(false);
        setWeight("");
        setDate(new Date());
        fetchWeightLogs();
      } else {
        console.error("Error adding log:", error);
      }
    } catch (error) {
      console.error("Error adding log:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.weightText}>{item.weight} kg</Text>
      <Text style={styles.dateText}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weight Logs</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={weightLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.logList}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Log</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Weight Log</Text>

            <TextInput
              placeholder="Weight (kg)"
              style={styles.input}
              value={weight}
              keyboardType="numeric"
              onChangeText={setWeight}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Select Date: {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={addWeightLog}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEBEE",
  },
  header: {
    padding: 20,
    backgroundColor: "#D32F2F",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#555",
  },
  logList: {
    padding: 16,
  },
  logCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  weightText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B71C1C",
  },
  dateText: {
    fontSize: 14,
    color: "#D32F2F",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    margin: 16,
    elevation: 3,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#B71C1C",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E57373",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dateButton: {
    backgroundColor: "#D32F2F",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#D32F2F",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#E57373",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default WeightLogsScreen;
