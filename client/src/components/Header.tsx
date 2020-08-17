import React from "react";
import { Link } from "react-router-dom";
import {
  useMeQuery,
    useLogoutMutation,
} from "../generated/graphql";
import { setAccessToken } from "../access-control/accessToken";

export const Header: React.FC = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let body = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>you are logged in as {data.me.email} </div>;
  } else {
    body = <div>not logged in</div>;
  }

  return (
    <header>
      <div></div>
      <Link to="/">home</Link>
      <div>
        <Link to="/register">register</Link>
      </div>
      <div>
        <Link to="/login">login</Link>
      </div>
      <div>
        <Link to="/bye">bye</Link>
      </div>
      <div>
        {!loading && data?.me && <button
          onClick={async () => {
            await logout();
            setAccessToken("");
            await client?.resetStore()
          }}
        >
          logout
        </button>}
      </div>
      {body}
    </header>
  );
};
