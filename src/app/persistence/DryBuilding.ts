import { Tuple } from "../../utils/tuples";
import { Building } from "../domain/Building";
import { ResourceType } from "../domain/Resource";

export class DryBuilding<
  INPUTS extends Tuple<ResourceType, number> = Tuple<ResourceType, number>,
  OUTPUTS extends Tuple<ResourceType, number> = Tuple<ResourceType, number>
> extends Building<INPUTS, OUTPUTS> {}
