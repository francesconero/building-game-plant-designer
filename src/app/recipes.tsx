import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ListProps,
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
  Edit,
  EditProps,
  ReferenceField,
  SingleFieldList,
  EditButton,
  ChipField,
  FilterProps,
} from "react-admin";
import _ from "lodash";
import { Tuple } from "../utils/tuples";
import { ResourceType } from "./domain/Resource";
import { DryRecipe } from "./persistence/DryRecipe";

import { Filter, SearchInput } from "react-admin";

const RecipeFilter: React.FC<Omit<FilterProps, "children">> = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

export const RecipeList: React.FC<ListProps> = (props) => (
  <List {...props} filters={<RecipeFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <ArrayField source="inputs">
        <SingleFieldList>
          <ReferenceField label="Input" source="resource" reference="resources">
            <ChipField source="name" />
          </ReferenceField>
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="outputs">
        <SingleFieldList>
          <ReferenceField
            label="Output"
            source="resource"
            reference="resources"
          >
            <ChipField source="name" />
          </ReferenceField>
        </SingleFieldList>
      </ArrayField>
      <ReferenceField label="Building" source="building" reference="buildings">
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);

interface RecipeTitleProps {
  record?: DryRecipe<Tuple<ResourceType, number>, Tuple<ResourceType, number>>;
}

const RecipeTitle: React.FC<RecipeTitleProps> = ({ record }) =>
  record ? (
    <span>
      Recipe #{record.id} - {record.name}
    </span>
  ) : null;

export const RecipeEdit: React.FC<EditProps> = (props) => (
  <Edit
    title={<RecipeTitle />}
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
  </Edit>
);

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
