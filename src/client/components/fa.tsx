import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/pro-light-svg-icons';

interface FaProps {
  icon: string;
  spin?: boolean;
  pulse?: boolean;
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
  onClick?: any;
}

export function Fa(props: FaProps) {
  const { icon, ...restOfProps } = props;
  const iconKey = `fa${icon.charAt(0).toUpperCase()}${icon.substring(1)}`;
  return <FontAwesomeIcon icon={(icons as any)[iconKey]} {...restOfProps} />;
}
