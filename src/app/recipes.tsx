import { useFormState } from "react-final-form";
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
  TabbedForm,
  FormTab,
  FieldProps,
} from "react-admin";
import _ from "lodash";
import { Tuple } from "../utils/tuples";
import { ResourceType } from "./domain/Resource";
import { DryRecipe } from "./persistence/DryRecipe";
import { useLocation } from "react-router-dom";

import { Filter, SearchInput } from "react-admin";
import RecipeGraph from "./view/recipe/RecipeGraph";
import { makeStyles } from "@material-ui/core/styles";
import { Location } from "history";

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

const GraphField: React.FC<FieldProps> = () => {
  const dryRecipe = useFormState().values as DryRecipe | undefined;
  return <RecipeGraph dryRecipe={dryRecipe} />;
};

const useStylesEdit = makeStyles(() => ({
  root: {
    display: "contents",
  },
  main: {
    flexDirection: "column",
    flex: 1,
  },
  card: {
    flex: 1,
    flexDirection: "column",
    display: "flex",
  },
}));

const useStylesForm = makeStyles(() => ({
  form: {
    display: "contents",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
}));

const useStyles = makeStyles(() => ({
  formTabContainer: {
    display: "contents",
  },
  graphField: {
    display: "contents",
  },
  form: {
    display: "contents",
  },
}));

function parseActiveTab(location: Location) {
  const parts = location.pathname.split("/");
  return parts[3];
}

export const RecipeEdit: React.FC<EditProps> = (props) => {
  const location = useLocation();
  const customClasses = useStyles();
  const editClasses = useStylesEdit();
  const tabbedFormClasses = useStylesForm();
  const activeTab = parseActiveTab(location);
  return (
    <Edit
      classes={activeTab === "design" ? editClasses : null}
      title={<RecipeTitle />}
      {...props}
      transform={(data) =>
        data.id ? data : { ...data, id: _.camelCase(data.name) }
      }
    >
      <TabbedForm
        className={activeTab === "design" ? customClasses.form : undefined}
        classes={activeTab === "design" ? tabbedFormClasses : null}
      >
        <FormTab label="Properties">
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
        </FormTab>
        <FormTab
          contentClassName={customClasses.formTabContainer}
          label="Design"
          path="design"
        >
          {activeTab === "design" ? (
            <GraphField
              formClassName={customClasses.graphField}
              source="design"
            />
          ) : undefined}
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

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
