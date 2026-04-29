import * as React from 'react';

import { LiquidGlassViewProps } from './LiquidGlassView.types';

export default function LiquidGlassView(props: LiquidGlassViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
