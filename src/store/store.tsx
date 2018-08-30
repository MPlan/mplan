import * as React from 'react';

interface ConnectParams<State, OwnProps, PropsFromMapState, PropsFromMapDispatch> {
  mapStateToProps: (state: State, ownProps: OwnProps) => PropsFromMapState;
  mapDispatchToProps: (
    dispatch: (update: (state: State) => State) => void,
    ownProps: OwnProps,
  ) => PropsFromMapDispatch;
}

export function createStore<State>(initialState: State) {
  let currentState = initialState;

  const connectedComponents = new Set<React.Component>();
  const subscribers = new Set<(state: State) => void>();

  function dispatch(update: (s: State) => State) {
    currentState = update(currentState);
    for (const connectedComponent of connectedComponents) {
      connectedComponent.forceUpdate();
    }

    for (const subscriber of subscribers) {
      subscriber(currentState);
    }
  }

  function subscribe(subscriber: (state: State) => void) {
    subscribers.add(subscriber);

    function unsubscribe() {
      subscribers.delete(subscriber);
    }

    return unsubscribe;
  }

  function connect<OwnProps, PropsFromMapState, PropsFromMapDispatch>({
    mapDispatchToProps,
    mapStateToProps,
  }: ConnectParams<State, OwnProps, PropsFromMapState, PropsFromMapDispatch>) {
    type PropsFromMappings = PropsFromMapState & PropsFromMapDispatch;
    return (Component: React.ComponentType<PropsFromMappings>) => {
      class ConnectedComponent extends React.Component<OwnProps, {}> {
        constructor(props: OwnProps) {
          super(props);
          connectedComponents.add(this);
        }

        componentWillUnmount() {
          connectedComponents.delete(this);
        }

        render() {
          const propsFromMapDispatch = mapDispatchToProps(dispatch, this.props);
          const propsFromMapState = mapStateToProps(currentState, this.props);
          const props = Object.assign({}, propsFromMapDispatch, propsFromMapState);
          return <Component {...props} />;
        }
      }

      return ConnectedComponent;
    };
  }

  return {
    connect,
    subscribe,
    dispatch,
    get current() {
      return currentState;
    },
  };
}
