import { camelCase } from "lodash";
import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ListProps,
  FilterProps,
  Filter,
  SearchInput,
  ArrayField,
  SingleFieldList,
  ReferenceField,
  ChipField,
  ChipFieldProps,
  FieldProps,
  CreateProps,
  Create,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  required,
  NumberInput,
  minLength,
  AutocompleteInput,
} from "react-admin";
import { DryResourceFlow } from "./persistence/DryRecipe";

const PlantFilter: React.FC<Omit<FilterProps, "children">> = (props) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

const CustomLabelChipField: React.FC<
  ChipFieldProps & { renderLabel: (record: any) => string }
> = ({ record, renderLabel, ...rest }) => (
  <ChipField {...rest} record={{ id: renderLabel(record) }} source="id" />
);

const ResourceFlowField: React.FC<
  FieldProps<DryResourceFlow & { id: string }>
> = ({ record, ...rest }) => (
  <ReferenceField
    record={record}
    {...rest}
    source="resource"
    reference="resources"
    label="Input"
  >
    <CustomLabelChipField
      renderLabel={(innerRecord) => `${innerRecord.name} (${record?.flowRate})`}
    />
  </ReferenceField>
);

export const PlantList: React.FC<ListProps> = (props) => {
  return (
    <List {...props} filters={<PlantFilter />}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <ArrayField source="targetFlows">
          <SingleFieldList>
            <ResourceFlowField />
          </SingleFieldList>
        </ArrayField>
      </Datagrid>
    </List>
  );
};

export const PlantCreate: React.FC<CreateProps> = (props) => (
  <Create
    title="Create a Plant"
    {...props}
    transform={(data) =>
      data.id ? data : { ...data, id: camelCase(data.name) }
    }
  >
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" validate={required()} />
      <ArrayInput
        source="targetFlows"
        validate={[
          required(),
          minLength(1, "You must require at least one target resource"),
        ]}
      >
        <SimpleFormIterator>
          <ReferenceInput
            label="resource"
            source="resource"
            reference="resources"
            validate={required()}
          >
            <AutocompleteInput optionText="name" />
          </ReferenceInput>
          <NumberInput
            label="Amount per minute"
            source="flowRate"
            validate={required()}
          />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
