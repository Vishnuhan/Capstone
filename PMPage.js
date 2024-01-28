import {React, useState, useEffect} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Button, } from 'react-native';
import { projects, tasks } from './dummyData'; // Import the dummy data
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';  // Import axios for API requests

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const PHASES = [
  { name: 'Implementation', percentage: Math.floor(Math.random() * 100) },
  { name: 'Planning', percentage: Math.floor(Math.random() * 100) },
  { name: 'Testing', percentage: Math.floor(Math.random() * 100) },
  { name: 'Deployment', percentage: Math.floor(Math.random() * 100) },
];

const renderPhaseCard = (navigation, phase, projectName) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Tasks', { phase, projectName })}
  >
    <View style={styles.phaseCardContainer}>
      <View style={styles.phaseCard}>
        <Text style={styles.phaseTitle}>{phase.name}</Text>
        <Text style={styles.phaseText}>{phase.percentage}% Completed</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const PhasePage = ({ route }) => {
  const { projectName, navigation } = route.params;

  return (
    <FlatList
      data={PHASES}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => renderPhaseCard(navigation, item, projectName)}
    />
  );
};

const renderTaskCard = (task) => (
  <View style={styles.taskCard}>
    <Text style={styles.taskName}>Task Name: {task.TaskName}</Text>
    <Text style={styles.phase}>Phase: {task.Phase}</Text>
    <Text style={styles.completionStatus}>
      Completion Status: {task.Complete ? 'Complete' : 'Incomplete'}
    </Text>
  </View>
);

const TasksPage = ({ route }) => {
  const { phase, projectName } = route.params;
  const tasksForPhase = tasks.filter((task) => task.Phase === phase.name);
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskNumEmployees, setNewTaskNumEmployees] = useState(1);
  const [newTaskEmployees, setNewTaskEmployees] = useState(['']);

  // Function to handle the button click and update the right side
  const handleUpdateSampleEmployees = () => {
    // Always show 20 sample employees regardless of the input
    setNewTaskEmployees(Array.from({ length: 5 }, (_, index) => `Sample Employee ${index + 1}`));
  };


  const handleAddTask = () => {
    setIsModalVisible(true);
  };

  const handleSaveTask = () => {
    // Add your logic to save the new task
    // For now, let's just log the task details
    console.log('New Task:', {
      Name: newTaskName,
      DueDate: newTaskDueDate,
      Employees: newTaskEmployees,
    });

    // Close the modal after saving the task
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    // Close the modal without saving the task
    setIsModalVisible(false);
  };

  const renderEmployeeInput = (index) => (
    <TextInput
      key={index.toString()}
      style={styles.inputField}
      placeholder={`Employee ${index + 1}`}
      onChangeText={(text) => {
        const updatedEmployees = [...newTaskEmployees];
        updatedEmployees[index] = text;
        setNewTaskEmployees(updatedEmployees);
      }}
    />
  );

  const renderEmployeeInputs = () => {
    const employeeInputs = [];
    for (let i = 0; i < newTaskNumEmployees; i++) {
      employeeInputs.push(renderEmployeeInput(i));
    }
    return employeeInputs;
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.mytext}>Tasks for Phase: {phase.name}</Text>
        <Text style={styles.mytext}>Project: {projectName}</Text>
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasksForPhase}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderTaskCard(item)}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.splitScreenContainer}>
            {/* Left Side: Input Fields */}
            <View style={styles.leftSide}>
              <Text style={styles.modalTitle}>Add Task</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Task Name"
                onChangeText={(text) => setNewTaskName(text)}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Due Date"
                onChangeText={(text) => setNewTaskDueDate(text)}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Task Size"
                onChangeText={(text) => setNewTaskDueDate(text)}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Number of Employees"
                onChangeText={(text) => setNewTaskNumEmployees(parseInt(text) || 0)}
              />
              {/* Button to update sample employees */}
              <TouchableOpacity onPress={handleUpdateSampleEmployees} style={styles.updateButton}>
                <Text style={styles.addButtonText}>Update Sample Employees</Text>
              </TouchableOpacity>
              {/* Render additional employee input fields based on the count */}
              {renderEmployeeInputs()}
              {/* Add more input fields as needed */}
            </View>

            {/* Right Side: Sample Employees */}
            <View style={styles.rightSide}>
              <Text style={styles.modalTitle}>Sample Employees</Text>
              <FlatList
                data={newTaskEmployees}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.sampleEmployee}>{item}</Text>
                )}
              />
            </View>
          </View>

          {/* Common Buttons for Both Sides */}
          <View style={styles.modalButtons}>
            <Button title="Save" onPress={handleSaveTask} />
            <Button title="Cancel" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const renderProjectCard = (navigation, project) => {
  const teamText = project.Team ? `Team: ${project.Team.join(', ')}` : 'Team: N/A';

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProjectDetails', { project, navigation })}
    >
      <View style={styles.projectCard}>
        <Text style={styles.cardTitle}>Name: {project.Name}</Text>
        <Text style={styles.cardText}>Percentage Complete: {project.Percentage_Complete}%</Text>
        <Text style={styles.cardText}>{teamText}</Text>
        <Text style={styles.cardText}>Due Date: {project.Due_Date}</Text>
        <Text style={styles.cardText}>Tasks: {project.Tasks ? project.Tasks.join(', ') : 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );
};
const ProjectDetailsScreen = ({ route }) => {
  const { project, navigation } = route.params;

  return (
    <View>
      <Text style={styles.mytext}>Project Phases</Text>
      <FlatList
        data={PHASES}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => renderPhaseCard(navigation, item, project.Name)}
      />
    </View>
  );
};

const AllScreen = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);  // State to store fetched projects
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/projects');
      setProjects(response.data);  // Set projects in the state
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Error fetching projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ScrollView>
      <View>
        <Text style={styles.mytext}>All Projects</Text>
        <FlatList
          style={{ flex: 1 }}
          data={projects}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => renderProjectCard(navigation, item)}
        />
      </View>
    </ScrollView>
  );
};

const OngoingScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView>
      <View>
        <Text style={styles.mytext}>Ongoing Projects</Text>
        <FlatList
          data={projects.filter((project) => project.Percentage_Complete < 100)}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => renderProjectCard(navigation, item)}
        />
      </View>
    </ScrollView>
  );
};

const CompletedScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView>
      <View>
        <Text style={styles.mytext}>Completed Projects</Text>
        <FlatList
          data={projects.filter((project) => project.Percentage_Complete === 100)}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => renderProjectCard(navigation, item)}
        />
      </View>
    </ScrollView>
  );
};

const PMPage = () => (
  <Stack.Navigator initialRouteName="PMPage">
    <Stack.Screen name="PMPage" component={PMTopTabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
    <Stack.Screen name="Tasks" component={TasksPage} />
  </Stack.Navigator>
);

const PMTopTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="All" component={AllScreen} />
    <Tab.Screen name="Ongoing" component={OngoingScreen} />
    <Tab.Screen name="Completed" component={CompletedScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  phaseCardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
  },
  phaseCard: {
    padding: 16,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phaseText: {
    fontSize: 16,
    color: '#555',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phase: {
    color: '#555',
    marginBottom: 8,
  },
  completionStatus: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2ecc71',
  },
  projectCard: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    font: "Quicksand",
    marginBottom: 6,
    color: '#555',
  },
  mytext: {
    fontWeight: 'bold',
    fontfamily: 'Roboto',
    marginLeft: '10px',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputField: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  splitScreenContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  leftSide: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  rightSide: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0e0e0',
  },
  sampleEmployee: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PMPage;



