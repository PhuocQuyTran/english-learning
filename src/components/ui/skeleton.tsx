import React from "react";

export function Skeleton({ className = "", ...props }: any) {
  return (
    <div className={`${className} bg-gray-200/60 animate-pulse`} {...props} />
  );
}

export default Skeleton;
