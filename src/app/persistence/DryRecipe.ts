import { isNil, negate } from "lodash";
import { DataProvider } from "react-admin";
import { Building } from "../domain/Building";
import { FLOWS, Recipe, ResourceFlow } from "../domain/Recipe";
import { Resource, ResourceType } from "../domain/Resource";
import { DryBuilding } from "./DryBuilding";
import { DryResource } from "./DryResource";

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
  INPUTS extends FLOWS = Array<ResourceType>,
  OUTPUTS extends FLOWS = Array<ResourceType>
> {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly inputs: DRY_RESOURCE_FLOWS<INPUTS>,
    readonly outputs: DRY_RESOURCE_FLOWS<OUTPUTS>,
    readonly building: string
  ) {}
}

export function hydrateRecipe(
  dryRecipe: DryRecipe,
  dataProvider: DataProvider
): Promise<Recipe> {
  return Promise.all([
    dataProvider.getOne<DryBuilding>("buildings", {
      id: dryRecipe.building,
    }),
    dataProvider.getMany<DryResource>("resources", {
      ids: dryRecipe.inputs
        .filter(negate(isNil))
        .map((input) => input.resource),
    }),
    dataProvider.getMany<DryResource>("resources", {
      ids: dryRecipe.outputs
        .filter(negate(isNil))
        .map((output) => output.resource),
    }),
  ]).then(
    ([
      { data: dryBuilding },
      { data: inputResources },
      { data: outputResources },
    ]) => {
      const inputResourceFlows = dryRecipe.inputs
        .filter((dryFlow) => dryFlow?.resource)
        .map((dryFlow) => hydrateFlow(dryFlow, inputResources));
      const outputResourceFlows = dryRecipe.outputs
        .filter((dryFlow) => dryFlow?.resource)
        .map((dryFlow) => hydrateFlow(dryFlow, outputResources));

      const building: Building = dryBuilding;

      return new Recipe(
        dryRecipe.id,
        dryRecipe.name,
        inputResourceFlows,
        outputResourceFlows,
        building
      );
    }
  );
}

export function hydrateFlow<T extends Resource<R>, R extends ResourceType>(
  dryFlow: DryResourceFlow<R>,
  resources: T[]
): ResourceFlow<Resource<R>> {
  const hydratedResource = resources.find(
    (resource) => resource.id === dryFlow.resource
  );
  if (!hydratedResource) {
    throw new Error(`missing resource ${dryFlow.resource}`);
  }
  return {
    ...dryFlow,
    resource: hydratedResource,
  };
}
