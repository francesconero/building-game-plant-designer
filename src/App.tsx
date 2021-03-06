import * as React from "react";
import { Admin, Resource } from "react-admin";
import localStorageDataProviderExtended from "./app/localStorageDataProviderExtended";
import { ResourceList, ResourceCreate, ResourceEdit } from "./app/resources";
import { BuildingList, BuildingCreate, BuildingEdit } from "./app/buildings";
import { RecipeCreate, RecipeEdit, RecipeList } from "./app/recipes";
import Dashboard from "./app/Dashboard";
import { PlantList, PlantCreate } from "./app/plants";
import theme from "./theme";

const dataProvider = localStorageDataProviderExtended({
  defaultData: {},
  localStorageKey: "plantDesigner",
  localStorageUpdateDelay: 0,
  loggingEnabled: true,
});

const App = () => (
  <Admin dataProvider={dataProvider} dashboard={Dashboard} theme={theme}>
    <Resource
      name="resources"
      list={ResourceList}
      create={ResourceCreate}
      edit={ResourceEdit}
    />
    <Resource
      name="buildings"
      list={BuildingList}
      create={BuildingCreate}
      edit={BuildingEdit}
    />
    <Resource
      name="recipes"
      list={RecipeList}
      create={RecipeCreate}
      edit={RecipeEdit}
    />
    <Resource name="plants" list={PlantList} create={PlantCreate} />
  </Admin>
);

export default App;
