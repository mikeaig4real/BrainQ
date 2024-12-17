import React from "react";

const SinglePlayerLayout = ( { children }: { children: React.ReactNode; } ) =>
{
  return (
    <section className="w-full flex flex-col py-14 px-6">{children}</section>
  );
};

export default SinglePlayerLayout;
