import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ListProps,
  EditButton,
  NumberField,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  required,
  CreateProps,
  ReferenceInput,
  ArrayField,
  SingleFieldList,
  ChipField,
  FunctionField,
  Record,
} from "react-admin";
import _ from "lodash";
import { Recipe } from "./models/recipe";
import { Tuple } from "../utils/tuples";
import { ResourceType } from "./models/resource";
import { resourceTypeChoices } from "./resources";
import { Building } from "./models/building";

export const RecipeList: React.FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <ArrayField source="inputs">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="outputs">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <FunctionField
        label="Building"
        render={(record: any) => `${record.building.name}`}
      />
      <EditButton />
    </Datagrid>
  </List>
);

interface RecipeTitleProps {
  record?: Recipe<Tuple<ResourceType, number>, Tuple<ResourceType, number>>;
}

const RecipeTitle: React.FC<RecipeTitleProps> = ({ record }) =>
  record ? (
    <span>
      Recipe #{record.id} - {record.name}
    </span>
  ) : null;

export const RecipeCreate: React.FC<CreateProps> = (props) => (
  <Create
    title="Create a Recipe"
    {...props}
    transform={(data) =>
      data.id ? data : { ...data, id: _.camelCase(data.name) }
    }
  >
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" validate={required()} />
      <ArrayInput source="inputs" defaultValue={[]}>
        <SimpleFormIterator>
          <ReferenceInput
            label="resource"
            source="resource"
            reference="resources"
            validate={required()}
          >
            <SelectInput optionText="name" />
          </ReferenceInput>
          <NumberInput source="flowRate" validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="outputs" defaultValue={[]}>
        <SimpleFormIterator>
          <ReferenceInput
            label="resource"
            source="resource"
            reference="resources"
            validate={required()}
          >
            <SelectInput optionText="name" />
          </ReferenceInput>
          <NumberInput source="flowRate" validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
      <ReferenceInput
        label="building"
        source="building"
        reference="buildings"
        validate={required()}
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
