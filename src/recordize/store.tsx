import * as Immutable from 'immutable';
import * as React from 'react';

type ValueOf<T> = T[keyof T];
type TypeIn<T, U extends keyof T> = ValueOf<Pick<T, U>>;

interface ConnectionOptions<Store, Scope, OwnProps, ComponentProps> {
  select: (store: Store) => Scope;
  mapScopeToProps: (
    scope: Scope,
    sendUpdate: (updater: (store: Store) => Store) => void,
    ownProps: OwnProps,
  ) => ComponentProps;
}

interface ComponentTuple<Store, Scope> {
  setState: TypeIn<React.Component<any, Scope>, 'setState'>;
  select: (store: Store) => Scope;
}

function shallowIsEqual(a: any, b: any) {
  if (a === b) return true;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    const subA = a[key];
    const subB = b[key];
    if (subA !== subB) return false;
  }
  return true;
}

export function createStore<Store extends Immutable.Record<any>>(initialStore: Store) {
  let currentStore = initialStore;
  const connectedComponents = new Set<ComponentTuple<Store, any>>();
  const subscriptions = new Set<(store: Store) => void>();

  function sendUpdate(update: (previousStore: Store) => Store) {
    setTimeout(() => {
      const previousStore = currentStore;
      currentStore = update(previousStore);
      if (previousStore === currentStore) return;

      for (const { select, setState } of connectedComponents) {
        const scope = select(currentStore);
        setState(scope);
      }
    }, 0);
  }

  function subscribe(update: (store: Store) => void) {
    function subscription(store: Store) {
      update(store);
    }
    subscriptions.add(subscription);

    function unsubscribe() {
      subscriptions.delete(subscription);
    }

    return unsubscribe;
  }

  function current() {
    return currentStore;
  }

  function connect<
    OwnProps extends { innerRef?: any },
    ComponentProps extends { ref?: any },
    Scope
  >(connectionOptions: ConnectionOptions<Store, Scope, OwnProps, ComponentProps>) {
    const { mapScopeToProps, select } = connectionOptions;
    const scope = select(currentStore);

    return (Component: React.ComponentType<ComponentProps>) =>
      class extends React.Component<OwnProps> {
        componentTuple: ComponentTuple<Store, Scope> | undefined;
        state = scope;

        componentDidMount() {
          this.componentTuple = {
            setState: this.setState.bind(this),
            select,
          };
          connectedComponents.add(this.componentTuple);
        }

        componentWillUnmount() {
          if (!this.componentTuple) return;
          connectedComponents.delete(this.componentTuple);
        }

        shouldComponentUpdate(nextProps: OwnProps, nextState: Scope) {
          if (!shallowIsEqual(this.props, nextProps)) return true;
          if (!shallowIsEqual(this.state, nextState)) return true;
          console.info('immutable optimization');
          return false;
        }

        render() {
          const componentProps = mapScopeToProps(this.state, sendUpdate, this.props);
          return <Component {...componentProps} ref={this.props.innerRef} />;
        }
      };
  }

  return {
    connect,
    sendUpdate,
    subscribe,
    current,
  };
}
