// MainSetting.js
import React from "react";
import { Divider } from "antd";

// Import each settings component
import GeneralSetting from "./GeneralSetting";
import BankDetails from "./BankDetails";
import AppLinks from "./AppLinks";
import HomeTitle from "./HomeTitleSettings";
import UpiPaymentId from "./UPISettings";
import QrCode from "./QrCode";
import OtherSettings from "./OtherSettings";
import HowToPlay from "./HowToPlay";
import ReferAndEarn from "./ReferEarn";
import WelcomeSettings from "./WelcomeSettings";


const MainSetting = () => {
  return (
    <div style={{ padding: 35, backgroundColor: "#fff" }}>
      <h2 style={{ fontWeight: "bold", marginBottom: 20 }}>⚙️ All Settings</h2>

      <div style={{ marginBottom: 20 }}>
        <GeneralSetting />
      </div>
      <Divider />

      <div style={{ marginBottom: 20 }}>
        <BankDetails />
      </div>
      <Divider />

      {/* <div style={{ marginBottom: 20 }}>
        <AppLinks />
      </div>
      <Divider /> */}

      {/* <div style={{ marginBottom: 20 }}>
        <HomeTitle />
      </div>
      <Divider /> */}

      <div style={{ marginBottom: 20 }}>
        <UpiPaymentId />
      </div>
      <Divider />

      <div style={{ marginBottom: 20 }}>
        <QrCode />
      </div>
      <Divider />

      {/* <div style={{ marginBottom: 20 }}>
        <OtherSettings />
      </div>
      <Divider /> */}

      <div style={{ marginBottom: 20 }}>
        <HowToPlay />
      </div>
      <Divider />

      {/* <div style={{ marginBottom: 20 }}>
        <ReferAndEarn />
      </div>
      <Divider /> */}

      {/* <div style={{ marginBottom: 20 }}>
        <WelcomeSettings />
      </div>
      <Divider /> */}
    </div>
  );
};

export default MainSetting;
