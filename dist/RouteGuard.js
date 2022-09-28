import React from "react";
import useIdentity from "./useIdentity";

const RouteGuard = ({
  children,
  disableLoader,
  disabled = false,
  reverse = false // only de-authenticated users are allowed to access this path

}) => {
  const {
    LoaderComponent,
    isAuthenticated,
    enableLoader,
    navigateToDefault,
    disableRouteGuard
  } = useIdentity(); // if isAuthenticated hasn't be initialized, it's loading

  if (!disableRouteGuard && !disabled) {
    if (isAuthenticated === null) {
      return enableLoader && !disableLoader ? /*#__PURE__*/React.createElement(LoaderComponent, null) : children;
    }

    if (isAuthenticated === false && !reverse) {
      navigateToDefault();
      return /*#__PURE__*/React.createElement(React.Fragment, null);
    }
  }

  if (isAuthenticated && reverse) {
    navigateToDefault(true);
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }

  return children;
};

export default RouteGuard;