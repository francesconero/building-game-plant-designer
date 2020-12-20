import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  ListProps,
  EditProps,
  Create,
  CreateProps,
  EditButton,
  NumberField,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  required,
  FilterProps,
  Filter,
  SearchInput,
} from "react-admin";
import _ from "lodash";
import { DryBuilding } from "./persistence/DryBuilding";
import { ResourceType } from "./domain/Resource";
import { Tuple } from "../utils/tuples";
import { resourceTypeChoices } from "./resources";

const BuildingFilter: React.FC<Omit<FilterProps, "children">> = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

export const BuildingList: React.FC<ListProps> = (props) => (
  <List {...props} filters={<BuildingFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="powerConsumption" />
      <EditButton />
    </Datagrid>
  </List>
);

interface DryBuildingTitleProps {
  record?: DryBuilding<
    Tuple<ResourceType, number>,
    Tuple<ResourceType, number>
  >;
}

const BuildingTitle: React.FC<DryBuildingTitleProps> = ({ record }) =>
  record ? (
    <span>
      Building #{record.id} - {record.name}
    </span>
  ) : null;

export const BuildingEdit: React.FC<EditProps> = (props) => (
  <Edit
    title={<BuildingTitle />}
    {...props}
    transform={(data) =>
      data.id ? data : { ...data, id: _.camelCase(data.name) }
    }
  >
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" validate={required()} />
      <NumberInput source="powerConsumption" validate={required()} />
      <ArrayInput source="inputs" defaultValue={[]}>
        <SimpleFormIterator>
          <SelectInput choices={resourceTypeChoices} />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="outputs" defaultValue={[]}>
        <SimpleFormIterator>
          <SelectInput choices={resourceTypeChoices} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const BuildingCreate: React.FC<CreateProps> = (props) => (
  <Create
    title="Create a Building"
    {...props}
    transform={(data) =>
      data.id ? data : { ...data, id: _.camelCase(data.name) }
    }
  >
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" validate={required()} />
      <NumberInput source="powerConsumption" validate={required()} />
      <ArrayInput source="inputs" defaultValue={[]}>
        <SimpleFormIterator>
          <SelectInput choices={resourceTypeChoices} />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="outputs" defaultValue={[]}>
        <SimpleFormIterator>
          <SelectInput choices={resourceTypeChoices} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
