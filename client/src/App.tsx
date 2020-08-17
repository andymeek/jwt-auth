import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import { setAccessToken } from "./access-control/accessToken";

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_GRAPH_API}/refresh_token`, {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      const { accessToken } = await res.json();
      console.log("accessToken...", accessToken);

      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return <Routes />;
};
