import { ObjectID as _ObjectId } from 'bson';

export function ObjectId(id?: string | number | _ObjectId) {
  return ((_ObjectId as any)(id) as _ObjectId).toHexString();
}
