import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, TextInput } from 'carbon-components-react';

const ChangeCredentials = ({ close, submit }) => {

    const initialState = {
        credentials: {
            url: "",
            apikey: ""
        }
    }

    const [state, setState] = useState(initialState);

    return (
        <div>
            <Modal
                open
                aria-label="Trocar Credenciais"
                iconDescription="Fechar"
                primaryButtonText="Trocar"
                secondaryButtonText="Cancelar"
                modalHeading="Troque suas credenciais do Watson Machine Learning"
                style={{ textAlign: "left" }}
                onRequestClose={close}
                onRequestSubmit={() => submit(state.credentials)}
            >
                <TextInput
                    style={{ marginBottom: "16px" }}
                    id="wml-url"
                    labelText="URL do Watson Machine Learning"
                    placeholder="Digite a URL..."
                    onChange={(e) => setState({ ...state, credentials: { ...state.credentials, url: e.target.value } })}
                    value={state.credentials.url}
                />
                <TextInput
                    // style={{ marginBottom: "16px" }}
                    id="wml-apikey"
                    labelText="Chave API do Watson Machine Learning"
                    placeholder="Digite a chave..."
                    onChange={(e) => setState({ ...state, credentials: { ...state.credentials, apikey: e.target.value } })}
                    value={state.credentials.apikey}
                />
            </Modal>
        </div>
    );
};

ChangeCredentials.propTypes = {
    close: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired
}

export default ChangeCredentials;