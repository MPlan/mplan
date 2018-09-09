import * as React from 'react';

export function withProps<OwnProps, Props>(propMapper: (ownProps: OwnProps) => Props) {
  return (Component: React.ComponentType<Props>) => {
    return class WrappedComponent extends React.PureComponent<OwnProps, {}> {
      render() {
        const props = propMapper(this.props);
        return <Component {...props} />;
      }
    };
  };
}
