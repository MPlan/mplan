import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Input } from 'components/input';
import { Popper, PopperContainerProps } from 'components/popper';
import { Caption as _Caption } from 'components/caption';
import { ClickAwayListener } from 'components/click-away-listener';

const Root = styled(View)``;
const Suggestions = styled(View)`
  position: absolute;
  top: 100%;
  width: 100%;
  box-shadow: ${styles.boxShadow(-1)};
  background-color: white;
`;
const SuggestionWrapper = styled(View)``;
const Caption = styled(_Caption)`
  border-top: 1px solid ${styles.grayLighter};
  padding: ${styles.space(-1)};
`;

interface AutosuggestProps<T> {
  items: T[];
  getDisplayText: (t: T) => string;
  getKey: (t: T) => string;
  onSearch: (query: string) => void;
  renderSuggestion: (item: T, selected: boolean) => React.ReactNode;
  onSelectSuggestion: (key: string) => void;
  placeholder?: string;
  totalCount?: number;
}

interface AutosuggestState {
  selectedIndex: number | undefined;
  search: string;
}

export class Autosuggest<T> extends React.PureComponent<AutosuggestProps<T>, AutosuggestState> {
  constructor(props: AutosuggestProps<T>) {
    super(props);
    this.state = {
      selectedIndex: 0,
      search: '',
    };
  }
  suggestionsRef = React.createRef<HTMLElement>();

  componentDidUpdate(_: AutosuggestProps<T>, previousState: AutosuggestState) {
    const closedBefore = !previousState.search;
    const openNow = !!this.state.search;

    if (closedBefore && openNow) {
      this.setState({ selectedIndex: 0 });
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    this.props.onSearch(search);
    this.setState({ search });
  };

  handleClose = (e?: MouseEvent) => {
    if (!e) {
      this.setState({ search: '' });
      return;
    }

    const target = e.target as Node;
    const suggestionsElement = this.suggestionsRef.current;
    if (!suggestionsElement) {
      this.setState({ search: '' });
      return;
    }
    if (!target) {
      this.setState({ search: '' });
      return;
    }

    if (suggestionsElement.contains(target)) return;

    this.setState({ search: '' });
  };

  handleMouseEnter(index: number) {
    this.setState({ selectedIndex: index });
  }
  handleMouseLeave = () => {
    this.setState({ selectedIndex: undefined });
  };
  handleClick = () => {
    const { selectedIndex } = this.state;
    const { items, getKey, onSelectSuggestion } = this.props;
    if (selectedIndex === undefined) return;
    const item = items[selectedIndex];
    if (!item) return;
    const key = getKey(item);
    onSelectSuggestion(key);
    this.handleClose();
  };
  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { selectedIndex } = this.state;
    const { items, onSelectSuggestion, getKey } = this.props;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.setState(previousState => ({
        selectedIndex:
          previousState.selectedIndex === undefined
            ? 0
            : (previousState.selectedIndex + 1) % items.length,
      }));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.setState(previousState => ({
        selectedIndex:
          previousState.selectedIndex === undefined
            ? items.length - 1
            : (previousState.selectedIndex - 1) % items.length,
      }));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex === undefined) return;
      const selectedItem = items[selectedIndex];
      if (!selectedItem) return;
      const key = getKey(selectedItem);
      onSelectSuggestion(key);
      this.handleClose();
      return;
    }
  };

  renderContainer = (props: PopperContainerProps) => {
    const { placeholder } = this.props;
    const { search } = this.state;
    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <Root {...props}>
          <Input
            type="search"
            placeholder={placeholder}
            value={search}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
          />
        </Root>
      </ClickAwayListener>
    );
  };

  render() {
    const { items, renderSuggestion, getKey, totalCount } = this.props;
    const { selectedIndex, search } = this.state;

    return (
      <Popper
        open={!!search}
        onBlurCancel={this.handleClose}
        poppedElement={
          <Suggestions innerRef={this.suggestionsRef}>
            {items.map((suggestion, index) => (
              <SuggestionWrapper
                onMouseEnter={() => this.handleMouseEnter(index)}
                onMouseLeave={this.handleMouseLeave}
                onClick={this.handleClick}
                key={getKey(suggestion)}
              >
                {renderSuggestion(suggestion, selectedIndex === index)}
              </SuggestionWrapper>
            ))}
            {totalCount !== undefined && (
              <Caption>
                Showing {items.length} of {totalCount}{' '}
                {items.length !== totalCount ? 'Refine your search to see more.' : ''}
              </Caption>
            )}
          </Suggestions>
        }
        renderContainer={this.renderContainer}
      />
    );
  }
}
