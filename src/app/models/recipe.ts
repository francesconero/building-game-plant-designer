import { FixedSizeArray, Tuple } from "../../utils/tuples";
import { Building } from "./building";
import { Resource, ResourceType } from "./resource";

export class ResourceFlow<T extends Resource<ResourceType>> {
  constructor(readonly resource: T, readonly flowRate: number) {}
}

type FLOWS = Array<ResourceType>;

type RESOURCE_FLOWS<T extends FLOWS> = {
  [P in keyof T]: [T[P]] extends [ResourceType]
    ? ResourceFlow<Resource<T[P]>>
    : never;
};

type FreezeDry<T, S extends keyof T> = Omit<T, S> &
  {
    [K in S]: T[K] extends unknown[]
      ? FixedSizeArray<string, T[K]["length"]>
      : string;
  };

export class Recipe<INPUTS extends FLOWS, OUTPUTS extends FLOWS> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly inputs: RESOURCE_FLOWS<INPUTS>,
    readonly outputs: RESOURCE_FLOWS<OUTPUTS>,
    readonly building: Building<INPUTS, OUTPUTS>
  ) {}

  dry(): FreezeDry<Recipe<INPUTS, OUTPUTS>, "inputs" | "outputs" | "building"> {
    const dryInputs: any = this.inputs.map((x) => x.resource.id);
    const dryOutputs: any = this.outputs.map((x) => x.resource.id);
    return {
      ...this,
      building: this.building.id,
      inputs: dryInputs,
      outputs: dryOutputs,
    };
  }
}
