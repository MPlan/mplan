import * as Recordize from './record';

fdescribe('record', () => {
  describe('RecordNoPlaceholders', () => {
    it('unboxes T when a Placeholder<T> is used', () => {
      const someSymbol = Symbol();
      class SomeClass {
        [someSymbol] = someSymbol;
      }

      const obj = {
        foo: 'some string',
        bar: 4,
        mapPlaceholder: Recordize.MapOf(SomeClass),
        listPlaceholder: Recordize.ListOf(SomeClass),
        setPlaceholder: Recordize.SetOf(SomeClass),
        setOfStringOrTPlaceholder: Recordize.SetOfStringOr(SomeClass),
      };

      type GetValue<T> = { [P in keyof T]: T[P] }[keyof T];
      type AssertSomeClass<T extends SomeClass> = T;

      type ObjNoPlaceholders = Recordize.RecordNoPlaceholders<typeof obj>;

      type ObjMapPlaceholder = GetValue<Pick<ObjNoPlaceholders, 'mapPlaceholder'>>;
      type MapShouldBeSomeClass = AssertSomeClass<ObjMapPlaceholder>;

      type ObjListPlaceholder = GetValue<Pick<ObjNoPlaceholders, 'listPlaceholder'>>;
      type ListShouldBeSomeClass = AssertSomeClass<ObjListPlaceholder>;

      type ObjSetPlaceholder = GetValue<Pick<ObjNoPlaceholders, 'setPlaceholder'>>;
      type SetShouldBeSomeClass = AssertSomeClass<ObjSetPlaceholder>;

      type ObjSetPlaceholderOrString = GetValue<
        Pick<ObjNoPlaceholders, 'setOfStringOrTPlaceholder'>
      >;
      type ShouldBeString<T extends string> = T;
      type SetOrStringShouldBeSomeClass = AssertSomeClass<
        Exclude<ObjSetPlaceholderOrString, string>
      >;
      type SetOrStringShouldBeString = ShouldBeString<
        Exclude<ObjSetPlaceholderOrString, SomeClass>
      >;
    });

    it('works with `recordDefault`', () => {
      const someSymbol = Symbol();
      class SomeClass {
        [someSymbol] = someSymbol;
      }

      class Foo extends Recordize.define({
        foo: 'something',
        map: Recordize.MapOf(SomeClass),
      }) {}

      Foo.recordDefault;

      type GetValue<T> = { [P in keyof T]: T[P] }[keyof T];
      type AssertSomeClass<T extends SomeClass> = T;

      type ShouldBeSomeClass = AssertSomeClass<GetValue<Pick<typeof Foo.recordDefault, 'map'>>>;
    });
  });
});
