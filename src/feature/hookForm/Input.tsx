/* eslint-disable import/prefer-default-export */
import { Themes } from 'assets/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    StyleSheet,
    View,
    Text,
    TextInputProps,
    TextInput,
    StyleProp,
    TextStyle,
    ColorValue,
    ReturnKeyTypeOptions,
} from 'react-native';

interface InputProps {
    label?: string;
    error?: string;
    customStyle?: StyleProp<TextStyle>;
    customPlaceHolder?: string;
    placeholderTextColor?: string;
    customUnderlineColor?: ColorValue;
    customReturnKeyType?: ReturnKeyTypeOptions;
}

export const Input = React.forwardRef((props: any, forwardedRef: any) => {
    const { label, error, ...textInputProps } = props;
    const isError = !!error;
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            {!!label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                ref={forwardedRef}
                style={[
                    styles.textInput,
                    props.customStyle,
                    isError && { borderColor: Themes.COLORS.borderInputError },
                ]}
                placeholderTextColor={props.placeholderTextColor || Themes.COLORS.textSecondary}
                placeholder={props.customPlaceHolder ? t(props.customPlaceHolder) : ''}
                underlineColorAndroid={props.customUnderlineColor || 'transparent'}
                importantForAutofill="yes"
                autoCorrect={false}
                returnKeyType={props.customReturnKeyType || 'next'}
                blurOnSubmit={!!props.customReturnKeyType}
                {...textInputProps}
            />
            {isError && <Text style={styles.textError}>{error}</Text>}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    label: {
        fontSize: 12,
    },
    textError: {
        color: 'red',
    },
    containerInput: {
        marginTop: 10,
    },
    textInput: {
        padding: 2,
        borderWidth: 0.5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: 'black',
        borderRadius: 5,
        marginBottom: 5,
    },
});
