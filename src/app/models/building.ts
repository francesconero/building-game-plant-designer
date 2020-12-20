import { Tuple } from "../../utils/tuples";
import { ResourceType } from "./resource";

export class Building<
  INPUTS extends Tuple<ResourceType, number>,
  OUTPUTS extends Tuple<ResourceType, number>
> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly basePowerConsumption: number,
    readonly inputs: INPUTS,
    readonly outputs: OUTPUTS
  ) {}
}
