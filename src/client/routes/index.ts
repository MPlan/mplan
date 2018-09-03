import * as React from 'react';
import { DegreeEditor } from './degree-editor';

export interface RouteDefinition {
  path: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  requiresAdmin: boolean;
}

export const Routes: RouteDefinition[] = [
  {
    path: '/degree-editor',
    name: 'Degree editor',
    icon: 'edit',
    component: DegreeEditor,
    requiresAdmin: true,
  },
];

export const BottomRoutes: RouteDefinition[] = [];
