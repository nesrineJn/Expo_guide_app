import React, { useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import tw from "@/utils/tailwind copy";

interface MiniCalendarProps {
  onSelectDates: (dates: string[]) => void; // ✅ Prop pour envoyer les dates filtrées
}

const generateDays = (monthOffset = 0) => {
    const currentMonth = dayjs().add(monthOffset, "month");
    const daysInMonth = currentMonth.daysInMonth();
    const days = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.date(i).utc(); // ✅ Convertir en UTC
      days.push({
        day: date.format("DD"),
        weekDay: date.format("dd").charAt(0),
        fullDate: date.format("YYYY-MM-DD"), // ✅ Date bien en UTC
      });
    }
    return days;
  };
  

const MiniCalendar: React.FC<MiniCalendarProps> = ({ onSelectDates }) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
console.log("selectedDays",selectedDays)
  const days = generateDays(monthOffset);
  const currentMonth = dayjs().add(monthOffset, "month").format("MMMM");

  // ✅ Fonction pour gérer la sélection de plusieurs jours
  const toggleDaySelection = (day: string) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day) // 🔹 Supprime si déjà sélectionné
      : [...selectedDays, day]; // 🔹 Ajoute sinon

    setSelectedDays(newSelectedDays);
    onSelectDates(newSelectedDays); // ✅ Envoie les dates filtrées au parent
  };

  return (
    <View style={tw`p-3 rounded-lg`}>
      {/* 🔹 Header du calendrier */}
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <TouchableOpacity onPress={() => setMonthOffset(monthOffset - 1)}>
          <MaterialIcons name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-gray-900`}>{currentMonth}</Text>
        <TouchableOpacity onPress={() => setMonthOffset(monthOffset + 1)}>
          <MaterialIcons name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Liste des jours */}
      <FlatList
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.fullDate}
        renderItem={({ item }) => {
          const isSelected = selectedDays.includes(item.fullDate);
          return (
            <TouchableOpacity
              onPress={() => toggleDaySelection(item.fullDate)}
              style={tw.style(
                "mx-1 px-3 py-1 rounded-lg items-center",
                isSelected ? "bg-orange-500" : "bg-gray-200"
              )}
            >
              <Text style={tw.style("text-sm", isSelected ? "text-white font-bold" : "text-gray-500")}>
                {item.weekDay}
              </Text>
              <Text style={tw.style("text-sm font-semibold", isSelected ? "text-white" : "text-gray-900")}>
                {item.day}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default MiniCalendar;
