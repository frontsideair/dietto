import { Flex } from "@adobe/react-spectrum";
import Tabs from "../components/Tabs";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Provider theme={defaultTheme}>
        <Flex direction="column" height="100vh" width="100vw">
          <Component {...pageProps} />
          <Tabs />
        </Flex>
      </Provider>
    </SSRProvider>
  );
}

export default MyApp;
