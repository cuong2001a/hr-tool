import { ConfigProvider } from 'antd';
import viVn from 'antd/lib/locale/vi_VN';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store, { persistor } from './app/store';
import i18n from './translation/i18n';
import { PersistGate } from 'redux-persist/integration/react';
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
