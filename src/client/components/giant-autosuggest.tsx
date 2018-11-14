import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';
import { wait } from 'utilities/utilities';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Popper, PopperContainerProps } from 'components/popper';
import { Caption as _Caption } from 'components/caption';
import { ClickAwayListener } from 'components/click-away-listener';

const Root = styled(View)`
  margin-bottom: ${styles.space(0)};
  width: 100%;
  max-width: 100vh;
`;
const Suggestions = styled(View)`
  position: absolute;
  top: 100%;
  width: 100%;
  box-shadow: ${styles.boxShadow(-1)};
  background-color: ${styles.deepCove};
`;
const SuggestionWrapper = styled(View)``;
const DontSee = styled(Text)`
  font-size: ${styles.space(0)};
  padding: ${styles.space(0)};
  color: ${styles.white};
  &:hover {
    text-decoration: underline;
    color: ${styles.turbo};
  }
  &:active {
    color: ${styles.beeKeeper};
  }
`;
const Search = styled.input`
  font-family: ${styles.fontFamily};
  font-size: ${styles.space(4)};
  outline: none;
  background-color: transparent;
  border: none;
  color: ${styles.turbo};
  font-weight: bold;
`;

interface GiantAutosuggestProps<T> {
  focus: boolean;
  items: T[];
  getDisplayText: (t: T) => string;
  getKey: (t: T) => string;
  onSearch: (query: string) => void;
  renderSuggestion: (item: T, selected: boolean) => React.ReactNode;
  onSelectSuggestion: (key: string) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClickDontSee: () => void;
}

interface GiantAutosuggestState {
  selectedIndex: number | undefined;
  search: string;
}

export class GiantAutosuggest<T> extends React.PureComponent<
  GiantAutosuggestProps<T>,
  GiantAutosuggestState
> {
  constructor(props: GiantAutosuggestProps<T>) {
    super(props);
    this.state = {
      selectedIndex: 0,
      search: '',
    };
  }
  suggestionsRef = React.createRef<HTMLElement>();
  searchRef = React.createRef<HTMLInputElement>();

  async componentDidUpdate(
    previousProps: GiantAutosuggestProps<T>,
    previousState: GiantAutosuggestState,
  ) {
    const closedBefore = !previousState.search;
    const openNow = !!this.state.search;

    if (closedBefore && openNow) {
      this.setState({ selectedIndex: 0 });
    }

    if (!previousProps.focus && this.props.focus) {
      await wait(500);
      const searchElement = this.searchRef.current;
      if (!searchElement) return;
      searchElement.focus();
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    this.props.onSearch(search);
    this.setState({ search, selectedIndex: 0 });
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
    const { onFocus, onBlur } = this.props;
    const { search } = this.state;
    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <Root {...props}>
          <Search
            onFocus={onFocus}
            onBlur={onBlur}
            type="search"
            value={search}
            innerRef={this.searchRef}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
          />
        </Root>
      </ClickAwayListener>
    );
  };

  handleDontSee = () => {
    this.handleClose();
    this.props.onClickDontSee();
  };

  render() {
    const { items, renderSuggestion, getKey } = this.props;
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
            <DontSee onClick={this.handleDontSee}>Don't see your degree?</DontSee>
          </Suggestions>
        }
        renderContainer={this.renderContainer}
      />
    );
  }
}
