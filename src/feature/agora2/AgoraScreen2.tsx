import * as React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';
import StyledText from 'components/base/StyledText';
import { StyledButton, StyledInput } from 'components/base';
import AuthenticateService from 'utilities/authenticate/AuthenticateService';
import requestCameraAndAudioPermission from 'components/base/Permission';
import RtcEngine, {
    ChannelProfile,
    ClientRole,
    RtcLocalView,
    RtcRemoteView,
    VideoRenderMode,
} from 'react-native-agora';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onChange } from 'react-native-reanimated';
import Video from './Video';

const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};
interface AgoraState {
    appId: string;
    token: string;
    channelName: string;
    joinSucceed: boolean;
    peerIds: number[];
}

const agoraId = 'd62d96fc554a4972b4c3ed2979470ca6';
const appSecret = '2e3cd383f35c469189bced13db5d496e';
const channelName = 'HeroMiTest1101';
const tempToken =
    '006d62d96fc554a4972b4c3ed2979470ca6IADd+JrQ8c4hBtogrXibdxFb8pNss/HhuNh65e5sPgB8+oO+/koAAAAAEACyc3BidBT9XwEAAQBzFP1f';

const AgoraView2: React.FunctionComponent = () => {
    // const [agoraState, setAgoraState] = React.useState<AgoraState>({
    //     appId: agoraId,
    //     token: tempToken,
    //     channelName,
    //     joinSucceed: false,
    //     peerIds: [],
    // })
    // let engine: RtcEngine = new RtcEngine();
    // const initAgora = async () => {
    //     const { appId } = agoraState;
    //     engine = await RtcEngine.create(appId);
    //     // Enable the video module.
    //     await engine.enableVideo()
    //     // Enable the local video preview.
    //     await engine.startPreview()
    //     // Set the channel profile as live streaming.
    //     // await engine.setChannelProfile(ChannelProfile.LiveBroadcasting)
    //     // Set the user role as host.
    //     // await engine.setClientRole(ClientRole.Broadcaster)

    //     engine.addListener('Warning', (warn) => {
    //         console.log('Warning', warn);
    //     });

    //     engine.addListener('Error', (err) => {
    //         console.log('Error', err);
    //     });

    //     engine.addListener('UserJoined', (uid, elapsed) => {
    //         console.log('UserJoined', uid, elapsed);
    //         // Get current peer IDs
    //         const { peerIds } = agoraState
    //         // If new user
    //         if (peerIds.indexOf(uid) === -1) {
    //             setAgoraState({
    //                 // Add peer ID to state array
    //                 ...agoraState,
    //                 peerIds: [...peerIds, uid],
    //             });
    //         }
    //     });

    //     engine.addListener('UserOffline', (uid, reason) => {
    //         console.log('UserOffline', uid, reason);
    //         const { peerIds } = agoraState
    //         setAgoraState({
    //             // Remove peer ID from state array
    //             ...agoraState,
    //             peerIds: peerIds.filter((id) => id !== uid),
    //         });
    //     });

    //     engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
    //         console.log('JoinChannelSuccess', channel, uid, elapsed);
    //         // Set state variable to true
    //         setAgoraState({
    //             ...agoraState,
    //             joinSucceed: true,
    //         });
    //     });

    // }

    // React.useEffect(() => {
    //     if (Platform.OS === 'android') {
    //         // Request required permissions from Android
    //         requestCameraAndAudioPermission().then(() => {
    //             console.log('requested!');
    //         });
    //     }
    //     initAgora();
    //     return () => {
    //         endCall();
    //         engine.removeAllListeners();
    //         // engine.destroy();
    //     }
    // }, [])

    // const startCall = async () => {
    //     // Join Channel using null token and channel name
    //     console.log('start')
    //     let res = await engine?.joinChannel(
    //         agoraState.token,
    //         agoraState.channelName,
    //         null,
    //         0
    //     );
    // };
    // const endCall = async () => {
    //     console.log('end')
    //     await engine?.leaveChannel();
    //     setAgoraState({ ...agoraState, peerIds: [], joinSucceed: false });
    // };

    // const renderVideos = () => {
    //     const { joinSucceed } = agoraState
    //     return joinSucceed ? (
    //         <View style={styles.fullView}>
    //             <RtcLocalView.SurfaceView
    //                 style={styles.max}
    //                 channelId={agoraState.channelName}
    //                 renderMode={VideoRenderMode.Hidden}
    //             />
    //             {renderRemoteVideos()}
    //         </View>
    //     ) : null;
    // };

    // const renderRemoteVideos = () => {
    //     const { peerIds } = agoraState;
    //     return (
    //         <ScrollView
    //             style={styles.remoteContainer}
    //             contentContainerStyle={{ paddingHorizontal: 2.5 }}
    //             horizontal={true}
    //         >
    //             {peerIds.map((value) => {
    //                 return (
    //                     <RtcRemoteView.SurfaceView
    //                         style={styles.remote}
    //                         uid={value}
    //                         channelId={agoraState.channelName}
    //                         renderMode={VideoRenderMode.Hidden}
    //                         zOrderMediaOverlay={true}
    //                     />
    //                 );
    //             })}
    //         </ScrollView>
    //     );
    // };
    // const switchCamera = () => {
    //     engine.switchCamera();
    // }
    // const onChangeText = (id: string, data: string) => {
    //     console.log(data, id)
    //     setAgoraState({
    //         ...agoraState, [id]: data
    //     })
    // }
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
            {/* <View style={styles.buttonHolder}>
                <StyledButton onPress={startCall} title={'Start Call'} />
                <StyledButton onPress={switchCamera} title={'Switch Cam'} />
                <StyledButton onPress={endCall} title={'End Call'} />
            </View>
            <StyledInput placeholder={'Channel name'} placeholderTextColor={'grey'} defaultValue={agoraState.channelName} onChangeText={(value) => onChangeText('channel', value)} />
            <StyledInput placeholder={'Token'} placeholderTextColor={'grey'} defaultValue={agoraState.token} onChangeText={(value) => onChangeText('token', value)} customStyle={{ height: 120 }} multiline={true} />
            {renderVideos()} */}
        </SafeAreaView>
    );
};
export default AgoraView2;
const styles = StyleSheet.create({
    max: {
        flex: 1,
    },
    buttonHolder: {
        width: '100%',
        alignItems: 'center',
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0093E9',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: dimensions.width,
        height: dimensions.height / 2,
        marginVertical: 20,
    },
    remoteContainer: {
        width: '100%',
        height: 150,
        position: 'absolute',
        top: 5,
    },
    remote: {
        width: 150,
        height: 150,
        marginHorizontal: 2.5,
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
});
