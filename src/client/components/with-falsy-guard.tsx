import * as React from 'react';

export function withFalsyGuard(onFalsy: () => void) {
  return (Component: React.ComponentType<any>) =>
    class RenderConditional extends React.Component<any> {
      render() {
        if (!this.props) {
          onFalsy();
          return null;
        }
        return <Component {...this.props} />;
      }
    };
}
