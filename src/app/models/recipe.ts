import { Tuple } from "../../utils/tuples";
import { Building } from "./building";
import { Resource, ResourceType } from "./resource";
import { FreezeDry } from "./utils";

export class ResourceFlow<T extends Resource<ResourceType>> {
  constructor(readonly resource: T, readonly flowRate: number) {}
}

export class Recipe<
  INPUTS extends Tuple<ResourceType, number>,
  OUTPUTS extends Tuple<ResourceType, number>
> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly inputs: {
      [P in keyof INPUTS]: INPUTS[P] extends ResourceType
        ? ResourceFlow<Resource<INPUTS[P]>>
        : never;
    },
    readonly outputs: {
      [P in keyof OUTPUTS]: OUTPUTS[P] extends ResourceType
        ? ResourceFlow<Resource<OUTPUTS[P]>>
        : never;
    },
    readonly building: Building<INPUTS, OUTPUTS>
  ) {}
}
