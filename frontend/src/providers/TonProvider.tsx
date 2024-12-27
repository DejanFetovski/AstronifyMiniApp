import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { ReactNode } from "react";

const TonConnectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <TonConnectUIProvider
      manifestUrl="https://sgold.io/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
    >
      {children}
    </TonConnectUIProvider>
  );
};

export default TonConnectProvider;
