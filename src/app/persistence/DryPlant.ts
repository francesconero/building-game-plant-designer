import { DryResourceFlow } from "./DryRecipe";

export class DryPlant {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly targetFlows: DryResourceFlow[]
  ) {}
}
