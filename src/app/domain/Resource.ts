export const resourceTypes = ["solid", "liquid"] as const;
export type ResourceType = typeof resourceTypes[number];

export class Resource<T extends ResourceType = ResourceType> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly color: string,
    readonly type: T
  ) {}
}
