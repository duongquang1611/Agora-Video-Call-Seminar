import React, { useState } from 'react';
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
    ReturnKeyTypeOptions,
    ColorValue,
    Text,
    TextProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Size from 'assets/sizes';
import { Themes } from 'assets/themes';
import {
    Controller,
    ControllerProps,
    ControllerRenderProps,
    UseControllerOptions,
    useForm,
    UseFormMethods,
} from 'react-hook-form';
import StyledText from './StyledText';

interface StyledInputProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    customStyle?: StyleProp<TextStyle>;
    customPlaceHolder?: string;
    placeholderTextColor?: string;
    customUnderlineColor?: ColorValue;
    customReturnKeyType?: ReturnKeyTypeOptions;
    ref?: any;
    label?: string;
    showRequire?: boolean;
    form: UseFormMethods;
    controlOption: UseControllerOptions;
    renderProp?: ControllerRenderProps;
}

interface TextErrorProps {
    type: string;
    field: any;
}
const TextError = (props: TextErrorProps) => {
    const { t } = useTranslation();
    const { type, field } = props;
    const msg = type === 'required' ? 'common.requireInput' : 'common.invalidInput';
    return <StyledText customStyle={styles.errorText} i18nText={field.message || msg} />;
};

const StyledInputForm = (props: StyledInputProps, ref: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const input = React.useRef<TextInput>(null);
    const { t } = useTranslation();
    const { label, showRequire = false, form } = props;
    const { control, errors } = form;
    const { name = '', defaultValue = '', rules = {}, ...otherControlOption } = props.controlOption;
    return (
        <View style={[styles.containerInput, props.containerStyle]}>
            {!!label && (
                <Text style={styles.textLabel}>
                    {label}
                    {rules?.required && showRequire && <Text style={{ color: 'red' }}>{' * '}</Text>}
                </Text>
            )}
            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                rules={rules}
                {...otherControlOption}
                render={({ onChange, onBlur, value }) => {
                    return (
                        <TextInput
                            ref={ref || input}
                            onBlur={onBlur}
                            value={value}
                            onChangeText={onChange}
                            style={[
                                styles.textInput,
                                props.customStyle,
                                errors[name] && { borderColor: Themes.COLORS.borderInputError },
                            ]}
                            placeholderTextColor={props.placeholderTextColor || Themes.COLORS.textSecondary}
                            placeholder={props.customPlaceHolder ? t(props.customPlaceHolder) : ''}
                            underlineColorAndroid={props.customUnderlineColor || 'transparent'}
                            importantForAutofill="yes"
                            autoCorrect={false}
                            returnKeyType={props.customReturnKeyType || 'next'}
                            blurOnSubmit={!!props.customReturnKeyType}
                            {...props}
                        />
                    );
                }}
            />
            {errors[name] && <TextError type={errors[name].type} field={errors[name]} />}
        </View>
    );
};
const styles = StyleSheet.create({
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
    textLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
});
export default React.forwardRef(StyledInputForm);
