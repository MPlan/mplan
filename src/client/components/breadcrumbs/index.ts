import { history } from 'client/history';
import { Breadcrumbs } from './breadcrumbs';
import { returnPreviousIfUnchanged } from 'utilities/return-previous-if-unchanged';
import { flatten } from 'lodash';
import * as Model from 'models';

function convertDashedCase(dashedCase: string) {
  const split = dashedCase.split('-');
  return split
    .map(split => {
      const normalized = split.toLowerCase();
      const firstLetter = normalized.substring(0, 1);
      const rest = normalized.substring(1);

      return `${firstLetter.toUpperCase()}${rest}`;
    })
    .join(' ');
}

function convertPathToString(path: string, store: Model.App.Model) {
  const { masteredDegrees } = store;
  const masteredDegree = Model.MasteredDegrees.getMasteredDegree(masteredDegrees, path);
  if (masteredDegree) return masteredDegree.name;

  const groupNameLookup = getLookup(store);
  if (groupNameLookup[path]) return groupNameLookup[path];

  return convertDashedCase(path);
}

const createGroupNameLookup = (
  ...requirementGroups: Array<{ [groupId: string]: Model.RequirementGroup.Model }>
) => {
  const nameTuples = flatten(requirementGroups.map(groupData => Object.values(groupData))).map(
    group => ({ id: group.id, name: group.name }),
  );

  const nameLookup = nameTuples.reduce(
    (lookup, { id, name }) => {
      lookup[id] = name;
      return lookup;
    },
    {} as { [groupId: string]: string },
  );

  return nameLookup;
};

const getLookup = (store: Model.App.Model) => {
  const requirementGroups = Object.values(store.masteredDegrees).map(
    masteredDegree => masteredDegree.requirementGroups,
  );

  return createGroupNameLookup(...requirementGroups);
};

const convertPathname = returnPreviousIfUnchanged((pathname: string, store: Model.App.Model) => {
  const pathSplit = pathname.split('/').slice(1);
  return pathSplit.map(pathPart => convertPathToString(pathPart, store));
});

const Container = Model.store.connect({
  mapStateToProps: (store, ownProps: any) => {
    const path = convertPathname(history.location.pathname, store);
    return { path, ...ownProps };
  },
  mapDispatchToProps: () => {
    return {
      onPathClick: (index: number) => {
        const pathSplit = history.location.pathname.split('/').slice(1);
        const newPath = `/${pathSplit.slice(0, index + 1).join('/')}`;

        history.push(newPath);
      },
    };
  },
})(Breadcrumbs);

export { Container as Breadcrumbs };
