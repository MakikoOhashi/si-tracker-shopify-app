//my-next-app/pages/_app.js

import { AppProvider } from "@shopify/polaris";
import '@shopify/polaris/build/esm/styles.css';
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider i18n={{}}>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default appWithTranslation(MyApp)