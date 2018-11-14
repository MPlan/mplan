import * as React from 'react';
import { DegreeEditor } from './degree-manager';
import { Catalog } from './catalog';
import { DegreePage } from './degree';

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
  {
    path: '/degree',
    name: 'Degree worksheet',
    icon: 'graduationCap',
    component: DegreePage,
    requiresAdmin: false,
  },
];

export const BottomRoutes: RouteDefinition[] = [];
