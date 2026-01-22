// ************************************************************************** //
//                                                                            //
//                                                                            //
//   hasDuplicate.ts                                                          //
//                                                                            //
//   By: jeportie <jeromep.dev@gmail.com>                                     //
//                                                                            //
//   Created: 2026/01/21 11:40:38 by jeportie                                 //
//   Updated: 2026/01/21 15:31:07 by jeportie                                 //
//                                                                            //
// ************************************************************************** //

const nums: number[] = [3, 2, 3];
const target = 6;

function twoSum(nums: number[], target: number): number[] {
  if (nums.length <= 2) {
    return [0, 1];
  }

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];

    const diffIndex = nums.slice(i + 1).indexOf(diff);

    return [i, diffIndex];

  }
}


console.log(twoSum(nums, target));
