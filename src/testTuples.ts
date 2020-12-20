import { Building } from "./app/domain/Building";
import { Recipe, ResourceFlow } from "./app/domain/Recipe";
import { Resource } from "./app/domain/Resource";

export {};

const ironOre = new Resource("ironOre", "Iron ore", "darkRed", "solid");
const ironIngot = new Resource("ironIngot", "Iron ingot", "gray", "solid");
const ironOreFlow = new ResourceFlow(ironOre, 5);
const ironIngotFlow = new ResourceFlow(ironIngot, 5);
const smelter = new Building("smelter", "Smelter", 50, ["solid"], ["solid"]);

const ironIngots = new Recipe(
  "ironIngots",
  "Iron ingots",
  [ironOreFlow],
  [ironIngotFlow],
  smelter
);

const a: [ResourceFlow<Resource<"solid">>] = ironIngots.inputs;
