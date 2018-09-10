import * as React from 'react';
import { Field } from 'components/field';
import { Input } from 'components/input';

interface TextFieldProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  innerRef?: any;
}
interface TextFieldState {
  focused: boolean;
}

export class TextField extends React.PureComponent<TextFieldProps, TextFieldState> {
  inputRef = React.createRef<HTMLInputElement>();

  constructor(props: TextFieldProps) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  handleInputFocus = () => {
    this.setState({ focused: true });
  };

  handleInputBlur = () => {
    this.setState({ focused: false });
  };

  componentDidMount() {
    const inputElement = this.inputRef.current;
    if (!inputElement) return;
    inputElement.addEventListener('focus', this.handleInputFocus);
    inputElement.addEventListener('blur', this.handleInputBlur);
  }

  componentWillUnmount() {
    const inputElement = this.inputRef.current;
    if (!inputElement) return;
    inputElement.removeEventListener('focus', this.handleInputFocus);
    inputElement.removeEventListener('blur', this.handleInputBlur);
  }

  render() {
    const { label, ref, innerRef, ...restOfProps } = this.props;
    const { focused } = this.state;
    return (
      <Field label={label} focused={focused}>
        <Input focused={focused} innerRef={this.inputRef} {...restOfProps} />
      </Field>
    );
  }
}
