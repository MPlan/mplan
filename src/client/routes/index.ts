import * as React from 'react';
import { DegreeEditor } from './degree-manager';
import { Catalog } from './catalog';

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
  {
    path: '/catalog',
    name: 'Catalog',
    icon: 'book',
    component: Catalog,
    requiresAdmin: false,
  },
];

export const BottomRoutes: RouteDefinition[] = [];
