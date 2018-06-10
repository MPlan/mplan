import * as Immutable from 'immutable';
import * as React from 'react';

type ValueOf<T> = T[keyof T];
type TypeIn<T, U extends keyof T> = ValueOf<Pick<T, U>>;

interface ConnectionOptions<Store, Scope, OwnProps, ComponentProps> {
  scope: (store: Store) => Scope;
  mapScopeToProps: (
    params: {
      store: Store;
      scope: Scope;
      sendUpdate: (updater: (store: Store) => Store) => void;
      ownProps: OwnProps;
    },
  ) => ComponentProps;
}

interface ComponentTuple<Store, Scope> {
  setState: TypeIn<React.Component<any, Scope>, 'setState'>;
  scope: (store: Store) => Scope;
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

      for (const { scope, setState } of connectedComponents) {
        const nextScope = scope(currentStore);
        setState(nextScope);
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

  function connect<OwnProps extends { innerRef?: any }, ComponentProps, Scope>(
    Component: React.ComponentType<ComponentProps>,
  ) {
    
    return (connectionOptions: ConnectionOptions<Store, Scope, OwnProps, ComponentProps>) => {
      const { mapScopeToProps, scope } = connectionOptions;
      const initialScope = scope(currentStore);
      return class extends React.Component<OwnProps, Scope> {
        componentTuple: ComponentTuple<Store, Scope> | undefined;
        state = initialScope;

        componentDidMount() {
          this.componentTuple = {
            setState: this.setState.bind(this),
            scope,
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
          const componentProps = mapScopeToProps({
            store: currentStore,
            scope: this.state,
            sendUpdate,
            ownProps: this.props,
          });
          return <Component {...componentProps} />;
        }
      };
    };
  }

  return {
    connect,
    sendUpdate,
    subscribe,
    current,
  };
}
