import { SVGProps, ImgHTMLAttributes } from "react";

export const WechatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16.5 10c3.038 0 5.5 2.015 5.5 4.5c0 1.397 -.778 2.645 -2 3.47l0 2.03l-1.964 -1.178a6.649 6.649 0 0 1 -1.536 .178c-3.038 0 -5.5 -2.015 -5.5 -4.5s2.462 -4.5 5.5 -4.5" />
    <path d="M11.197 15.698c-.69 .196 -1.43 .302 -2.197 .302a8.008 8.008 0 0 1 -2.612 -.432l-2.388 1.432v-2.801c-1.237 -1.082 -2 -2.564 -2 -4.199c0 -3.314 3.134 -6 7 -6c3.782 0 6.863 2.57 7 5.785l0 .233" />
    <path d="M10 8h.01" />
    <path d="M7 8h.01" />
    <path d="M15 14h.01" />
    <path d="M18 14h.01" />
  </svg>
);

export const QQIcon = (props: ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src="https://ts1.tc.mm.bing.net/th/id/R-C.7a002178ee372889748fa516ae2e32b3?rik=C8qOXejvufqx8A&riu=http%3a%2f%2fpic.616pic.com%2fys_img%2f00%2f24%2f25%2fWbUdq4WCJ6.jpg&ehk=ERsMyu23nW1x%2buDgWeFRS8PNp5N8Eqi%2bOYeOFqglh6c%3d&risl=&pid=ImgRaw&r=0"
    alt="QQ"
    width="18"
    height="18"
    style={{ 
      borderRadius: '2px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    }}
    {...props}
  />
);
