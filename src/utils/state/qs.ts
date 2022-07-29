import compose from 'ramda/es/compose';
import map from 'ramda/es/map';
import fromPairs from 'ramda/es/fromPairs';
import split from 'ramda/es/split';
import last from 'ramda/es/last';
import ifElse from 'ramda/es/ifElse';
import isEmpty from 'ramda/es/isEmpty';
import concat from 'ramda/es/concat';
import join from 'ramda/es/join';
import toPairs from 'ramda/es/toPairs';
import allPass from 'ramda/es/allPass';
import { compact, isNotEmpty, isNotNil } from 'ramda-adjunct';
import { pickBy } from 'ramda';

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

export const stringify = ifElse(
  isEmpty,
  () => '',
  compose(
    concat('?'),
    join('&'),
    map(join('=')),
    toPairs,
    pickBy(allPass([isNotNil, isNotEmpty])),
  ),
);
