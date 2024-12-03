import React from "react";
import { Button, Flex, Heading, Image, Text } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const DeviceWrapperComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="mockup-phone">
      <div className="camera"></div>
      <div className="display">
        <div className="artboard artboard-demo phone-custom">{children}</div>
      </div>
    </div>
  );
};

export default DeviceWrapperComponent;
