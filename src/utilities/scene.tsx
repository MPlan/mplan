import * as React from 'react';
import { shallowEqual } from 'utilities/utilities';
import * as uuid from 'uuid/v4';

interface ConnectionOptions<T, OwnProps, PropsFromScene, PropsFromSetScene> {
  mapSceneToProps: (scene: T, ownProps: OwnProps) => PropsFromScene;
  mapSetSceneToProps: (
    setScene: (sceneSetter: (scene: T) => T) => void,
    ownProps: OwnProps,
  ) => PropsFromSetScene;
}

export function createScene<T>(initialState: T) {
  let scene: T = initialState;
  const connectedComponents: { [key: string]: React.Component<any, any> } = {};

  function setScene(stateSetter: (state: T) => T) {
    const newScene = stateSetter(scene);
    if (!shallowEqual(scene, newScene)) {
      scene = newScene;
    }
    for (const component of Object.values(connectedComponents)) {
      component.forceUpdate();
    }
  }

  function connect<OwnProps, PropsFromScene, PropsFromSetScene>(
    connectionOptions: ConnectionOptions<T, OwnProps, PropsFromScene, PropsFromSetScene>,
  ) {
    type ComponentProps = PropsFromScene & PropsFromSetScene;
    return (Component: React.ComponentType<ComponentProps>) =>
      class extends React.PureComponent<OwnProps, {}> {
        connectionId = uuid();

        componentDidMount() {
          connectedComponents[this.connectionId] = this;
        }
        componentWillUnmount() {
          delete connectedComponents[this.connectionId];
        }

        previousComponentProps: ComponentProps | undefined = undefined;

        get componentProps() {
          const { mapSceneToProps, mapSetSceneToProps } = connectionOptions;
          const propsFromScene = mapSceneToProps(scene, this.props);
          const propsFromSetScene = mapSetSceneToProps(setScene, this.props);

          const newComponentProps = Object.assign({}, propsFromSetScene, propsFromScene);

          if (shallowEqual(newComponentProps, this.previousComponentProps)) {
            return this.previousComponentProps;
          }

          this.previousComponentProps = newComponentProps;
          return newComponentProps;
        }

        render() {
          const componentProps = this.componentProps;
          if (!componentProps) return null;
          return <Component {...componentProps} />;
        }
      };
  }

  return { connect };
}
