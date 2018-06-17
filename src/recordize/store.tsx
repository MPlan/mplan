import * as Immutable from 'immutable';
import * as React from 'react';
import { TypeIn } from 'utilities/typings';

interface Hashable {
  hashCode(): number;
  equals(other?: Hashable | {}): boolean;
}

interface ConnectionOptions<Store, Scope extends Hashable, OwnProps, ComponentProps> {
  scopeTo: (store: Store) => Scope;
  mapStateToProps: (scope: Scope, ownProps: OwnProps) => Partial<ComponentProps>;
  mapDispatchToProps: (
    dispatch: (updater: (store: Store) => Store) => Promise<Store>,
    ownProps: OwnProps,
  ) => Partial<ComponentProps>;
}

interface ComponentTuple<Store, Scope> {
  setState: TypeIn<React.Component<any, Scope>, 'setState'>;
  scopeDefiner: (store: Store) => Scope;
}

interface ComponentWithScope<Scope> extends React.Component<any, any> {
  currentScope: Scope | undefined;
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

interface Mutation<Store, Scope extends Hashable> {
  hashToDelete: number;
  hashToSet: number;
  newScope: Scope;
  componentGroup: ComponentGroup<Store, Scope>;
}

interface ComponentGroup<Store, Scope extends Hashable> {
  currentScope: Scope;
  scopeTo: (store: Store) => Scope;
  connectedComponents: Set<ComponentWithScope<any>>;
}

function findMatchingGroup(hashMatches: Set<ComponentGroup<any, Hashable>>, scope: Hashable) {
  for (const hashMatch of hashMatches) {
    if (scope.equals(hashMatch.currentScope)) return hashMatch;
  }
  return undefined;
}

export function createStore<Store extends Immutable.Record<any>>(initialStore: Store) {
  let currentStore = initialStore;
  const subscriptions = new Set<(store: Store) => void>();
  const componentGroups = new Map<number, Set<ComponentGroup<Store, Hashable>>>();

  async function sendUpdate(update: (previousStore: Store) => Store) {
    const previousStore = currentStore;
    currentStore = update(previousStore);

    const mutations: Mutation<Store, Hashable>[] = [];

    for (const [groupHash, hashMatches] of componentGroups) {
      for (const componentGroup of hashMatches) {
        const { scopeTo, connectedComponents } = componentGroup;
        const previousScope = scopeTo(previousStore);
        const currentScope = scopeTo(previousStore);
        if (previousScope.equals(currentScope)) continue;

        for (const component of connectedComponents) {
          component.currentScope = currentScope;
          component.forceUpdate();
        }

        mutations.push({
          componentGroup,
          hashToDelete: groupHash,
          hashToSet: currentScope.hashCode(),
          newScope: currentScope,
        });
      }
    }

    for (const { hashToDelete, hashToSet, newScope, componentGroup } of mutations) {
      componentGroup.currentScope = newScope;
      const componentGroupMatches = componentGroups.get(hashToDelete);
      if (!componentGroupMatches) {
        console.warn(
          'RECORDIZE: could not find component group matches when trying to delete a mutation',
        );
        continue;
      }
      componentGroupMatches.delete(componentGroup);
      if (componentGroupMatches.size <= 0) {
        // if there are no other matches then delete the whole group
        componentGroups.delete(hashToDelete);
      }
      const newComponentGroupMatches = componentGroups.get(hashToSet);
      if (!newComponentGroupMatches) {
        componentGroups.set(hashToSet, new Set().add(componentGroup));
        continue;
      }
      newComponentGroupMatches.add(componentGroup);
    }

    return currentStore;
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
    Scope extends Hashable,
    OwnProps extends { forwardedRef?: any },
    ComponentProps,
    Ref = {}
  >(connectionOptions: ConnectionOptions<Store, Scope, OwnProps, ComponentProps>) {
    return (Component: React.ComponentType<ComponentProps>) => {
      class ConnectedComponent extends React.Component<OwnProps, {}> {
        currentScope: Scope | undefined;
        componentDidMount() {
          const { scopeTo } = connectionOptions;
          const scope = scopeTo(currentStore);
          const hashCode = scope.hashCode();
          const componentGroup = componentGroups.get(hashCode);
          if (!componentGroup) {
            const newGroup: ComponentGroup<Store, typeof scope> = {
              connectedComponents: new Set<any>().add(this),
              currentScope: scope,
              scopeTo: scopeTo,
            };
            componentGroups.set(hashCode, new Set().add(newGroup));
            return;
          }

          const matchingGroup = findMatchingGroup(componentGroup, scope);
          if (!matchingGroup) {
            // hash collision
            componentGroup.add({
              connectedComponents: new Set<ComponentWithScope<Scope>>().add(this),
              scopeTo,
              currentScope: scope,
            });
            return;
          }

          // no collision; same scope
          matchingGroup.connectedComponents.add(this);
        }

        componentWillUnmount() {
          const { scopeTo } = connectionOptions;
          const scope = scopeTo(currentStore);
          const hashCode = scope.hashCode();
          const componentGroupMatches = componentGroups.get(hashCode);
          if (!componentGroupMatches) {
            console.warn('RECORDIZE: could not find component group during unmount!');
            return;
          }
          const matchingGroup = findMatchingGroup(componentGroupMatches, scope);
          if (!matchingGroup) {
            console.warn('RECORDIZE: could not find hash match during unmount!');
            return;
          }
          matchingGroup.connectedComponents.delete(this);

          if (matchingGroup.connectedComponents.size > 0) return;
          componentGroupMatches.delete(matchingGroup);
          if (componentGroupMatches.size > 0) return;
          componentGroups.delete(hashCode);
        }

        componentProps() {
          // current scope will be re-assigned on every update before this method is called
          if (!this.currentScope) return undefined;
          const { mapDispatchToProps, mapStateToProps } = connectionOptions;
          const dispatchProps = mapDispatchToProps(sendUpdate, this.props);
          const stateProps = mapStateToProps(this.currentScope, this.props);

          return Object.assign({}, stateProps, dispatchProps);
        }
        render() {
          const componentProps = this.componentProps();
          if (!componentProps) return null;
          return <Component {...componentProps} />;
        }
      }
      return React.forwardRef<Ref, OwnProps>((props, ref) => (
        <ConnectedComponent {...props} forwardedRef={ref} />
      ));
    };
  }

  return {
    connect,
    sendUpdate,
    subscribe,
    current,
  };
}
