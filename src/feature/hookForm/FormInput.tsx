/* eslint-disable import/prefer-default-export */
import React from 'react';
import { ControllerRenderProps, useController, UseControllerOptions, useFormContext } from 'react-hook-form';
import { TextInputProps } from 'react-native';

import { Input } from './Input';

interface FormInputProps extends TextInputProps {
    name: string;
    rules?: any;
    defaultValue?: string;
    label?: string;
}

const ControlledInput = React.forwardRef((props: FormInputProps, forwardedRef: any) => {
    const { name, rules, defaultValue = '', ...inputProps } = props;
    const formContext = useFormContext();
    const { control, errors } = formContext;
    const { field } = useController({ name, control, rules, defaultValue });

    return (
        <Input
            {...inputProps}
            error={errors[name]?.message}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            ref={forwardedRef}
        />
    );
});
const r = {
    errors: {
        test1: { message: 'common.requireInput', ref: [Object], type: 'required' },
        test2: { message: 'Vui lòng nhập tối thiểu 6 ký tự', ref: [Object], type: 'minLength' },
    },
};

export const FormInput = React.forwardRef((props: FormInputProps, forwardedRef) => {
    const { name, ...inputProps } = props;
    const formContext = useFormContext();
    if (!formContext) {
        const errorMessage = 'Need Wrap Form Input By FormProvider';
        return <Input {...inputProps} error={errorMessage} editable={false} />;
    }

    return <ControlledInput {...props} ref={forwardedRef} />;
});
