import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

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
        previousStoreState: State | undefined;
        constructor(props: OwnProps) {
          super(props);
          connectedComponents.add(this);
        }

        componentWillUnmount() {
          connectedComponents.delete(this);
        }

        componentDidUpdate() {
          this.previousStoreState = currentState;
        }

        propsFromMapDispatch = mapDispatchToProps(dispatch, this.props);

        render() {
          const propsFromMapState = mapStateToProps(currentState, this.props);
          const props = Object.assign({}, this.propsFromMapDispatch, propsFromMapState);
          return <Component {...props} />;
        }
      }

      return ConnectedComponent;
    };
  }

  function stream(): Observable<State> {
    return Observable.create((observer: Observer<State>) => {
      subscribe(observer.next.bind(observer));
    });
  }

  return {
    connect,
    subscribe,
    dispatch,
    stream,
    get current() {
      return currentState;
    },
  };
}
