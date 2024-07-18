import { describe, expect, it } from 'vitest'
import { random } from './index'

describe('测试', () => {
  it('函数返回值', () => {
    expect(random(1, 2)).lte(2).greaterThanOrEqual(1)
  })
})
