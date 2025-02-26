import * as React from "react";
import { SVGProps } from "react";
const BodyTemp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Layer_1"
    width={20}
    height={20}
    fill="#3A7283"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    {...props}
  >
    <g id="SVGRepo_iconCarrier">
      <defs>
        <style>
          {
            ".cls-1{fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-width:1.83px}"
          }
        </style>
      </defs>
      <circle cx={11.08} cy={17.5} r={0.92} className="cls-1" />
      <path
        d="M14.75 14.78v-9.2a3.67 3.67 0 0 0-7.33 0v9.2a4.53 4.53 0 0 0-.92 2.72 4.59 4.59 0 0 0 9.17 0 4.53 4.53 0 0 0-.92-2.72ZM11.08 5.58v11M14.75 6.5h2.75M14.75 10.17h2.75M14.75 13.83h2.75"
        className="cls-1"
      />
    </g>
  </svg>
);
export default BodyTemp;
