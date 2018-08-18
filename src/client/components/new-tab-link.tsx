import * as React from 'react';

interface NewTabLinkProps extends React.HTMLProps<HTMLAnchorElement> {}

export class NewTabLink extends React.PureComponent<NewTabLinkProps, {}> {
  handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(this.props.href);
  };
  render() {
    return <a {...this.props} onClick={this.handleClick} />;
  }
}
