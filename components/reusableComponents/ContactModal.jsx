import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card, Paragraph, Button, Portal, Modal } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Icon from "react-native-vector-icons/AntDesign";

const ContactModal = (props) => {
  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={props.hideModal}
        style={{ justifyContent: "center", alignItem: "center" }}
      >
        <Card
          style={{
            marginTop: 5,
            borderRadius: 0,
            height: 100,
            alignItem: "center",
          }}
        >
          <View style={{flexDirection: "row", marginTop:10}}>
            <View style={{marginLeft: 10}}>
            <TouchableOpacity onPress={() => props.openPhone(props.phone)}>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  style={{ paddingLeft: 20 }}
                  color="#76ba1b"
                />
                <Text style={{ marginLeft: 2, fontWeight: "bold" }}>Call</Text>
              </View>
            </TouchableOpacity>
            </View>
            <View style={{marginLeft: 50}}>
            <TouchableOpacity
              onPress={() =>
                props.shareToWhatsAppWithContact(
                  "Hi, I'm contacting you regarding your ad on bellefu",
                  props.phone
                )
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="whatsapp"
                  size={20}
                  style={{ paddingLeft: 20 }}
                  color="#76ba1b"
                />
                <Text style={{ marginLeft: 2, fontWeight: "bold" }}>
                  Whatsapp
                </Text>
              </View>
            </TouchableOpacity>
            </View>
          </View>
        </Card>
      </Modal>
    </Portal>
  );
};

export default ContactModal;
