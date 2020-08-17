import React from "react";
import { useLoginMutation, MeDocument } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";
import { setAccessToken } from "../access-control/accessToken";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [login] = useLoginMutation();

  async function handleSubmit(evt: any): Promise<void> {
    evt.preventDefault();
    const [email, password] = Array.from(evt.target).map(
      ({ value }: any) => value
    );

    try {
      const { data } = await login({
        variables: { email, password },
        update: (store, { data }) => {
          if (!data) {
            return null;
          }

          store.writeQuery({
            query: MeDocument,
            data: {
              me: data.login.user,
            },
          });
        },
      });

      if (data) {
        setAccessToken(data.login.accessToken);
      }

      history.push("/");
    } catch (err) {
      console.error("login error", err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="text" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <input type="submit" value="Submit" />
    </form>
  );
};
