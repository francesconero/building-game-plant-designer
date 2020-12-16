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
} from "react-admin";
import _ from "lodash";
import { Building } from "./models/building";
import { ResourceType } from "./models/resource";
import { Tuple } from "../utils/tuples";
import { resourceTypeChoices } from "./resources";

export const BuildingList: React.FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="powerConsumption" />
      <EditButton />
    </Datagrid>
  </List>
);

interface BuildingTitleProps {
  record?: Building<Tuple<ResourceType, number>, Tuple<ResourceType, number>>;
}

const BuildingTitle: React.FC<BuildingTitleProps> = ({ record }) =>
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
