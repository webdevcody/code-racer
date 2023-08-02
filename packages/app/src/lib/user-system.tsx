"use client";

import * as React from "react";

export function useCheckForUserNavigator(type: "android") {
    const [isUserOnSpecificOS, setIsUserOnSpecificOS] = React.useState(false);

    React.useEffect(() => {
        const userAgent = navigator.userAgent;
        if (type === "android") {
            const isUserOnAdroid = userAgent.match(/android/i);
            setIsUserOnSpecificOS(isUserOnAdroid ? true : false);
        }
    }, [type]);

    return isUserOnSpecificOS;
};