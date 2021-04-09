import React, {
    Component
} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    TouchableHighlight, StatusBar, Alert
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {
    TwilioVideoLocalView,
    TwilioVideoParticipantView,
    TwilioVideo
} from 'react-native-twilio-video-webrtc';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import normalize from 'react-native-normalize';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ActivityIndicator } from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class Video extends Component {
    state = {
        isAudioEnabled: true,
        isVideoEnabled: true,
        isButtonDisplay: true,
        status: 'disconnected',
        participants: new Map(),
        videoTracks: new Map(),
        roomName: '',
        token: '',
        loading: false,
        loading2: false,
        successText: "",
        error: "",
        user_token: "",
        copiedText: false
    }

    _user_token = async () => {
      let token = await AsyncStorage.getItem("user");
      this.setState({
        user_token: token
      })
    }
    
    componentDidMount() {
      this._user_token()
    }

_onCreate = () => {
  this.setState({
    loading: true,
    error: "",
  })
  Axios.get("https://bellefu.com/api/user/video_call/grant/token", {
      headers: {
        Authorization: `Bearer ${this.state.user_token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }).then((res) => {
      this.setState({
        loading: false,
        roomName: res.data.room_name,
        token: res.data.token,
        successText: "Room created successfully, invite participant with below room name."
      })
    }).catch((e) => {
      Alert.alert("error", "something went wrong. Try again in a few seconds.")
    })
}

_onConnectButtonPress = () => {
  this.setState({
    loading2: true,
  })
    if(this.state.token.length === 0){
      Axios.get(`https://bellefu.com/api/user/video_call/grant/token/${this.state.roomName.length === 0 ? "nothing": this.state.roomName}`, {
      headers: {
        Authorization: `Bearer ${this.state.user_token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }).then((res) => {
      this.refs.twilioVideo.connect({ roomName: this.state.roomName, accessToken: res.data.token})
      this.setState({status: 'connecting', error: "", loading2: false})
    }).catch((e) => {
      Alert.alert("error", e.response.data.message)
    })
    } else {
      this.refs.twilioVideo.connect({ roomName: this.state.roomName, accessToken: this.state.token})
      this.setState({status: 'connecting', error: "", loading2: false})
    }
  }

  _onEndButtonPress = () => {
    this.refs.twilioVideo.disconnect()
    this.setState({status: 'disconnected'})
  }

  _onMuteButtonPress = () => {
    this.refs.twilioVideo.setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then(isEnabled => this.setState({isAudioEnabled: isEnabled}))
  }

  _onFlipButtonPress = () => {
    this.refs.twilioVideo.flipCamera()
  }
_onRoomDidConnect = () => {
    this.setState({status: 'connected', error: "",})
  }

  _onRoomDidDisconnect = ({roomName, error}) => {
    if(error !== undefined){
      let string = JSON.stringify(error.error)

      if(typeof string == "string" && string.includes("Unable to create Room")){
        this.setState({
          error: "Room does not exist or expired!"
        })
      } else {
        this.setState({
          error: string
        })
      }
    }
    this.setState({status: 'disconnected'})
    this._onEndButtonPress()
  }

  _onRoomDidFailToConnect = (error) => {
    let string = JSON.stringify(error.error)
      if(typeof string == "string" && string.includes("Unable to create Room")){
        this.setState({
          error: "Room does not exist or expired!"
        })
      } else {
        this.setState({
          error: string
        })
      }
    this.setState({status: 'disconnected'})
    this._onEndButtonPress()
  }

  _onParticipantAddedVideoTrack = ({participant, track}) => {
    this.setState({
      videoTracks: new Map([
        ...this.state.videoTracks,
        [track.trackSid, { participantSid: participant.sid, videoTrackSid: track.trackSid }]
      ]),
    });    
  }

  _onParticipantRemovedVideoTrack = ({participant, track}) => {
    const videoTracks = this.state.videoTracks
    videoTracks.delete(track.trackSid)
    this.setState({videoTracks: { ...videoTracks }})
  }

  _copyToClipboard = (text) => {
    Clipboard.setString(text);
    this.setState({
      copiedText: true
    })
    setTimeout(() => {
      this.setState({
        copiedText: false
      })
    }, 3000)
  };
   render() {
        return (
        <View style={styles.container} >
          {this.state.status === "connecting" || this.state.status === "connected" ? (
            <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#121212" translucent = {true}/>
          ) : (
            <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#ffffff" translucent = {true}/>
          )
        }

        {
            this.state.status === 'disconnected' &&
            <View>
                <Text style={styles.welcome}>
                  Bellefu video
                </Text>
                <View style={styles.spacing}>
                      <Text style={styles.inputLabel}>Join Room</Text>
                      <TextInput style={styles.inputBox}
                      placeholder="Room Name"
                      defaultValue={this.state.roomName}
                      onChangeText={(text) => this.setState({roomName: text})}
                      />
                  </View>
                {this.state.loading2 ? (
                  <ActivityIndicator style={{marginTop: 20}} color="#ffa500" animating size="large" />
                ) : (
                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this._onConnectButtonPress}>
                    <Text style={styles.Buttontext}>Join</Text>
                </TouchableHighlight>
                )}
                {this.state.loading ? (
                  <ActivityIndicator style={{marginTop: 20}} color="#76ba1b" animating size="large" />
                ) : (

                <View>
                  {this.state.error.length > 0 && (
                    <Text style={{marginTop: 20, textAlign: "center", color: "#f71e4d"}}>{this.state.error}</Text>
                  )}
                  {this.state.successText.length > 0 && (
                    <View style={{marginTop: 20, marginHorizontal: 5}}>
                      <Text style={{textAlign: "center",}}>{this.state.successText}</Text>
                      <View style={{marginTop: 7}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", textAlign: "center", flexGrow: 1}}>{this.state.roomName}</Text>
                        <TouchableOpacity onPress={() => this._copyToClipboard(this.state.roomName)}>
                          <Text style={{fontSize: 16, color: "#76ba1b", textAlign: "center"}}>{this.state.copiedText ? "copied" : "copy"}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {(this.state.successText.length === 0) && (
                    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton, {backgroundColor: "#76ba1b"}]} onPress={this._onCreate}>
                      <Text style={styles.Buttontext}>Create New Room</Text>
                    </TouchableHighlight>
                  )}
                </View>
                )
              }
            </View>
        }

        {
          (this.state.status === 'connected' || this.state.status === 'connecting') &&
            <View style={styles.callContainer}>
            {
              this.state.status === 'connected' &&
              <View style={styles.remoteGrid}>
                <TouchableOpacity style = {styles.remoteVideo} onPress={()=>{this.setState({isButtonDisplay:!this.state.isButtonDisplay})}} >
                {
                  Array.from(this.state.videoTracks, ([trackSid, trackIdentifier]) => {
                    return (
                        <TwilioVideoParticipantView
                          style={styles.remoteVideo}
                          key={trackSid}
                          trackIdentifier={trackIdentifier}
                        />
                    )
                  })
                }
                </TouchableOpacity>
                <TwilioVideoLocalView
                  enabled={true}
                  style = {this.state.isButtonDisplay ? styles.localVideoOnButtonEnabled : styles.localVideoOnButtonDisabled} 
                />
              </View>
            }
            <View
              style = {
                {
                  display: this.state.isButtonDisplay ? "flex" : "none",
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  right: 0,
                  height: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  backgroundColor:"transparent",
                  zIndex: this.state.isButtonDisplay ? 2 : 0,
                }
              } >
              <TouchableOpacity
                style={
                    {
                      display: this.state.isButtonDisplay ? "flex" : "none",
                      width: 60,
                      height: 60,
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 100 / 2,
                      backgroundColor: 'grey',
                      justifyContent: 'center',
                      alignItems: "center"
                    }
                  }
                onPress={this._onMuteButtonPress}>
                < MIcon name ={this.state.isAudioEnabled ? "mic" : "mic-off"} size={24} color='#fff' />
              </TouchableOpacity>
               <TouchableOpacity
                style={
                    {
                      display: this.state.isButtonDisplay ? "flex" : "none",
                      width: 60,
                      height: 60,
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 100 / 2,
                      backgroundColor: 'grey',
                      justifyContent: 'center',
                      alignItems: "center"
                    }
                  }
                onPress={this._onEndButtonPress}>
                < MIcon name = "call-end" size={29} color='#f51616' />
              </TouchableOpacity>
              <TouchableOpacity
                style={
                    {
                      display: this.state.isButtonDisplay ? "flex" : "none",
                      width: 60,
                      height: 60,
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 100 / 2,
                      backgroundColor: 'grey',
                      justifyContent: 'center',
                      alignItems: "center"
                    }
                  }
                onPress={this._onFlipButtonPress}>
                < MCIcon name = "rotate-3d" size={28} color='#fff' />
              </TouchableOpacity>
            </View>
          
          </View>
        }
        <TwilioVideo
          ref="twilioVideo"
          onRoomDidConnect={ this._onRoomDidConnect }
          onRoomDidDisconnect={ this._onRoomDidDisconnect }
          onRoomDidFailToConnect= { this._onRoomDidFailToConnect }
          onParticipantAddedVideoTrack={ this._onParticipantAddedVideoTrack }
          onParticipantRemovedVideoTrack= { this._onParticipantRemovedVideoTrack }
        />
        </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#121212",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    minHeight:"100%"
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white'
  },
  button: {
    marginTop: 100
  },
  localVideoOnButtonEnabled: {
    bottom: ("40%"),
    width: "35%",
    left: "64%",
    height: "25%",
    zIndex: 2,
  },
  localVideoOnButtonDisabled: {
    bottom: ("30%"),
    width: "35%",
    left: "64%",
    height: "25%",
    zIndex: 2,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "column",
  },
  remoteVideo: {
    width: wp("100%"),
    height: hp("100%"),
    zIndex: 1,
  },
  optionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 2,
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: "center"
  },
  spacing: {
    padding: 10
  },
  inputLabel: {
    fontSize: 18
  },
  buttonContainer: {
    height: normalize(45),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: wp('90%'),
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#ffa500",
    width: wp('90%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10
  },
  Buttontext: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
    textAlign: "center"
  },
  inputBox: {
    borderBottomColor: '#cccccc',
    fontSize: 16,
    width: wp("95%"),
    borderBottomWidth:1
  },
});