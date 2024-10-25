'use client';

import { AppStore, makeStore } from '@/store';
import { NextUIProvider } from '@nextui-org/react';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

export function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<(() => void) | AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <NextUIProvider>
      <Provider store={storeRef.current as AppStore}>{children}</Provider>
    </NextUIProvider>
  );
}
