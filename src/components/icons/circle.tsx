import * as React from "react";
import { SVGProps } from "react";
const Circle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="currentColor"
    viewBox="0 0 16 16"
    {...props}
  >
    <circle cx={8} cy={8} r={8} fill="currentColor" />
  </svg>
);
export default Circle;
