import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';
import { View } from 'components/view';
import { Text, TextProps } from 'components/text';
import { Input } from 'components/input';

const Root = styled(View)``;

interface CaptionProps extends TextProps {
  focused?: boolean;
}
const Caption = styled<CaptionProps>(Text)`
  font-size: ${styles.space(-1)};
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: ${styles.space(-2)};
  color: ${props => (props.focused ? styles.blue : styles.textLight)};
  transition: all 200ms;
`;

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
    return (
      <Root>
        <Caption focused={this.state.focused}>{label}</Caption>
        <Input innerRef={this.inputRef} {...restOfProps} />
      </Root>
    );
  }
}
