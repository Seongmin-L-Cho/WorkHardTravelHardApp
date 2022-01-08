import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback, // 이벤트가 일어났다는 애니메이션을 보여주지 않을떄
  Pressable, // 아마 Touchable 속성의 대체
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { theme } from "./colors";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [Todos, setTodos] = useState({});
  const Travel = () => setWorking(false);
  const work = () => setWorking(true);
  const storageKey = "@todos";
  const onChnageText = (payload) => {
    setText(payload);
  };
  const addTodo = () => {
    if (text === "") {
      return;
    }
    const newTodo = Object.assign({}, Todos, {
      [Date.now()]: { text, work: working }, // new object
    }); //-> 기존 Todo와 나중 Todo의 결합. 첫 {} 은 새로만들어진 new object
    // const newTodos = {...Todos,[Date.now()]: { text, work: working }} -> ES6 스타일
    setTodos(newTodo);
    saveTodo(newTodo);
    setText("");
  };

  const saveTodo = async (toSave) => {
    await AsyncStorage.setItem(storageKey, JSON.stringify(toSave));
  };

  const loadTodo = async () => {
    const s = await AsyncStorage.getItem(storageKey);
    setTodos(JSON.parse(s));
  };

  useEffect(() => {
    loadTodo();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Travel}>
          <Text
            style={styles.btnText}
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder={working ? " Add a To Do" : "where do you wanna go?"}
        style={styles.input}
        onChangeText={onChnageText}
        onSubmitEditing={addTodo}
        returnKeyType="done"
      />
      <ScrollView>
        {Object.keys(Todos).map((key) =>
          Todos[key].work === working ? (
            <View style={styles.todo} key={key}>
              <Text style={styles.todoText}>{Todos[key].text}</Text>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  todo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
