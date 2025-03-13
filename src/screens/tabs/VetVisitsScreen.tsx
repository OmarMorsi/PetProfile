import supabase from "@/src/utils/supabase";
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

export function VetVisitsScreen() {
  const [petId, setPetId] = useState(null);
  const [vetVisitLogs, setVetVisitLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState("");
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
      fetchVetVisitLogs();
    }
  }, [petId]);

  const fetchVetVisitLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vet_visit_logs")
        .select("*")
        .eq("pet_id", petId)
        .order("date", { ascending: false });

      if (!error) setVetVisitLogs(data);
    } catch (error) {
      console.error("Error fetching vet visit logs:", error);
    }
    setLoading(false);
  };

  const addVetVisitLog = async () => {
    if (!notes || !date || !petId) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const { error } = await supabase.from("vet_visit_logs").insert([
        {
          pet_id: petId,
          notes: notes,
          date: date.toISOString(),
        },
      ]);
      if (!error) {
        setModalVisible(false);
        setNotes("");
        setDate(new Date());
        fetchVetVisitLogs();
      } else {
        console.error("Error adding log:", error);
      }
    } catch (error) {
      console.error("Error adding log:", error);
    }
  };

  const renderVetVisitItem = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.notesText}>{item.notes}</Text>
      <Text style={styles.dateText}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vet Visit Logs</Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={vetVisitLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderVetVisitItem}
          contentContainerStyle={styles.logList}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Visit</Text>
      </TouchableOpacity>

      {/* Modal for adding logs */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Vet Visit</Text>

            <TextInput
              placeholder="Enter Notes"
              style={styles.input}
              value={notes}
              onChangeText={setNotes}
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
                onPress={addVetVisitLog}
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
    backgroundColor: "#E3F2FD",
  },
  header: {
    padding: 20,
    backgroundColor: "#1976D2",
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
  notesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#1976D2",
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dateButton: {
    backgroundColor: "#1976D2",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  submitButtonText: {
    color: "#FFF",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: "#FFF",
    textAlign: "center",
  },
});
