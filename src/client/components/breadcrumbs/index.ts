import { history } from 'client/history';
import { Breadcrumbs } from './breadcrumbs';
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

  return convertDashedCase(path);
}

const Container = Model.store.connect({
  mapStateToProps: store => {
    const pathSplit = history.location.pathname.split('/').slice(1);
    const path = pathSplit.map(pathPart => convertPathToString(pathPart, store));

    return { path };
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
