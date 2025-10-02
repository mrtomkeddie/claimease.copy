
'use client';

import Image from 'next/image';
import React from 'react';

export function ClaimEaseLogo() {
  return (
    <Image
      src="/claimeaselogo-white.svg"
      alt="ClaimEase Logo"
      width={140}
      height={32}
      priority
    />
  );
}
