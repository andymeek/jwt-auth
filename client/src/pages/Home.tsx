import React from "react";
import { useUsersQuery } from "../generated/graphql";

export const Home: React.FC = () => {
  const { data } = useUsersQuery({ fetchPolicy: "network-only" });

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>users:</div>
      <ul>
        {data.users.map((user) => {
          return (
            <li key={user.email}>
              {user.email}, {user.id}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
