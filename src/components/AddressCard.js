import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const AddressCard = ({
  name,
  type,
  address,
  mobile,
  selected,
  onSelect,
  onRemove,
  onEdit,
}) => {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.card,
        selected && styles.cardActive
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.radioOuter,
            selected && styles.radioOuterActive,
          ]}
        >
          {selected && <View style={styles.radioInner} />}
        </View>

        <Text style={styles.name}>{name}</Text>

        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.addressBlock}>
        <Text style={styles.subText}>{address}</Text>
        <Text style={styles.subText}>Mobile: {mobile}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={styles.actionBtn}
        >
          <Text style={styles.actionText}>Remove</Text>
        </Pressable>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          style={styles.actionBtn}
        >
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.08)", // glass base
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  cardActive: {
    borderColor: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterActive: {
    borderColor: "#fff",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },

  typeText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },

  addressBlock: {
    marginLeft: 30,
    marginTop: 4,
    gap: 2,
  },

  subText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 30,
    marginTop: 10,
  },

  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  actionText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
});

