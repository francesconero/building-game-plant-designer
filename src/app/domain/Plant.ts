import { Recipe, ResourceFlow } from "./Recipe";
import { groupBy, mapValues, values } from "lodash";

export class Plant {
  readonly targetFlows: ResourceFlow[];

  constructor(
    readonly id: string,
    readonly name: string,
    targetFlows: ResourceFlow[],
    readonly recipes: Recipe[]
  ) {
    const grouped = groupBy(targetFlows, (flow) => flow.resource.id);
    const summed = mapValues(grouped, (groups) =>
      groups.reduce(
        (flow, acc) =>
          new ResourceFlow(acc.resource, flow.flowRate + acc.flowRate)
      )
    );
    this.targetFlows = values(summed);
  }
}
