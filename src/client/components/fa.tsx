import * as React from 'react';
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').default;
const icons = require('@ricokahler/fontawesome-pro-light').default;

interface FaProps {
  icon: string;
  spin?: boolean;
  plus?: boolean;
  fixedWidth?: boolean;
  border?: boolean;
  listItem?: boolean;
  flip?: 'horizontal' | 'vertical' | 'both';
  size?: 'lg' | 'xs' | 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
  rotate?: number;
  pull?: 'left' | 'right';
  className?: string;
  transform?: any;
  mask?: any;
  symbol?: any;
  color?: string;
}

export function Fa(props: FaProps) {
  const { icon, ...restOfProps } = props;
  const iconKey = `fa${icon.charAt(0).toUpperCase()}${icon.substring(1)}`;
  return <FontAwesomeIcon icon={icons[iconKey]} {...restOfProps} />;
}
