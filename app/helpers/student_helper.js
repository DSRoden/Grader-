'use strict';

exports.color = function(score){
  if(score >= 90){
    return '#0074D9';
  }else if(score >= 80){
    return '#2ECC40';
  }else if(score >=70){
    return '#FFDC00';
  }else if(score >=60){
    return '#FF851B';
  }else {
    return '#85144B';
  }
};
