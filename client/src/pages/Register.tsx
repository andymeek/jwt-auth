import React from "react";
import { useRegisterMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const [register] = useRegisterMutation();

  async function handleSubmit(evt: any): Promise<void> {
    evt.preventDefault();
    const [email, password] = Array.from(evt.target).map(
      ({ value }: any) => value
    );

    await register({ variables: { email, password } });
    history.push("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="text" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <input type="submit" value="Submit" />
    </form>
  );
};
