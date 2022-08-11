import React from "react";

const useReactPath = () => {
  const [path, setPath] = React.useState(window.location.pathname);

  const listenToPopstate = () => {
    const winPath = window.location.pathname;
    setPath(winPath);
  };

  React.useEffect(() => {
    window.addEventListener("popstate", listenToPopstate);
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
    };
  }, []); // prevent a trailing slash loop hole

  let tmp = path;

  while (tmp.endsWith('/')) {
    tmp = tmp.slice(0, tmp.length - 1);
  }

  return tmp;
};

export default useReactPath;