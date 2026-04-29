import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './LiquidGlassView.types';

type LiquidGlassViewModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class LiquidGlassViewModule extends NativeModule<LiquidGlassViewModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(LiquidGlassViewModule, 'LiquidGlassViewModule');
