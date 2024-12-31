import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import "./styles/index.scss";
import PageLayout from "./layouts/PageLayout";
import Splash from "./pages/Splash";
import Question from "./pages/Question";
import Welcome from "./pages/Welcome";
import Wallet from "./pages/Wallet";
import Tasks from "./pages/Tasks";
import Invite from "./pages/Invite";
import Profile from "./pages/Profile";
import Horoscope from "./pages/Horoscope";
import Agent from "./pages/Agent";
import Withdraw from "./pages/Withdraw";
import Deposit from "./pages/Deposit";
import AppContextProvider from "./providers/AppContextProvider";
import TonConnectProvider from "./providers/TonProvider";
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { WalletsListConfiguration } from '@tonconnect/ui';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
const App: React.FC = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const getAuthenticatedUserInfo = async (telegramUserInfo: any) => {
    console.log("main.tsx - UserID >>> ", telegramUserInfo.id, API_BASE_URL);
    try {
      const chatId = telegramUserInfo.id;
      if (chatId == null || chatId == undefined) {
        console.log(`main.tsx - error >>> ChatID is not defined`);
        return;
      }

      // Send request to server and receive token from server
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/getAuthentication`,
        {
          telegramUserInfo: telegramUserInfo,
        }
      );
      console.log("main.tsx - authenticated user info >>> ", data);
      if (data.token) {
        localStorage.setItem("authorization", data.token);
        setToken(token);
      }

      // Get user info with token
      const res = await axios.get(`${API_BASE_URL}/api/user/info`, {
        headers: {
          Authorization: `bearer ${data.token}`,
        },
      });

      console.log("[Userinfo]", res);

      // if (res.data.state == false){

      // } else {
      //   navigate("/task");
      // }
      // if (authenticatedUserinfo.state) setUserInfo(authenticatedUserinfo.data);
      // if (authenticatedUserinfo.state && authenticatedUserinfo?.data?.setting) {
      //   setSettingInfo(authenticatedUserinfo?.data?.setting);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const initDataHanler = async () => {
    let initData

    if (typeof window !== "undefined") {
      const WebApp = (await import("@twa-dev/sdk")).default;
      WebApp.ready();
      initData = WebApp.initData;
      console.log("main.tsx - initData >>> ", initData);

      const params = new URLSearchParams(initData);
      const user: string | null = params.get("user");

      getAuthenticatedUserInfo(JSON.parse(decodeURIComponent(user as string)));
    }
  };

  useEffect(() => {
    console.log("---------------");

    initDataHanler();
    console.log("App initialized");
  }, []);

  const manifestUrl: string =
    "https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json";

  const walletsListConfiguration: WalletsListConfiguration  = {
    includeWallets: [
      {
        appName: "tonwallet",
        name: "TON Wallet",
        imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
        aboutUrl:
          "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
        universalLink: "https://wallet.ton.org/ton-connect",
        jsBridgeKey: "tonwallet",
        bridgeUrl: "https://bridge.tonapi.io/bridge",
        platforms: ["chrome", "android"],
      },
      {
        appName: "nicegramWallet",
        name: "Nicegram Wallet",
        imageUrl: "https://static.nicegram.app/icon.png",
        aboutUrl: "https://nicegram.app",
        universalLink: "https://nicegram.app/tc",
        deepLink: "nicegram-tc://",
        jsBridgeKey: "nicegramWallet",
        bridgeUrl: "https://bridge.tonapi.io/bridge",
        platforms: ["ios", "android"],
      },
      {
        appName: "binanceTonWeb3Wallet",
        name: "Binance Web3 Wallet",
        imageUrl:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMEIwRTExIi8+CjxwYXRoIGQ9Ik01IDE1TDcuMjU4MDYgMTIuNzQxOUw5LjUxNjEzIDE1TDcuMjU4MDYgMTcuMjU4MUw1IDE1WiIgZmlsbD0iI0YwQjkwQiIvPgo8cGF0aCBkPSJNOC44NzA5NyAxMS4xMjlMMTUgNUwyMS4xMjkgMTEuMTI5TDE4Ljg3MSAxMy4zODcxTDE1IDkuNTE2MTNMMTEuMTI5IDEzLjM4NzFMOC44NzA5NyAxMS4xMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMi43NDE5IDE1TDE1IDEyLjc0MTlMMTcuMjU4MSAxNUwxNSAxNy4yNTgxTDEyLjc0MTkgMTVaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0xMS4xMjkgMTYuNjEyOUw4Ljg3MDk3IDE4Ljg3MUwxNSAyNUwyMS4xMjkgMTguODcxTDE4Ljg3MSAxNi42MTI5TDE1IDIwLjQ4MzlMMTEuMTI5IDE2LjYxMjlaIiBmaWxsPSIjRjBCOTBCIi8+CjxwYXRoIGQ9Ik0yMC40ODM5IDE1TDIyLjc0MTkgMTIuNzQxOUwyNSAxNUwyMi43NDE5IDE3LjI1ODFMMjAuNDgzOSAxNVoiIGZpbGw9IiNGMEI5MEIiLz4KPC9zdmc+Cg==",
        aboutUrl: "https://www.binance.com/en/web3wallet",
        deepLink: "bnc://app.binance.com/cedefi/ton-connect",
        bridgeUrl: "https://bridge.tonapi.io/bridge",
        platforms: ["chrome", "safari", "ios", "android"],
        universalLink: "https://app.binance.com/cedefi/ton-connect",
      },
      {
        appName: "okxTonWallet2",
        name: "New OKX Wallet",
        imageUrl:
          "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
        aboutUrl: "https://www.okx.com/web3",
        universalLink: "https://www.okx.com/ul/uYJPB0",
        bridgeUrl: "https://www.okx.com/tonbridge/discover/rpc/bridge",
        jsBridgeKey: "okxTonWallet",
        platforms: ["chrome", "safari", "firefox", "ios", "android"],
      },
    ],
  };

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={walletsListConfiguration}
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/tc_twa_demo_bot/start",
      }}
    >
      <AppContextProvider>
        <TonConnectProvider>
          <BrowserRouter>
            <SkeletonTheme
              baseColor="#ffffff06"
              highlightColor="#ffffff10"
              borderRadius="4px"
            >
              <Routes>
                <Route path="/" element={<PageLayout />}>
                  <Route index element={<Splash />} />
                  <Route path="/question" element={<Question />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/horoscope" element={<Horoscope />} />
                  <Route path="/agent" element={<Agent />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/deposit" element={<Deposit />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/invite" element={<Invite />} />
                </Route>
              </Routes>
            </SkeletonTheme>
          </BrowserRouter>
        </TonConnectProvider>
      </AppContextProvider>
    </TonConnectUIProvider>
  );
};

// Rendering the App
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
