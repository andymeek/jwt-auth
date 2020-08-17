import React from "react";
import { useByeQuery } from "../generated/graphql";

type Props = {};

export const Bye: React.FC<Props> = () => {
  const { data, error, loading } = useByeQuery();

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Err</div>;
  }

  if (!data) {
    return <div>no data!</div>;
  }

  return <div>{data.bye}</div>;
};
