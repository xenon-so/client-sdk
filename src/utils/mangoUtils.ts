import { PerpOrderType } from '@blockworks-foundation/mango-client';

export const mapOrderType = (type: PerpOrderType) => {
  switch (type) {
    case 'limit':
      return 0;
    case 'ioc':
      return 1;
    case 'postOnly':
      return 2;
    case 'market':
      return 3;
    case 'postOnlySlide':
      return 4;
    default:
      return 0;
  }
};
