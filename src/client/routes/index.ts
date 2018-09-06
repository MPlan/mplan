import * as React from 'react';
import { DegreeEditor } from './degree-manager';

export interface RouteDefinition {
  path: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  requiresAdmin: boolean;
}

export const Routes: RouteDefinition[] = [
  {
    path: '/degree-manager',
    name: 'Degree manager',
    icon: 'edit',
    component: DegreeEditor,
    requiresAdmin: true,
  },
];

export const BottomRoutes: RouteDefinition[] = [];
