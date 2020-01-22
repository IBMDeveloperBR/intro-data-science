import React, { useState } from 'react';
import {
    Header,
    HeaderName,
    HeaderGlobalBar,
    HeaderGlobalAction
} from 'carbon-components-react/lib/components/UIShell';
import ChangeCredentials from './modals/ChangeCredentials';
import { ToastNotification } from 'carbon-components-react';
import GithubIcon32 from '@carbon/icons-react/lib/logo--github/32';
import SettingsIcon32 from '@carbon/icons-react/lib/settings/32';

const AppHeader = (props) => {

    const initialState = {
        showModal: false,
        notification: false,
        errMsg: ""
    };

    const [state, setState] = useState(initialState);

    const onChangeCredentialsHandler = async (credentials) => {
        // props.setLoading();
        console.log('Changing credentials:', credentials)
        setState({ ...state, showModal: false });
        // const rawResponse = await fetch('/credenciais', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        //     body: JSON.stringify({
        //         ...credentials
        //     })
        // });
        // const content = await rawResponse.json();
        // props.cancel();
        // if (content.err === true) {
        //     setState({ showModal: false, notification: "error", errMsg: content.msg });
        // } else {
        //     setState({ showModal: false, notification: "success" });
        // };
    };

    let modal;
    if (state.showModal === true) {
        modal = <ChangeCredentials
            close={() => setState({ ...state, showModal: false })}
            submit={onChangeCredentialsHandler}
        />;
    } else {
        modal = null;
    };

    let notification;
    if (notification !== false) {
        switch (state.notification) {
            case "error":
                notification = (
                    <div className="modal-settings">
                        <ToastNotification
                            kind="error"
                            title="Erro"
                            subtitle={state.errMsg}
                            iconDescription="Fechar"
                            onCloseButtonClick={() => setState({ ...state, notification: false, errMsg: "" })}
                            caption={Date()}
                        />
                    </div>
                );
                break;
            case "success":
                notification = (
                    <div className="modal-settings">
                        <ToastNotification
                            kind="success"
                            title="Sucesso"
                            subtitle="Modelo alterado com sucesso."
                            iconDescription="Fechar"
                            onCloseButtonClick={() => setState({ ...state, notification: false })}
                            caption={Date()}
                        />
                    </div>
                );
                break;
            default:
                notification = null;
                break;
        }
    } else {
        notification = null;
    }

    return (
        <Header aria-label="IBM Digital Chistmas Challenge">
            {modal}
            {notification}
            <HeaderName href="https://developer.ibm.com" target="_blank" prefix="IBM">
                Developer Ecossystem Group
            </HeaderName>
            <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Github" onClick={() => window.open("https://github.com/ibmdeveloperbr/intro-data-science")}>
                    <GithubIcon32 />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Settings" onClick={() => setState({ ...state, showModal: true })}>
                    <SettingsIcon32 />
                </HeaderGlobalAction>
            </HeaderGlobalBar>
        </Header>
    );
};

export default AppHeader;