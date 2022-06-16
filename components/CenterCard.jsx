import React from "react";

export default function CenterCard({children, className, ...rest}) {
  return (
    <>
      <div className={`${className} grid place-items-center h-96`} {...rest}>
        <div className="shadow rounded space-y-2 w-full lg:w-1/4 p-3 md:w-3/4 bg-white mt-24">
            {children}
        </div>
      </div>
    </>
  );
}
