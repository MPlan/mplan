import * as React from 'react';

interface DisplayProps {
  onClick: () => void;
  children: string;
}
interface InputProps {
  innerRef: React.RefObject<HTMLInputElement>;
  onBlur: () => void;
  value: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface InlineEditProps {
  value: string;
  renderDisplay: (displayProps: DisplayProps) => React.ReactNode;
  renderInput: (inputProps: InputProps) => React.ReactNode;
  editing: boolean;
  onEdit: () => void;
  onBlur: () => void;
}
export class InlineEdit extends React.Component<InlineEditProps, {}> {
  handleInputBlur = () => {
    this.props.onBlur();
  };
  handleDisplayClick = () => {
    this.props.onEdit();
  };
  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    this.props.onBlur();
  };

  inputRef = React.createRef<HTMLInputElement>();
  inputElement: HTMLInputElement | undefined;

  componentDidUpdate() {
    const inputElement = this.inputRef.current;
    if (!inputElement) return;
    if (inputElement === this.inputElement) return;
    inputElement.focus();
    this.inputElement = inputElement;
  }

  render() {
    const { editing, renderDisplay, renderInput } = this.props;

    if (editing) {
      return renderInput({
        innerRef: this.inputRef,
        onBlur: this.handleInputBlur,
        value: this.props.value,
        onKeyDown: this.handleKeyDown,
      });
    }

    return renderDisplay({
      onClick: this.handleDisplayClick,
      children: this.props.value,
    });
  }
}
