/**
 * Creates a promise to delay a number of milliseconds
 *
 * @param ms The number of milliseconds to delay
 * @returns A promise that resolves after `ms` milliseconds
 */
export declare function delay(ms: number): Promise<void>;
/**
 * Retry a task.
 *
 * @param task The async task function
 * @param times The number of times to retry the task. Default = MAX_SAFE_INTEGER
 * @returns The result of first successful task
 */
export declare function retry<T extends any>(task: () => Promise<T | undefined | null>, times?: number): Promise<T>;
/**
 * Retry a task with a delay between each retry.
 *
 * @param task The async task function
 * @param times The number of times to retry the task. Default = MAX_SAFE_INTEGER
 * @param delayMs The number of milliseconds to delay between retries
 * @returns The result of first successful task
 */
export declare function delayedRetry<T extends any>(task: () => Promise<T | undefined | null>, delayMs: number, times?: number): Promise<T>;
