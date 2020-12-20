import { Building } from "./Building";
import { Resource, ResourceType } from "./Resource";

export class ResourceFlow<T extends Resource<ResourceType>> {
  constructor(readonly resource: T, readonly flowRate: number) {}
}

export type FLOWS = Array<ResourceType>;

type RESOURCE_FLOWS<T extends FLOWS> = {
  [P in keyof T]: [T[P]] extends [ResourceType]
    ? ResourceFlow<Resource<T[P]>>
    : never;
};

export class Recipe<
  INPUTS extends FLOWS = FLOWS,
  OUTPUTS extends FLOWS = FLOWS
> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly inputs: RESOURCE_FLOWS<INPUTS>,
    readonly outputs: RESOURCE_FLOWS<OUTPUTS>,
    readonly building: Building<INPUTS, OUTPUTS>
  ) {}
}
