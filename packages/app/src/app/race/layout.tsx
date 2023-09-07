import type { NextPage } from "next";

import * as React from "react";

import { NotificationCatcher } from "./notification-catcher";

const Layout: NextPage<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <NotificationCatcher>
      {children}
    </NotificationCatcher>
  );
};

export default Layout;