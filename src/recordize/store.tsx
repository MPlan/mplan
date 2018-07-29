import * as Immutable from 'immutable';
import * as React from 'react';
import { TypeIn } from 'utilities/typings';
import { shallowEqual } from 'utilities/utilities';

interface Hashable {
  hashCode(): number;
  equals(other?: Hashable | {}): boolean;
}

interface ConnectionOptions<
  Store,
  Scope extends Hashable,
  OwnProps,
  PropsFromState,
  PropsFromDispatch
> {
  scopeTo: (store: Store) => Scope;
  mapStateToProps: (scope: Scope, ownProps: OwnProps) => PropsFromState;
  mapDispatchToProps: (
    dispatch: (updater: (store: Store) => Store) => void,
    ownProps: OwnProps,
  ) => PropsFromDispatch;
  _debugName?: string;
}

interface ComponentTuple<Store, Scope> {
  setState: TypeIn<React.PureComponent<any, Scope>, 'setState'>;
  scopeDefiner: (store: Store) => Scope;
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
  connectedComponents: Set<React.Component<any, any>>;
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

  function sendUpdate(update: (previousStore: Store) => Store) {
    const previousStore = currentStore;
    currentStore = update(previousStore);

    const mutations: Mutation<Store, Hashable>[] = [];

    for (const [groupHash, hashMatches] of componentGroups) {
      for (const componentGroup of hashMatches) {
        const { scopeTo, connectedComponents } = componentGroup;
        const previousScope = scopeTo(previousStore);
        const currentScope = scopeTo(currentStore);
        if (previousScope.equals(currentScope)) continue;

        for (const component of connectedComponents) {
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

    for (const subscription of subscriptions) {
      subscription(currentStore);
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

  function connect<Scope extends Hashable, OwnProps, PropsFromState, PropsFromDispatch>(
    connectionOptions: ConnectionOptions<Store, Scope, OwnProps, PropsFromState, PropsFromDispatch>,
  ) {
    type ComponentProps = PropsFromState & PropsFromDispatch;

    interface ConnectedComponentState {
      savedProps: OwnProps;
    }

    return (Component: React.ComponentType<ComponentProps>) => {
      const connectedComponent = class ConnectedComponent extends React.PureComponent<
        OwnProps,
        ConnectedComponentState
      > {
        static getDerivedStateFromProps(
          nextProps: OwnProps,
          previousState: ConnectedComponentState,
        ) {
          if (shallowEqual(nextProps, previousState.savedProps)) return previousState;
          return { savedProps: nextProps };
        }

        constructor(props: OwnProps) {
          super(props);
          this.state = {
            savedProps: props,
          };
        }

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
          } else {
            const matchingGroup = findMatchingGroup(componentGroup, scope);
            if (!matchingGroup) {
              // hash collision
              componentGroup.add({
                connectedComponents: new Set<React.Component<any>>().add(this),
                scopeTo,
                currentScope: scope,
              });
              return;
            } else {
              // no collision; same scope
              matchingGroup.connectedComponents.add(this);
            }
          }
          sendUpdate(store => store);
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

        previousProps = undefined as any;
        previousScope = undefined as any;
        previousComponentProps = undefined as any;

        // inputs: sendUpdate, props, scope
        // outputs: combined stateProps, dispatchProps
        componentProps() {
          const { mapDispatchToProps, mapStateToProps, scopeTo } = connectionOptions;
          const scope = scopeTo(currentStore);
          const props = this.state.savedProps;
          if (this.previousScope === scope && this.previousProps === props) {
            return this.previousComponentProps;
          }

          const dispatchProps = mapDispatchToProps(sendUpdate, this.state.savedProps);
          const stateProps = mapStateToProps(scope, this.state.savedProps);

          const componentProps = Object.assign({}, stateProps, dispatchProps);

          this.previousProps = props;
          this.previousScope = scope;
          this.previousComponentProps = componentProps;

          return componentProps;
        }

        render() {
          const componentProps = this.componentProps();
          return <Component {...componentProps} />;
        }
      };

      return (connectedComponent as any) as React.ComponentType<OwnProps>;
      // TODO:
      // return React.forwardRef<Ref, OwnProps & { forwardedRef?: any }>((props, ref) => (
      //   <ConnectedComponent {...props} forwardedRef={ref} />
      // ));
    };
  }

  return {
    connect,
    sendUpdate,
    subscribe,
    current,
  };
}
