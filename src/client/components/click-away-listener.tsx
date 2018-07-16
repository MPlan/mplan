// copied from material-ui's click-away-listener
import * as React from 'react';
import * as ReactDom from 'react-dom';
import EventListener from 'react-event-listener';

export interface ClickAwayListenerProps {
  onClickAway: (e: MouseEvent) => void;
  children: JSX.Element;
}

export class ClickAwayListener extends React.Component<ClickAwayListenerProps, {}> {
  node: Element | Text | undefined | null;
  mounted = false;

  componentDidMount() {
    this.node = ReactDom.findDOMNode(this);
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleClickAway = (event: MouseEvent) => {
    if (!event) return;
    if (!(event.target instanceof Element)) return;
    if (event.defaultPrevented) return;
    if (!this.mounted) return;
    if (!this.node) return;

    if (
      document.documentElement &&
      document.documentElement.contains(event.target) &&
      !this.node.contains(event.target)
    ) {
      this.props.onClickAway(event);
    }
  };

  render() {
    return (
      <EventListener target="document" onMouseUp={this.handleClickAway}>
        {this.props.children}
      </EventListener>
    );
  }
}
