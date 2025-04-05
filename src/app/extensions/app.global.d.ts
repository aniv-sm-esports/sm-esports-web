export {}

// Prototype Extensions
//
declare global {
  interface String {
    contains(substring: string) : string;
  }
}

String.prototype.contains = function (this : string, substring: string): boolean {

  for (let i = 0; i < this.length; i++) {

    let j:number = 0;

    // Iterate until substring is exhausted
    while (j < substring.length &&
    i + j < this.length &&
    this[i + j] == substring[j++]) {
    }

    // Success
    if (j == substring.length) {
      return true;
    }
  }

  return false;
};
