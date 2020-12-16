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
  SelectInput,
  required,
} from "react-admin";
import { ColorField, ColorInput } from "react-admin-color-input";
import _ from "lodash";
import { Resource, ResourceType, resourceTypes } from "./models/resource";

export const resourceTypeChoices = resourceTypes.map((t) => ({
  id: t,
  name: t,
}));

export const ResourceList: React.FC<ListProps> = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="type" />
      <ColorField source="color" />
      <EditButton />
    </Datagrid>
  </List>
);

interface ResourceTitleProps {
  record?: Resource<ResourceType>;
}

const ResourceTitle: React.FC<ResourceTitleProps> = ({ record }) =>
  record ? (
    <span>
      Resource #{record.id} - {record.name}
    </span>
  ) : null;

export const ResourceEdit: React.FC<EditProps> = (props) => (
  <Edit
    title={<ResourceTitle />}
    {...props}
    transform={(data) =>
      data.id ? data : { ...data, id: _.camelCase(data.name) }
    }
  >
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" validate={required()} />
      <SelectInput
        choices={resourceTypeChoices}
        source="type"
        validate={required()}
        defaultValue={"solid"}
      />
      <ColorInput source="color" defaultValue={"#000000"} />
    </SimpleForm>
  </Edit>
);

export const ResourceCreate: React.FC<CreateProps> = (props) => (
  <Create
    title="Create a Resource"
    {...props}
    transform={(data) =>
      data.id ? data : { ...data, id: _.camelCase(data.name) }
    }
  >
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" validate={required()} />
      <SelectInput
        choices={resourceTypeChoices}
        source="type"
        defaultValue={"solid"}
      />
      <ColorInput source="color" defaultValue={"#000000"} />
    </SimpleForm>
  </Create>
);
