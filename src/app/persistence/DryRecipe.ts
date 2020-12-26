import { FLOWS } from "../domain/Recipe";
import { ResourceType } from "../domain/Resource";

export class DryResourceFlow<T extends ResourceType = ResourceType> {
  constructor(
    readonly resource: string,
    readonly resourceType: T,
    readonly flowRate: number
  ) {}
}

export type DRY_RESOURCE_FLOWS<T extends FLOWS> = {
  [P in keyof T]: [T[P]] extends [ResourceType] ? DryResourceFlow<T[P]> : never;
};

export class DryRecipe<
  INPUTS extends FLOWS = FLOWS,
  OUTPUTS extends FLOWS = FLOWS
> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly inputs: DRY_RESOURCE_FLOWS<INPUTS>,
    readonly outputs: DRY_RESOURCE_FLOWS<OUTPUTS>,
    readonly building: string
  ) {}
}
