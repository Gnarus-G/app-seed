import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/private-theming";
import { StyledEngineProvider } from "@mui/styled-engine";
import { AppProps } from "next/app";
import { createClient, Provider as GraphqlProvider } from "urql";
import React from "react";
import theme from "theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(removeInjectServerSideCss, []);

  return (
    <GraphqlProvider value={createClient({ url: "/api/graphql" })}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </StyledEngineProvider>
    </GraphqlProvider>
  );
}

function removeInjectServerSideCss() {
  const jssStyles = document.querySelector("#jss-server-side");
  if (jssStyles) {
    jssStyles.parentElement!.removeChild(jssStyles);
  }
}
