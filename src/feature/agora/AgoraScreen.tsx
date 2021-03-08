/* eslint-disable no-unused-expressions */
import Images from 'assets/images';
import { StyledButton, StyledIcon } from 'components/base';
import requestCameraAndAudioPermission from 'components/base/Permission';
import StyledHeader from 'components/common/StyledHeader';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isIos } from 'utilities/helper';

const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};
interface AgoraState {
    token: string;
    channelName: string;
    peerIds: number[];
    joinSucceed: boolean;
}

const agoraId = 'd62d96fc554a4972b4c3ed2979470ca6';
const appSecret = '2e3cd383f35c469189bced13db5d496e';
const channelName = 'test_100';
const tempToken =
    '006d62d96fc554a4972b4c3ed2979470ca6IAAbEIQjWkpTSN0u0p7cjY4wHZJRfNl4PhbAkoarYyiV8C2MCloAAAAAEAAEa9nrWshFYAEAAQBZyEVg';

const AgoraView = () => {
    const [agoraState, setAgoraState] = useState<AgoraState>({
        token: tempToken,
        channelName,
        peerIds: [],
        joinSucceed: false,
    });
    let engine = new RtcEngine();
    const [optionsCall, setOptionsCall] = React.useState<any>({
        enableVideo: true, // true: (Default) Re-enable the local video. enableLocalVideo
        muteAllRemoteAudio: false, // true: Stop receiving all remote audio streams. muteAllRemoteAudioStreams
        muteLocalAudio: false, // true: Stop sending the local audio stream. muteLocalAudioStream
    });
    const { enableVideo, muteAllRemoteAudio, muteLocalAudio } = optionsCall;
    const { peerIds } = agoraState;
    const [joinSucceed, setJoinSucceed] = useState(false);
    const init = async () => {
        engine = await RtcEngine.create(agoraId);
        engine.enableVideo();
        engine.addListener('Warning', (warn) => {
            // console.log('Warning', warn);
        });
        engine.addListener('Error', (err) => {
            console.log('Error', err);
        });
        engine.addListener('JoinChannelSuccess', onJoinChannelSuccess);
        engine.addListener('UserOffline', onUserOffline);
        engine.addListener('UserJoined', onUserJoined);
    };
    useEffect(() => {
        console.log(agoraState);
    }, [agoraState]);
    useEffect(() => {
        if (Platform.OS === 'android') {
            requestCameraAndAudioPermission().then(() => {
                console.log('requested!');
            });
        }
        init();
        return () => {
            engine.removeAllListeners();
            engine.destroy();
        };
    }, []);
    const onUserOffline = (uid: number, reason: any) => {
        console.log('UserOffline', uid, reason);
        setAgoraState({
            ...agoraState,
            peerIds: peerIds.filter((id) => id !== uid),
        });
    };
    const onUserJoined = (uid: number, elapsed: any) => {
        console.log('UserJoined', peerIds, uid, elapsed);
        if (peerIds.indexOf(uid) === -1) {
            setAgoraState({
                ...agoraState,
                peerIds: [...peerIds, uid],
            });
        }
    };
    const onJoinChannelSuccess = (channel: string, uid: number, elapsed: any) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
        setJoinSucceed(true);
    };
    const startCall = async () => {
        console.log('start agora', agoraState);
        const res = await engine.joinChannel(agoraState.token, agoraState.channelName, null, 0);
    };
    const endCall = async () => {
        await engine.leaveChannel();
        setAgoraState({ ...agoraState, peerIds: [] });
        setJoinSucceed(false);
    };

    const toggleLocalVideo = async () => {
        await engine.enableLocalVideo(!enableVideo);
        setOptionsCall({ ...optionsCall, enableVideo: !enableVideo });
    };
    const toggleRemoteAudio = async () => {
        await engine.muteAllRemoteAudioStreams(!muteAllRemoteAudio);
        setOptionsCall({ ...optionsCall, muteAllRemoteAudio: !muteAllRemoteAudio });
    };
    const toggleLocalAudio = async () => {
        await engine.muteLocalAudioStream(!muteLocalAudio);
        setOptionsCall({ ...optionsCall, muteLocalAudio: !muteLocalAudio });
    };
    const renderVideos = () => {
        return joinSucceed ? (
            <View style={styles.fullView}>
                <RtcLocalView.SurfaceView
                    style={styles.max}
                    channelId={agoraState.channelName}
                    renderMode={VideoRenderMode.Hidden}
                    zOrderMediaOverlay={false}
                />
                {renderRemoteVideos()}
                <View style={styles.optionVideoCall}>
                    <TouchableOpacity onPress={toggleLocalVideo}>
                        <StyledIcon
                            size={25}
                            source={Images.icons.video.on}
                            customStyle={{ tintColor: enableVideo ? 'aqua' : 'gray' }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleRemoteAudio}>
                        <StyledIcon
                            size={25}
                            source={Images.icons.volume.on}
                            customStyle={{ tintColor: muteAllRemoteAudio ? 'gray' : 'purple' }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleLocalAudio}>
                        <StyledIcon
                            size={25}
                            source={Images.icons.mic.on}
                            customStyle={{ tintColor: muteLocalAudio ? 'gray' : 'green' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        ) : null;
    };

    const renderRemoteVideos = () => {
        return (
            <ScrollView
                style={styles.remoteContainer}
                contentContainerStyle={{ paddingHorizontal: 2.5 }}
                horizontal={true}
            >
                {peerIds.map((value, index, array) => {
                    console.log('render remote', peerIds);
                    return (
                        <RtcRemoteView.SurfaceView
                            style={styles.remote}
                            key={value}
                            uid={value}
                            channelId={agoraState.channelName}
                            renderMode={VideoRenderMode.Hidden}
                            zOrderMediaOverlay={false}
                        />
                    );
                })}
            </ScrollView>
        );
    };
    const switchCamera = () => {
        engine.switchCamera();
    };
    const onChangeText = (id: string, data: string) => {
        console.log(data, id);
        setAgoraState({
            ...agoraState,
            [id]: data,
        });
    };
    return (
        <>
            <StyledHeader title={'Video'} canGoBack={false} />
            <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                <ScrollView>
                    <View style={styles.buttonHolder}>
                        <StyledButton onPress={startCall} title={'Start Call'} />
                        <StyledButton onPress={switchCamera} title={'Switch Cam'} />
                        <StyledButton onPress={endCall} title={'End Call'} />
                    </View>
                    {/* <StyledInput
                    placeholder={'Channel name'}
                    placeholderTextColor={'grey'}
                    defaultValue={agoraState.channelName}
                    onChangeText={(value) => onChangeText('channelName', value)}
                />
                <StyledInput
                    placeholder={'Token'}
                    placeholderTextColor={'grey'}
                    defaultValue={agoraState.token}
                    onChangeText={(value) => onChangeText('token', value)}
                    customStyle={{ height: 120 }}
                    multiline={true}
                /> */}
                    {renderVideos()}
                </ScrollView>
            </SafeAreaView>
        </>
    );
};
export default AgoraView;
const styles = StyleSheet.create({
    max: {
        flex: 1,
        backgroundColor: 'aqua',
    },
    buttonHolder: {
        width: '100%',
        alignItems: 'center',
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
        flex: 1,
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
    optionVideoCall: {
        position: 'absolute',
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-evenly',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
