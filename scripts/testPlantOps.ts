import {
  getRequiredMaterials,
  buildResourceRecipesMap,
} from "../src/app/domain/PlantOps";
import { promises as fsp } from "fs";
import { DB } from "./extractDB";
import { DryRecipe } from "../src/app/persistence/DryRecipe";

function selectRecipe(
  recipes: DryRecipe[],
  targetResourceId: string
): DryRecipe | undefined {
  if (targetResourceId === "Desc_LiquidOil_C") {
    return recipes.find((recipe) => recipe.id === "Recipe_LiquidOil_C");
  }
  return recipes[0];
}

fsp
  .readFile("./plantDesigner.json", "utf-8")
  .then((content) => {
    const db: DB = JSON.parse(content);
    const resourceRecipeMap = buildResourceRecipesMap(db.recipes);
    const requiredMaterials = getRequiredMaterials(
      {
        resourceId: "Desc_PolymerResin_C",
        flowRate: 12,
      },
      resourceRecipeMap,
      selectRecipe
    );

    console.log(JSON.stringify(requiredMaterials, null, 4));
  })
  .catch((error) => console.error(error));
