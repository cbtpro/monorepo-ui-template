/**
 * 随机获取随机数
 * @param min 最小值
 * @param max 最大值
 * @param isFloat 是否允许小数
 * @returns 随机数
 */
function random(min = 0, max = 100, isFloat = false) {
  const array = new window.Uint32Array(1)
  const maxUint = 0xFFFFFFFF
  const randomNumber = window.crypto.getRandomValues(array)[0] / maxUint
  const randomRangeValue = (max - min + 1) * randomNumber + min
  return isFloat ? randomRangeValue : window.Math.floor(randomRangeValue)
}

/**
 * 从数组中随机获取多个组成新数组
 * @param arr 数组
 * @param length 长度
 * @returns 随机获取的数组
 */
function randomTakeArrayFromArray<T>(arr: T[] = [], length = 10) {
  const result: T[] = []
  // 组成的新数组初始化
  for (let i = 0; i < length; i++) {
    const index = random(0, arr.length - 1)
    const item = arr[index]
    result.push(item)
    arr.splice(index, 1)
  }
  return result
}

export { random, randomTakeArrayFromArray }
