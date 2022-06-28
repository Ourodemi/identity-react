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
    }, []);
    
    if ( path.endsWith('/') ){
        return path.slice(0, path.length - 1);
    }

    return path;
};

export default useReactPath;