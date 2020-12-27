import { Tuple } from "../../utils/tuples";
import { Building } from "./Building";
import { Resource, ResourceType } from "./Resource";

export class ResourceFlow<
  T extends Resource<ResourceType> = Resource<ResourceType>
> {
  constructor(readonly resource: T, readonly flowRate: number) {}
}

export type FLOWS = Tuple<ResourceType, number>;

type RESOURCE_FLOWS<T extends FLOWS> = {
  [P in keyof T]: [T[P]] extends [ResourceType]
    ? ResourceFlow<Resource<T[P]>>
    : never;
};

export class Recipe<
  INPUTS extends FLOWS = Array<ResourceType>,
  OUTPUTS extends FLOWS = Array<ResourceType>
> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly inputs: RESOURCE_FLOWS<INPUTS>,
    readonly outputs: RESOURCE_FLOWS<OUTPUTS>,
    readonly building: Building<INPUTS, OUTPUTS>
  ) {}
}
