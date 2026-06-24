// Re-export every `#[no_mangle] extern "C"` symbol from mason-c so they are
// retained in the produced `masonnative.lib` static library.
extern crate mason_c;
