import { isSome, none, Option, some } from "fp-ts/lib/Option";
import { make, Tree } from "fp-ts/lib/Tree";
import { mergeWith } from "lodash";
import { DryRecipe } from "../persistence/DryRecipe";
import { Resource } from "./Resource";

type ResourceRecipeMap = Record<Resource["id"], DryRecipe[]>;
type ResourceId = Resource["id"];
type RecipeId = DryRecipe["id"];
type Flow = { resourceId: ResourceId; flowRate: number };
type RecipeFlow = { recipeId: RecipeId; flowRate: number };
type RecipeFlowMap = Record<RecipeId, RecipeFlow>;
export type SelectRecipe = (
  recipes: DryRecipe[],
  targetResourceId: ResourceId
) => DryRecipe | undefined;

export function getResourceProducingRecipes(
  resourceId: Resource["id"],
  recipes: DryRecipe[]
): DryRecipe[] {
  return recipes.filter(
    (recipe) =>
      recipe.outputs.filter((output) => output.resource === resourceId).length >
      0
  );
}

export function buildResourceRecipesMap(
  recipes: DryRecipe[]
): ResourceRecipeMap {
  return recipes.reduce((recipeMap, recipe) => {
    const producedResources = recipe.outputs.map((output) => output.resource);
    return producedResources.reduce((acc, resource) => {
      const currentRecipes = acc[resource];
      if (!currentRecipes) {
        const out = { ...acc };
        out[resource] = [recipe];
        return out;
      } else {
        const out = { ...acc };
        out[resource] = [...currentRecipes, recipe];
        return out;
      }
    }, recipeMap);
  }, {} as ResourceRecipeMap);
}

export function buildRecipeTree(
  resourceRecipeMap: ResourceRecipeMap,
  targetResourceId: ResourceId,
  selectRecipe: SelectRecipe
): Option<Tree<DryRecipe>> {
  const targetRecipes = resourceRecipeMap[targetResourceId];
  if (targetRecipes && targetRecipes.length > 0) {
    const selectedRecipe = selectRecipe(targetRecipes, targetResourceId);
    if (!selectedRecipe) {
      throw new Error(`Could not find a recipe for ${targetResourceId}`);
    }
    const forest = selectedRecipe.inputs
      .map((input) =>
        buildRecipeTree(resourceRecipeMap, input.resource, selectRecipe)
      )
      .filter(isSome)
      .map((o) => o.value);
    return some(make(selectedRecipe, forest));
  } else {
    return none;
  }
}

export function getRequiredMaterials(
  targetResourceFlow: Flow,
  resourceRecipeMap: ResourceRecipeMap,
  selectRecipe: SelectRecipe,
  usedRecipes: RecipeId[] = []
): RecipeFlowMap {
  const targetRecipes = resourceRecipeMap[targetResourceFlow.resourceId];
  if (targetRecipes && targetRecipes.length) {
    const availableRecipes = targetRecipes.filter(
      (recipe) => !usedRecipes.includes(recipe.id)
    );
    const selectedRecipe = selectRecipe(
      availableRecipes,
      targetResourceFlow.resourceId
    );
    if (!selectedRecipe) {
      throw new Error(
        `Could not find a recipe for ${targetResourceFlow.resourceId}`
      );
    }
    const requiredOutput = selectedRecipe.outputs.find(
      (output) => output.resource === targetResourceFlow.resourceId
    );
    if (!requiredOutput) {
      throw new Error(
        `Required output for recipe ${selectedRecipe.name} not found`
      );
    }
    const flowMultiplier =
      targetResourceFlow.flowRate / requiredOutput.flowRate;

    const inputsRequiredMaterials = selectedRecipe.inputs
      .map((input) =>
        getRequiredMaterials(
          {
            resourceId: input.resource,
            flowRate: input.flowRate * flowMultiplier,
          },
          resourceRecipeMap,
          selectRecipe,
          [selectedRecipe.id, ...usedRecipes]
        )
      )
      .reduce((map1, map2) => mergeWith(map1, map2, mergeRecipeFlows), {});
    const current: RecipeFlowMap = {
      [targetResourceFlow.resourceId]: {
        recipeId: selectedRecipe.id,
        flowRate: targetResourceFlow.flowRate,
      },
    };
    return mergeWith(current, inputsRequiredMaterials, mergeRecipeFlows);
  } else {
    return {};
  }
}

function mergeRecipeFlows(
  recipeFlow1?: RecipeFlow,
  recipeFlow2?: RecipeFlow
): RecipeFlow {
  let recipeFlowA;
  let recipeFlowB;
  if (recipeFlow1) {
    recipeFlowA = recipeFlow1;
    recipeFlowB = recipeFlow2;
  } else if (recipeFlow2) {
    recipeFlowA = recipeFlow2;
    recipeFlowB = recipeFlow1;
  } else {
    throw new Error("At least one recipeFlow required");
  }

  if (!recipeFlowB) {
    return recipeFlowA;
  }

  if (recipeFlowA.recipeId !== recipeFlowB.recipeId) {
    throw new Error(
      `Trying to merge differente recipes: ${recipeFlowA.recipeId} - ${recipeFlowB.recipeId}`
    );
  }

  return {
    recipeId: recipeFlowA.recipeId,
    flowRate: recipeFlowA.flowRate + recipeFlowB.flowRate,
  };
}
