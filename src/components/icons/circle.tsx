import * as React from "react";
import { SVGProps } from "react";
const Circle = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={`block ${className}`}
    {...props}
  >
    <circle cx={8} cy={8} r={8} fill="currentColor" />
  </svg>
);
export default Circle;
