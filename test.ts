const s = 'Was it a car or a cat I saw?'

function isAlphaNum(c) {
  return (
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    (c >= '0' && c <= '9')
  );
}
/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  const first = s.toLowerCase().split('').filter(char => isAlphaNum(char)).join('');
  // const reveresed = s.toLowerCase().split('').filter(char => isAlphaNum(char)).reverse().join('');
  const reveresed = first.split('').reverse().join('');

  console.log(first);
  console.log(reveresed);

}

// console.log(isPalindrome(s));
isPalindrome(s);

