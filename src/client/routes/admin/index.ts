import * as Model from 'models';

import { Admin } from './admin';

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (store: Model.App) => ({ admins: store.admins }),
  mapDispatchToProps: dispatch => ({
    onAdd: (admin: string) => {
      dispatch(store => store.update('admins', admins => [...admins, admin.toLowerCase()]));
    },
    onRemove: (adminToRemove: string) => {
      dispatch(store =>
        store.update('admins', admins =>
          admins.filter(admin => admin.toLowerCase() !== adminToRemove.toLowerCase()),
        ),
      );
    },
  }),
})(Admin);

export { container as Admin };
