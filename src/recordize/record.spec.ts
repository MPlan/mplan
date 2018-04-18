import * as Recordize from './record';
import * as Immutable from 'immutable';

describe('record', () => {
  describe('fromJS', () => {
    it('recursively converts maps to immutable types', () => {
      class Baz extends Recordize.define({
        baz: 'whoa',
      }) {}

      class Bar extends Recordize.define({
        bar: 'something',
        nestedMap: Recordize.MapOf(Baz),
      }) {}

      class Foo extends Recordize.define({
        foo: 'something',
        someMap: Recordize.MapOf(Bar),
      }) {}

      const js = new Foo()
        .set('foo', 'something else')
        .update('someMap', map =>
          map.set(
            'one',
            new Bar().update('nestedMap', nestedMap =>
              nestedMap.set('two', new Baz().set('baz', 'new new baz')),
            ),
          ),
        )
        .toJS();
      const result = Foo.fromJS(js);

      expect(result instanceof Foo).toBe(true);
      expect(Immutable.Map.isMap(result.someMap)).toBe(true);
      expect(result.someMap.get('one') instanceof Bar).toBe(true);
      expect(result.someMap.get('one')!.nestedMap.get('two') instanceof Baz).toBe(true);
    });

    it('recursively converts set to immutable types', () => {
      class Baz extends Recordize.define({
        baz: 'whoa',
      }) {}

      class Bar extends Recordize.define({
        bar: 'something',
        nestedSet: Recordize.SetOf(Baz),
      }) {}

      class Foo extends Recordize.define({
        foo: 'something',
        someSet: Recordize.SetOf(Bar),
      }) {}

      const js = new Foo()
        .set('foo', 'something else')
        .update('someSet', set =>
          set.add(
            new Bar().update('nestedSet', nestedSet =>
              nestedSet.add(new Baz().set('baz', 'new new baz')),
            ),
          ),
        )
        .toJS();
      const result = Foo.fromJS(js);

      expect(result instanceof Foo).toBe(true);
      expect(Immutable.Set.isSet(result.someSet)).toBe(true);
      expect(result.someSet.first() instanceof Bar).toBe(true);
      expect(result.someSet.first()!.nestedSet.first() instanceof Baz).toBe(true);
    });

    it('recursively converts lists to immutable types', () => {
      class Baz extends Recordize.define({
        baz: 'whoa',
      }) {}

      class Bar extends Recordize.define({
        bar: 'something',
        nestedList: Recordize.ListOf(Baz),
      }) {}

      class Foo extends Recordize.define({
        foo: 'something',
        someList: Recordize.ListOf(Bar),
      }) {}

      const js = new Foo()
        .set('foo', 'something else')
        .update('someList', list =>
          list.push(
            new Bar().update('nestedList', nestedList =>
              nestedList.push(new Baz().set('baz', 'new new baz')),
            ),
          ),
        )
        .toJS();
      const result = Foo.fromJS(js);

      expect(result instanceof Foo).toBe(true);
      expect(Immutable.List.isList(result.someList)).toBe(true);
      expect(result.someList.first() instanceof Bar).toBe(true);
      expect(result.someList.first()!.nestedList.first() instanceof Baz).toBe(true);
    });

    it('recursively converts records to immutable types', () => {
      class Baz extends Recordize.define({
        baz: 'whoa',
      }) {}

      class Bar extends Recordize.define({
        nestedBaz: new Baz(),
        nestedList: Recordize.ListOf(Baz),
      }) {}

      class Foo extends Recordize.define({
        nestedBar: new Bar(),
        foo: 'something',
        someList: Recordize.ListOf(Bar),
      }) {}

      const js = new Foo()
        .set('foo', 'something else')
        .update('someList', list =>
          list.push(
            new Bar().update('nestedList', nestedList =>
              nestedList.push(new Baz().set('baz', 'new new baz')),
            ),
          ),
        )
        .toJS();
      const result = Foo.fromJS(js);

      expect(result instanceof Foo).toBe(true);
      expect(Immutable.List.isList(result.someList)).toBe(true);
      expect(result.nestedBar instanceof Bar).toBe(true);
      expect(result.someList.first()!.nestedList.first() instanceof Baz).toBe(true);
    });
  });
});
