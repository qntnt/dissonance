
export function reverseRecord<A extends string | symbol | number, B extends string | symbol | number>(
  record: Record<A, B>
): Partial<Record<B, A>> {
  return Object.entries(record)
    .reduce((p, [str, val]) => ({ 
      ...p,
      [val as B]: str,
    }), {} as Record<B, A>)
}