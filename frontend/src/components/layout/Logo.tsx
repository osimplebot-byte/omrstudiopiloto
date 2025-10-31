import { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6EC7" />
        <stop offset="1" stopColor="#E84393" />
      </linearGradient>
    </defs>
    <path
      d="M8 4C5.23858 4 3 6.23858 3 9V29C3 31.7614 5.23858 34 8 34H17V42.5858C17 43.4767 18.0771 43.9229 18.7071 43.2929L26 36H40C42.7614 36 45 33.7614 45 31V9C45 6.23858 42.7614 4 40 4H8Z"
      fill="url(#logoGradient)"
    />
    <path
      d="M29 12C26.2386 12 24 14.2386 24 17C24 19.7614 26.2386 22 29 22C31.7614 22 34 19.7614 34 17C34 14.2386 31.7614 12 29 12ZM29 14.5C30.3807 14.5 31.5 15.6193 31.5 17C31.5 18.3807 30.3807 19.5 29 19.5C27.6193 19.5 26.5 18.3807 26.5 17C26.5 15.6193 27.6193 14.5 29 14.5Z"
      fill="white"
    />
    <path
      d="M19.5 17C19.5 15.6193 20.6193 14.5 22 14.5C23.3807 14.5 24.5 15.6193 24.5 17C24.5 18.3807 23.3807 19.5 22 19.5C20.6193 19.5 19.5 18.3807 19.5 17Z"
      fill="white"
    />
    <path
      d="M20.75 22.75C20.75 21.7835 21.5335 21 22.5 21H26.5C27.4665 21 28.25 21.7835 28.25 22.75C28.25 24.9251 26.4251 26.75 24.25 26.75H24C21.9289 26.75 20.25 25.0711 20.25 23V22.75H20.75Z"
      fill="white"
      opacity="0.92"
    />
  </svg>
);

Logo.displayName = 'Logo';
