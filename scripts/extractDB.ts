import {
  Dictionary,
  includes,
  keyBy,
  uniq,
  values,
  isNil,
  intersection,
} from "lodash";
import { DryRecipe, DryResourceFlow } from "../src/app/persistence/DryRecipe";
import { DryBuilding } from "../src/app/persistence/DryBuilding";
import { DryResource } from "../src/app/persistence/DryResource";
import { ResourceType } from "../src/app/domain/Resource";
import { promises as fsp } from "fs";
import randomColor from "randomcolor";

const file = process.argv[2];

if (file) {
  console.log("Extraction started...");
  fsp
    .readFile(file, "utf-8")
    .then(extractDB)
    .then((db) =>
      fsp.writeFile("extracted.json", JSON.stringify(db, null, 4), "utf-8")
    )
    .then(() => console.log("Extraction complete"))
    .catch((error) => console.error(error));
} else {
  console.error("No file provided");
}

function extractList(str: string): string[] {
  str = str.trim();
  var strListOfProducer = str.substring(1, str.length - 1);
  return strListOfProducer.split(",");
}

function toDryResourceFlows(
  str: string,
  resourceMap: Dictionary<DryResource>,
  productionTime: number
): DryResourceFlow<ResourceType>[] {
  str = str.trim();
  str = str.replace(/["']/g, "");
  str = str.substring(2, str.length - 2);
  str = '[{"' + str + '"}]';
  str = str.replace(/\),\(/g, '"}.{"');
  str = str.replace(/,/g, '","');
  str = str.replace(/=/g, '":"');
  str = str.replace(/\}\.\{/g, "},{");
  const productionRate = 60 / productionTime;

  return JSON.parse(str).map((obj: any) => {
    const resourceId = obj.ItemClass.split(".").pop();
    const resource = resourceMap[resourceId];
    if (!resource) {
      throw new Error(`Resource ${resourceId} not found`);
    }
    return {
      resourceType: resource.type,
      resource: resourceId,
      flowRate: parseInt(obj.Amount) * productionRate,
    } as DryResourceFlow<ResourceType>;
  });
}

type DB = {
  resources: DryResource[];
  buildings: DryBuilding[];
  recipes: DryRecipe[];
};

interface Class {
  ClassName: string;
  mDisplayName: string;
}

const validResourceTypes = ["RF_SOLID", "RF_LIQUID"] as const;
type ValidResourceType = typeof validResourceTypes[number];
type RawResourceType = ValidResourceType | "RF_INVALID";

interface RawResource extends Class {
  mForm: RawResourceType;
}

interface ValidRawResource extends RawResource {
  mForm: ValidResourceType;
}

interface RawBuilding extends Class {
  mPowerConsumption: number;
}

interface RawRecipe extends Class {
  mIngredients: string;
  mProduct: string;
  mManufactoringDuration: number;
  mProducedIn: string;
  buildings?: string[];
}

type Content<T extends Class> = {
  NativeClass: string;
  Classes: T[];
};

function isValidRawResource(
  rawResource: RawResource
): rawResource is ValidRawResource {
  return includes(validResourceTypes, rawResource.mForm);
}

function isRawResourceContent(
  rawContent: Content<Class>
): rawContent is Content<RawResource> {
  const nativeClass = rawContent.NativeClass;
  return (
    nativeClass === "Class'/Script/FactoryGame.FGResourceDescriptor'" ||
    nativeClass === "Class'/Script/FactoryGame.FGConsumableDescriptor'" ||
    nativeClass.startsWith("Class'/Script/FactoryGame.FGItemDescriptor")
  );
}

function isRawBuildingContent(
  rawContent: Content<Class>
): rawContent is Content<RawBuilding> {
  const nativeClass = rawContent.NativeClass;
  return (
    nativeClass.startsWith("Class'/Script/FactoryGame.FGBuildable") &&
    nativeClass !== "Class'/Script/FactoryGame.FGBuildableAutomatedWorkBench'"
  );
}

function isRawRecipeContent(
  rawContent: Content<Class>
): rawContent is Content<RawRecipe> {
  const nativeClass = rawContent.NativeClass;
  return nativeClass === "Class'/Script/FactoryGame.FGRecipe'";
}

function toRecipe(
  rawRecipe: RawRecipe,
  resourceMap: Dictionary<DryResource>
): DryRecipe {
  try {
    const inputs: DryResourceFlow<ResourceType>[] = toDryResourceFlows(
      rawRecipe.mIngredients,
      resourceMap,
      rawRecipe.mManufactoringDuration
    );
    const outputs: DryResourceFlow<ResourceType>[] = toDryResourceFlows(
      rawRecipe.mProduct,
      resourceMap,
      rawRecipe.mManufactoringDuration
    );

    const buildings = rawRecipe.buildings;
    if (buildings) {
      if (buildings.length > 1) {
        throw new Error(
          `Too many buildings! ${JSON.stringify(buildings, null, 4)}`
        );
      }
      const building = buildings[0];
      if (building) {
        return {
          id: rawRecipe.ClassName,
          name: rawRecipe.mDisplayName,
          building: building,
          inputs: inputs,
          outputs: outputs,
        };
      }
    }
  } catch (error) {
    console.log(`Error processing recipe:`);
    console.dir(rawRecipe);
    throw error;
  }

  throw new Error(`No building found for recipe ${rawRecipe.mDisplayName}`);
}

type BuildingIO = {
  inputs: ResourceType[];
  outputs: ResourceType[];
};

function aggregateRecipeTypes(recipes: DryRecipe[]): BuildingIO {
  const randomRecipe = recipes[0];
  if (randomRecipe) {
    const buildingIO: BuildingIO = {
      inputs: randomRecipe.inputs.map((i) => i.resourceType),
      outputs: randomRecipe.outputs.map((i) => i.resourceType),
    };
    if (buildingIO.inputs.filter(isNil).length) {
      throw new Error(
        `Found null in inputs of recipe: ${JSON.stringify(randomRecipe)}`
      );
    }
    if (buildingIO.outputs.filter(isNil).length) {
      throw new Error(
        `Found null in outputs of recipe: ${JSON.stringify(randomRecipe)}`
      );
    }
    return buildingIO;
  } else {
    throw new Error("No recipes provided!");
  }
}

function toBuilding(
  rawBuilding: RawBuilding,
  recipes: DryRecipe[]
): DryBuilding {
  const recipeTypes = aggregateRecipeTypes(
    recipes.filter((recipe) => recipe.building === rawBuilding.ClassName)
  );
  return {
    id: rawBuilding.ClassName,
    name: rawBuilding.mDisplayName,
    basePowerConsumption: rawBuilding.mPowerConsumption,
    inputs: recipeTypes.inputs,
    outputs: recipeTypes.outputs,
  };
}

function toResource(rawResource: ValidRawResource): DryResource {
  return {
    id: rawResource.ClassName,
    name: rawResource.mDisplayName,
    type: rawResource.mForm === "RF_LIQUID" ? "liquid" : "solid",
    color: randomColor(),
  };
}

function isNotNil<T>(val: T | null | undefined): val is T {
  return !isNil(val);
}

function extractBuildingIds(rawData: string): string[] {
  return extractList(rawData)
    .map((building) => building.split(".").pop())
    .filter(isNotNil);
}

function extractDB(rawContents: string): DB {
  const contents: Content<Class>[] = JSON.parse(rawContents);

  const resourceMap = keyBy(
    contents
      .filter(isRawResourceContent)
      .flatMap((r) => r.Classes)
      .filter(isValidRawResource)
      .map(toResource),
    (resource) => resource.id
  );

  const rawRecipes = contents
    .filter(isRawRecipeContent)
    .flatMap((r) => r.Classes);

  const recipeBuildings = uniq(
    rawRecipes.flatMap((recipe) => extractBuildingIds(recipe.mProducedIn))
  );

  const rawBuildings = contents
    .filter(isRawBuildingContent)
    .flatMap((r) => r.Classes);

  const validRawBuildings = rawBuildings.filter((building) =>
    recipeBuildings.includes(building.ClassName)
  );

  const validRawBuildingsIds = validRawBuildings.map(
    (building) => building.ClassName
  );

  const validRawRecipes = rawRecipes
    .map((recipe) => ({
      ...recipe,
      buildings: intersection(
        validRawBuildingsIds,
        extractBuildingIds(recipe.mProducedIn)
      ),
    }))
    .filter((recipe) => recipe.buildings.length > 0);

  const recipes = validRawRecipes.map((rawRecipe) =>
    toRecipe(rawRecipe, resourceMap)
  );
  const buildings = validRawBuildings.map((building) =>
    toBuilding(building, recipes)
  );

  return {
    buildings: buildings,
    resources: values(resourceMap),
    recipes: recipes,
  };
}
