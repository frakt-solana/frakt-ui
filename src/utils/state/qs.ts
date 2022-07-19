import compose from 'ramda/es/compose';
import map from 'ramda/es/map';
import fromPairs from 'ramda/es/fromPairs';
import split from 'ramda/es/split';
import last from 'ramda/es/last';
import ifElse from 'ramda/es/ifElse';
import isEmpty from 'ramda/es/isEmpty';
import { compact } from 'ramda-adjunct';

export const parse = ifElse(
  isEmpty,
  () => ({}),
  compose<any, any, any, any, any, any, any>(
    fromPairs,
    map(split('=')),
    compact,
    split('&'),
    last,
    split('?'),
  ),
);
