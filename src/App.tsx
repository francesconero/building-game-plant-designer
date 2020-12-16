import * as React from "react";
import { Admin, Resource } from "react-admin";
import localStorageDataProvider from "ra-data-local-storage";
import { ResourceList, ResourceCreate, ResourceEdit } from "./app/resources";
import { BuildingList, BuildingCreate, BuildingEdit } from "./app/buildings";
import { RecipeCreate, RecipeList } from "./app/recipes";

const dataProvider = localStorageDataProvider({
  defaultData: {},
  localStorageKey: "plantDesigner",
  localStorageUpdateDelay: 0,
  loggingEnabled: true,
});

const App = () => (
  <Admin dataProvider={dataProvider}>
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
    <Resource name="recipes" list={RecipeList} create={RecipeCreate} />
  </Admin>
);

export default App;
