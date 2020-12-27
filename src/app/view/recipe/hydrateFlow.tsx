import { DryResourceFlow } from "../../persistence/DryRecipe";
import { Resource } from "../../domain/Resource";

export function hydrateFlow(dryFlow: DryResourceFlow, resources: Resource[]) {
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
