import { Themes } from 'assets/themes';
import { StyledText, StyledTouchable } from 'components/base';
import StyledHeader from 'components/common/StyledHeader';
import React, { useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import { FormInput } from './FormInput';

const LOGIN_FIELDS = {
    username: 'username',
    password: 'password',
};

const HookFormViewCopy = () => {
    const form = useForm({
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {},
        criteriaMode: 'firstError',
        shouldFocusError: true,
        shouldUnregister: true,
    });
    const passwordRef = useRef<TextInput>();
    const { handleSubmit, errors, trigger } = form;

    const onSubmit = (formData: any) => {
        console.log(formData);
    };
    useEffect(() => {
        trigger();
    }, []);
    useEffect(() => {
        console.log({ errors: Object.keys(errors) });
    }, [errors]);

    const focusPassword = useCallback(() => passwordRef?.current?.focus(), [passwordRef]);

    return (
        <>
            <StyledHeader title={'Home Screen'} canGoBack={false} />
            <View style={styles.container}>
                <FormProvider {...form}>
                    <FormInput
                        name={LOGIN_FIELDS.username}
                        label="Username"
                        rules={{ required: 'Username is required!' }}
                        onSubmitEditing={focusPassword}
                        returnKeyType="next"
                        defaultValue="Test"
                    />
                    <FormInput
                        name={LOGIN_FIELDS.password}
                        label="Password"
                        rules={{
                            required: 'Password is required!',
                            minLength: {
                                message: 'Use at least 10 characters.',
                                value: 10,
                            },
                        }}
                        ref={passwordRef}
                    />
                </FormProvider>
                <StyledTouchable
                    onPress={handleSubmit(onSubmit)}
                    customStyle={[styles.button, Object.keys(errors).length > 0 && { backgroundColor: 'gray' }]}
                    disabled={Object.keys(errors).length > 0}
                >
                    <StyledText i18nText={'Submit'} customStyle={styles.textButton} />
                </StyledTouchable>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        padding: 10,
    },
    button: {
        width: '100%',
        marginTop: 5,
        backgroundColor: Themes.COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },
    buttonCancel: {
        width: '100%',
        marginTop: 20,
        backgroundColor: 'orange',
    },
    btnGroup: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        padding: 10,
    },
    textButton: {
        color: 'white',
    },
});
export default HookFormViewCopy;
