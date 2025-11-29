import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M192,40H64A24,24,0,0,0,40,64V192a24,24,0,0,0,24,24H192a24,24,0,0,0,24-24V64A24,24,0,0,0,192,40Zm8,152a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H192a8,8,0,0,1,8,8Z"
        opacity="0.2"
      />
      <path
        fill="currentColor"
        d="M168,80a40,40,0,0,0-80,0,8,8,0,0,0,16,0,24,24,0,0,1,48,0,8,8,0,0,0,16,0Zm-40,24a48.1,48.1,0,0,0-36.5,17.4,8,8,0,1,0,12.2,10.6A32,32,0,1,1,128,168a31.4,31.4,0,0,1-13.1-3,8,8,0,0,0-10.8,4.5,8.2,8.2,0,0,0,4.5,10.8A48,48,0,1,0,128,104Z"
      />
    </svg>
  );
}
