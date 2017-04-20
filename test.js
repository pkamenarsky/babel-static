function test(m) {
  let a = static_ptr(function() { return 5; });

  return function() {
    return static_ptr(function() { console.log("remote"); });
  }
}
