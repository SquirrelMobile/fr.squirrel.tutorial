// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;


(function constructor(args){

  if (args.image) {
    $.image1.applyProperties(args);
  }
  else {
    $.scrollView.applyProperties(args);
  }

})(args);
