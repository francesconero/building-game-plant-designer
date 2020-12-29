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
  ReferenceArrayField,
} from "react-admin";
import { DryResourceFlow } from "./persistence/DryRecipe";
import { makeStyles } from "@material-ui/core/styles";

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

const useStyles = makeStyles(
  (theme) => ({
    link: {
      color: theme.palette.primary.main,
    },
  }),
  { name: "RaReferenceField" }
);

export const PlantList: React.FC<ListProps> = (props) => {
  const classes = useStyles();
  return (
    <List {...props} filters={<PlantFilter />}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <ArrayField source="targetResources">
          <SingleFieldList>
            <ResourceFlowField />
          </SingleFieldList>
        </ArrayField>
        <ReferenceArrayField
          label="Recipes"
          reference="recipes"
          source="recipes"
        >
          <SingleFieldList>
            <ChipField className={classes.link} source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
      </Datagrid>
    </List>
  );
};
