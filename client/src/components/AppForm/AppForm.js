import { Form, TextInput, Button } from 'carbon-components-react';
import React, { useState } from 'react';
import classes from './AppForm.module.css';

const AppForm = ({ onSubmit }) => {
    const initialState = {
        gvap: 0,
        gvai: 0,
        gvas: 0
    };
    const [state, setState] = useState(initialState);

    const changeInputHandler = (event, type) => {
        let value = parseInt(event.target.value);
        let maxValue;
        if (type === 'gvap')
            maxValue = 2000000;
        else if (type === 'gvai')
            maxValue = 15000000;
        else
            maxValue = 10000000;
        if (!value)
            value = 0;
        else if (value < 0)
            value = 0;
        else if (value > maxValue)
            value = maxValue;

        setState({ ...state, [type]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        await onSubmit(state);
    };

    return (
        <Form onSubmit={submitHandler}>
            <TextInput className={classes.gvaInput} labelText="GVA público em milhares de reais (0~2mi)" name="GVA-p" id="GVA-p" required value={state.gvap} onChange={e => changeInputHandler(e, 'gvap')} />
            <TextInput className={classes.gvaInput} labelText="GVA de serviços em milhares de reais (0~10mi)" name="GVA-s" id="GVA-s" required value={state.gvas} onChange={e => changeInputHandler(e, 'gvas')} />
            <TextInput className={classes.gvaInput} labelText="GVA industrial em milhares de reais (0~15mi)" name="GVA-i" id="GVA-i" required value={state.gvai} onChange={e => changeInputHandler(e, 'gvai')} />
            <Button type="submit">Enviar</Button>
        </Form>
    );
};

export default AppForm;