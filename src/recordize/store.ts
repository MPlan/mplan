import * as Immutable from 'immutable';
import * as React from 'react';
import { oneLine } from 'common-tags';

export interface ConnectionOptions<
  Store,
  Props = {},
  State = {},
  Scope = Store
> {
  scope?: (store: Store) => Scope;
  descope?: (store: Store, scope: Scope) => Store;
  initialState?: State;
  propsExample?: Props;
}

export interface Equatable {
  hashCode(): number;
  equals(other: any): boolean;
}

interface ComponentGroup<Store, Scope> {
  currentScope: Scope;
  scope: (store: Store) => Scope;
  components: Set<React.Component<any, any>>;
}

/**
 * a very simple class to represent a tuple of properties needed to make a mutation to
 * `componentGroups`. Classes are generally faster than array tuples.
 */
class MutationTuple<Store, Scope extends Equatable> {
  constructor(
    public hashToDelete: number,
    public hashToSet: number,
    public newScope: Scope,
    public componentGroup: ComponentGroup<Store, Equatable>,
  ) {}
}

export function handleUpdate<Store extends Immutable.Record<any>>(
  previousStore: Store,
  currentStore: Store,
  componentGroups: Map<number, ComponentGroup<Store, Equatable>>,
) {
  const mutations = [] as MutationTuple<Store, Equatable>[];

  for (let [scopeHash, componentGroup] of componentGroups) {
    const previousScope = componentGroup.scope(previousStore);
    const newScope = componentGroup.scope(currentStore);
    // early return optimization
    if (previousScope.equals(newScope)) {
      continue;
    }

    // call component setState if no early return
    for (let component of componentGroup.components) {
      component.forceUpdate();
    }

    // push mutation
    mutations.push(new MutationTuple(scopeHash, newScope.hashCode(), newScope, componentGroup));
  }

  return mutations;
}

export function createStore<Store extends Immutable.Record<any>>(initialStore: Store) {
  let currentStore = initialStore;
  const componentGroups = new Map<number, ComponentGroup<Store, Equatable>>();
  const subscriptions = new Set<(store: Store) => void>();

  function sendUpdate(update: (previousStore: Store) => Store) {
    const previousStore = currentStore;
    currentStore = update(previousStore);
    for (const updateSubscription of subscriptions) {
      updateSubscription(currentStore);
    }

    const mutations = handleUpdate(previousStore, currentStore, componentGroups);

    for (let mutation of mutations) {
      componentGroups.delete(mutation.hashToDelete);
      mutation.componentGroup.currentScope = mutation.newScope;
      componentGroups.set(mutation.hashToSet, mutation.componentGroup);
    }
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

  function connect<Props = {}, State = {}, Scope extends Equatable = Store>(
    _connectionOptions?: ConnectionOptions<Store, Props, State, Scope>,
  ) {
    const connectionOptions = _connectionOptions || {};
    class ComponentClass extends React.Component<Props, State> {
      constructor(props: Props, context?: any) {
        super(props, context);
        const getScope = connectionOptions.scope || ((store: Store) => (store as any) as Scope);
        const scope = getScope(currentStore);
        this.state = {
          ...((connectionOptions.initialState || {}) as any),
        };
      }

      get store() {
        const getScope = connectionOptions.scope || ((store: Store) => (store as any) as Scope);
        const scope = getScope(currentStore);
        return scope;
      }

      componentWillMount() {
        const getScope = connectionOptions.scope || ((store: Store) => (store as any) as Scope);
        const scope = getScope(currentStore);
        if (typeof scope.hashCode !== 'function') {
          throw new Error(oneLine`
            Object chosen as 'scope' does not have a 'hashCode' function. Ensure the object is
            immutable and has this method.
          `);
        }
        const scopeHashCode = scope.hashCode();
        const componentGroup = componentGroups.get(scopeHashCode) || {
          currentScope: scope,
          scope: connectionOptions.scope || ((store: Store) => store as any),
          components: new Set<React.Component<any, any>>(),
        };
        if (!componentGroup.currentScope.equals(scope)) {
          // TODO: add some sort of re-hashing mechanism
          console.warn(oneLine`
            Hash collision from Recordize. There is nothing to do to fix this warning. Please report
            this to the repo: https://github.com/ricokahler/recordize if you see this warning
            frequently.
          `);
        }
        componentGroup.components.add(this);
        componentGroups.set(scopeHashCode, componentGroup);
      }

      componentWillUnmount() {
        const getScope = connectionOptions.scope || ((store: Store) => (store as any) as Scope);
        const scope = getScope(currentStore);
        const scopeHashCode = scope.hashCode();
        const componentGroup = componentGroups.get(scopeHashCode);
        if (!componentGroup) {
          return;
        }
        if (!componentGroup.currentScope.equals(scope)) {
          // TODO: add some sort of re-hashing mechanism
          console.warn(oneLine`
            Hash collision from Recordize. There is nothing to do to fix this warning. Please report
            this to the repo: https://github.com/ricokahler/recordize if you see this warning
            frequently.
          `);
        }
        componentGroup.components.delete(this);
        if (componentGroup.components.size <= 0) {
          componentGroups.delete(scopeHashCode);
        }
      }

      setStore(updateScope: (previousState: Scope) => Scope) {
        const update = (previousStore: Store) => {
          const getScope = connectionOptions.scope || ((store: Store) => (store as any) as Scope);
          const setScope =
            connectionOptions.descope || ((store: any, scope: any) => scope as Store);

          const scope = getScope(previousStore);
          const updatedScope = updateScope(scope);
          const newStore = setScope(previousStore, updatedScope);
          return newStore;
        };
        sendUpdate(update);
      }

      setGlobalStore(update: (previousStore: Store) => Store) {
        sendUpdate(update);
      }
    }
    return ComponentClass;
  }

  return {
    connect,
    sendUpdate,
    subscribe,
    current,
  };
}
