import React from "react";
import { View, Image } from "react-native";
import { Text, TouchableRipple, Badge } from "react-native-paper";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Link } from "expo-router"; 
import tw from "@/utils/tailwind copy";

interface ReservationCardProps {
  item: {
    _id: string;
    status: string;
    numberOfPersons: number;
    createdAt: string;
    offerId: {
      _id: string;
      titre: string;
      startDate: string;
      location?: string;
      photos?: string[];
    };
  };
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "ONGOING":
      return { backgroundColor: "#FF70434D", color: "#FF7043" };
      case "ACCEPT":
        return { backgroundColor: "#D1FAE5", color: "#10B981" };
      
    case "CANCELED":
      return { backgroundColor: "#EF4444", color: "#fff" };
    default:
      return { backgroundColor: "#9CA3AF", color: "#fff" };
  }
};

const ReservationCard: React.FC<ReservationCardProps> = ({ item }) => {
  const formattedDate =
    item.offerId.startDate && !isNaN(new Date(item.offerId.startDate).getTime())
      ? format(new Date(item.offerId.startDate), "dd MMM yyyy", { locale: enUS })
      : "Date inconnue";

  return (
    <Link href={`/details/${item.offerId._id}`} > 
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .1)"
        style={tw`flex-row items-center p-2 mb-3 bg-white border border-gray-200 rounded-lg shadow-xs`}
      >
        <>
          {/* Image */}
          <Image
            source={{ uri: item.offerId.photos?.[0] || "https://via.placeholder.com/150" }}
            style={tw`w-20 rounded-lg h-25`}
          />

          {/* Contenu Texte */}
          <View style={tw`flex-1 ml-4 mxh`}>
            <Text 
              style={tw`text-sm font-semibold text-gray-900 max-w-[200px]`} 
              numberOfLines={2} 
              ellipsizeMode="tail"
            >
              {item.offerId.titre}
            </Text>

            <Text style={tw`mt-1 text-xs text-gray-600`}>{formattedDate}</Text>
            <Text style={tw`mt-1 text-xs text-gray-500`}>
              Participants : {item.numberOfPersons}
            </Text>
          </View>

          {/* Badge Statut */}
          <Badge
            style={[
              tw`self-start px-3 mt-2 mr-1 rounded-full`,
              { backgroundColor: getStatusStyle(item.status).backgroundColor, color: getStatusStyle(item.status).color, fontSize: 11, fontWeight: "bold" },
            ]}
          >
            {item.status}
          </Badge>
        </>
      </TouchableRipple>
    </Link>
  );
};

export default ReservationCard;
