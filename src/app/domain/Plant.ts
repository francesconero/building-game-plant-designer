import { ResourceFlow } from "./Recipe";

export class Plant {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly targetFlows: ResourceFlow[]
  ) {}
}
