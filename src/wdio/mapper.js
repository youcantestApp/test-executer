'use strict';

export default (alias) => {
  if(this[alias] && typeof(this[alias] === 'function')) {
    return this[alias];
  }

  if(alias === 'assertValue'){
    return this['checkValue'];
  }
  if(alias === 'checkVisibility'){
    return this['isElementVisible'];
  }
  if(alias === 'checkVisibility'){
    return this['isElementVisible'];
  }
  if(alias === 'elementExists'){
    return this['isElementExists'];
  }

  throw 'Function not found!';
};
