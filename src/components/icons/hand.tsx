import * as React from "react";
import { SVGProps } from "react";
const Hand = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M13.5 3a.5.5 0 0 0-.5.5V12a1 1 0 1 1-2 0V5.5a.5.5 0 0 0-1 0v8.468c0 1.108-1.373 1.624-2.103.79L5.35 11.847a.722.722 0 0 0-1.102.932l4.69 5.733A6.784 6.784 0 0 0 14.188 21 5.811 5.811 0 0 0 20 15.189V7.5a.5.5 0 0 0-1 0V12a1 1 0 1 1-2 0V5.5a.5.5 0 0 0-1 0V12a1 1 0 1 1-2 0V3.5a.5.5 0 0 0-.5-.5Zm2.461.058a2.5 2.5 0 0 0-4.922 0A2.5 2.5 0 0 0 8 5.5v6.339l-1.145-1.31a2.722 2.722 0 0 0-2.386-.908c-2.125.266-3.125 2.767-1.77 4.425l4.691 5.732A8.784 8.784 0 0 0 14.19 23 7.811 7.811 0 0 0 22 15.189V7.5a2.5 2.5 0 0 0-3.039-2.442 2.5 2.5 0 0 0-3-2Z"
      clipRule="evenodd"
    />
  </svg>
);
export default Hand;
