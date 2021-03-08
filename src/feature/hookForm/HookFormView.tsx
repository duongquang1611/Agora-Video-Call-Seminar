/* eslint-disable react/self-closing-comp */
import { Themes } from 'assets/themes';
import { StyledButton, StyledText, StyledTouchable } from 'components/base';
import StyledInputForm from 'components/base/StyledInputForm';
import StyledHeader from 'components/common/StyledHeader';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const HookFormView = () => {
    const form = useForm({
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {},
        criteriaMode: 'firstError',
        shouldFocusError: true,
        shouldUnregister: true,
    });
    const { t } = useTranslation();
    const { handleSubmit, reset, watch, getValues, errors } = form;
    const regexPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

    const onSubmit = (formData: any) => {
        alert(JSON.stringify(formData));
    };

    useEffect(() => {
        console.log({ errors });
    }, [watch, errors]);

    return (
        <>
            <StyledHeader title={'Home Screen'} canGoBack={false} />
            <ScrollView contentContainerStyle={styles.container}>
                <StyledInputForm
                    form={form}
                    label={'Require'}
                    placeholder="Input ................"
                    showRequire={true}
                    controlOption={{
                        name: 'test1',
                        rules: {
                            required: 'common.requireInput',
                        },
                    }}
                />
                <StyledInputForm
                    form={form}
                    label={'Min Length'}
                    placeholder="Input ................"
                    controlOption={{
                        name: 'test2',
                        defaultValue: 'aaa',
                        rules: {
                            minLength: {
                                value: 6,
                                message: t('common.minLength', { minLength: 6 }),
                            },
                        },
                    }}
                />
                <StyledInputForm
                    form={form}
                    label={'Max Length'}
                    placeholder="Input ................"
                    controlOption={{
                        name: 'test3',
                        rules: {
                            maxLength: {
                                value: 5,
                                message: t('common.maxLength', { maxLength: 5 }),
                            },
                        },
                    }}
                />
                <StyledInputForm
                    form={form}
                    label={'Min value'}
                    placeholder="Input ................"
                    keyboardType={'numeric'}
                    controlOption={{
                        name: 'test4',
                        rules: {
                            min: {
                                value: 10,
                                message: t('common.minValue', { min: 10 }),
                            },
                        },
                    }}
                />
                <StyledInputForm
                    form={form}
                    label={'Max value'}
                    placeholder="Input ................"
                    keyboardType={'numeric'}
                    controlOption={{
                        name: 'test5',
                        rules: {
                            max: {
                                value: 10,
                                message: t('common.maxValue', { max: 10 }),
                            },
                        },
                    }}
                />
                <StyledInputForm
                    form={form}
                    label={'Pattern Phone Number'}
                    placeholder="Input ................"
                    keyboardType={'phone-pad'}
                    controlOption={{
                        name: 'test6',
                        rules: {
                            pattern: {
                                value: regexPhone,
                                message: 'Số điện thoại không hợp lệ',
                            },
                        },
                    }}
                />
                <StyledInputForm
                    form={form}
                    label={'Validate Password'}
                    placeholder="Input ................"
                    secureTextEntry={true}
                    controlOption={{
                        name: 'test7',
                    }}
                />
                <StyledInputForm
                    form={form}
                    label={'Validate Confirm Password'}
                    placeholder="Input ................"
                    secureTextEntry={true}
                    controlOption={{
                        name: 'test8',
                        rules: {
                            validate: (value) => {
                                console.log({ value, password: watch('test7') });
                                return value === watch('test7') || 'Mật khẩu không trùng khớp';
                            },
                        },
                    }}
                />
                <StyledTouchable onPress={() => reset()} customStyle={[styles.button, styles.buttonCancel]}>
                    <StyledText i18nText={'Reset'} customStyle={styles.textButton} />
                </StyledTouchable>
                <StyledTouchable onPress={handleSubmit(onSubmit)} customStyle={[styles.button]}>
                    <StyledText i18nText={'Submit'} customStyle={styles.textButton} />
                </StyledTouchable>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 10,
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

export default HookFormView;
