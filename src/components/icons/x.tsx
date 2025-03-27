import { SVGProps } from "react";
const X = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={1}
    height={1}
    fill="none"
    {...props}
  >
    <path fill="url(#a)" d="M0 0h30v30H0z" />
    <defs>
      <pattern
        id="a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#b" transform="scale(.01)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADIUlEQVR4nO3d32rUQBQG8Lmo90K98c9bSKQzUA7VZ7EKvXAnRW/TZErfQdT3qQprn6QK4nVl1q50F5Hsbmbyncz3wd6WOfk1m840nGMMwzAMwzAMwzAMwzAMwzAMSg78+WPnQ+d8+HTgwytpmj2jPE+P399zs/Z1rGlR29vmkdEQ59sjW4fvrg43y4/14bI6udg3SlOdXOy7uvu8UlOs0bdHBjlu1h7aOvy8u/A7BVxJ3TwwyiJvmvu27r7+qyZXh1+2bl8YbRhaUeT/GLgofTC0oUg/DDyUTTC0oMhmGDgo22Cgo8h2GOOj7IKBiiK7YYyHEv8Gt7673nHhUCgyDMafj+9+PHvXPMm2+MXGaIiF/y0gzMfcp1Rxn+HDfMiarA9n2QpY7FaHBBkRpUqAcQvyIVsR8ThkcJARUKpEGLe1vMxVh4lnU+tHCdpQqoQY8ago+/ndoA/B9YLqcJUSJe3au2+jPQ81FiYK1zzZAkXRWidfqChY46BBLliA15Y0iIUL4JqyBukCCNBaRg3ChRCANUBlzAsixMC5MEIMnDtFiNH/68v58CUlihAD6mR1nvJnq3uAI9wpLuNzalLRgmJLwNCCYkvCQEexJWKgotiSMdBQLDFwUCwxcO4USwycry9LDJxniiUGzoPeEmOzSMKDQoKAYTii4GE4ouBhOKLgYTii4GE4ouBhOKLgYbiSUVAxXIko6BiuJBQtGK4EFL4GBJQcL7FJ4pfxEJobqHyV1CVDweg4ofJla0cUDIxliLIWhBefhXcKDsYyxaMgYZjSURAxikVBxigORQNGMSiaMCaPohEjV2up7ChsYBawGpgtpgQk+O1ybPG3JQibYN70+Nr9aHLF1l2r+c7I87+arjE6Gylj/FdOBm6kHIfaKGw1joExeKvx0/Dc6GvGj4UxWDP+sTB2G1eBibHzuIqxMbYb6IKNsfVAFxSMzUYe6cDYeOQRGka/oWC6MHoPBUPFmPrYPOvD5WpN3TX82LzVfUo4iyMb4pSAKQyWlKbZs6fdcdyBx03f4ez84dhrYhiGYRiGYRiGYRiGYRiGMcv8BiAF6LaBg3tJAAAAAElFTkSuQmCC"
        id="b"
        width={50}
        height={50}
        preserveAspectRatio="none"
      />
    </defs>
  </svg>
);
export default X;
