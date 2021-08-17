import { assert } from "console"
import L from "../L"

/**
 * Creates a promise to delay a number of milliseconds
 * 
 * @param ms The number of milliseconds to delay
 * @returns A promise that resolves after `ms` milliseconds
 */
export async function delay(ms: number): Promise<void> {
  L.v(`Delaying ${ms}ms...`)
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Retry a task.
 * 
 * @param task The async task function
 * @param times The number of times to retry the task. Default = MAX_SAFE_INTEGER
 * @returns The result of first successful task
 */
export async function retry<T extends any>(
  task: () => Promise<T | undefined | null>,
  times: number = Number.MAX_SAFE_INTEGER,
): Promise<T> {
  assert(times >= 0, 'Arg "times" must be a non-negative number.')
  return await _retry(task, times)
}

async function _retry<T extends any>(
  task: () => Promise<T | undefined | null>,
  times: number,
): Promise<T> {
  if (times < 0) throw new Error('Max retries reached.')
  const result = await task()
  if (result) return result
  return _retry(task, times - 1)
}

/**
 * Retry a task with a delay between each retry.
 * 
 * @param task The async task function
 * @param times The number of times to retry the task. Default = MAX_SAFE_INTEGER
 * @param delayMs The number of milliseconds to delay between retries
 * @returns The result of first successful task
 */
export async function delayedRetry<T extends any>(
  task: () => Promise<T | undefined | null>,
  delayMs: number,
  times: number = Number.MAX_SAFE_INTEGER,
): Promise<T> {
  return await retry(async () => {
    const result = await task()
    if (result) return result
    await delay(delayMs)
    return undefined
  }, times)
}
