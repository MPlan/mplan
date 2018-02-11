import * as Mongo from 'mongodb';

class ObjectIdMock implements Mongo.ObjectId {
  generationTime: number;

  constructor() {
    this.generationTime = new Date().getTime();
  }

  equals(otherID: Mongo.ObjectID): boolean {
    throw new Error("Method not implemented.");
  }
  generate(time?: number | undefined): string {
    throw new Error("Method not implemented.");
  }
  getTimestamp(): Date {
    return new Date(this.generationTime);
  }
  toHexString(): string {
    throw new Error("Method not implemented.");
  }
}