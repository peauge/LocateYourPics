import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';

class ErrorModal extends Component {

  state = {
    modalVisible: true,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
            <Text>"La combinaison Identifant / Mot de passe est incorrect"</Text>
          </View>
         </View>
        </Modal>
      </View>
    );
  }
}

module.exports = ErrorModal
