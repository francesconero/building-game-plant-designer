import { Tuple } from "../../utils/tuples";
import { ResourceType } from "../domain/Resource";

export class DryBuilding<
  INPUTS extends Tuple<ResourceType, number> = Tuple<ResourceType, number>,
  OUTPUTS extends Tuple<ResourceType, number> = Tuple<ResourceType, number>
> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly basePowerConsumption: number,
    readonly inputs: INPUTS,
    readonly outputs: OUTPUTS
  ) {}
}
