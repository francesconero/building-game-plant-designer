import { Tuple } from "../../utils/tuples";
import { ResourceType } from "./Resource";

export class Building<
  INPUTS extends Tuple<ResourceType, number> = Array<ResourceType>,
  OUTPUTS extends Tuple<ResourceType, number> = Array<ResourceType>
> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly basePowerConsumption: number,
    readonly inputs: INPUTS,
    readonly outputs: OUTPUTS
  ) {}
}
