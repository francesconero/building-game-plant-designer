import { useState, useEffect } from "react";
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
  Loading,
  Error,
  useDataProvider,
  FieldProps,
} from "react-admin";
import _ from "lodash";
import { Tuple } from "../utils/tuples";
import { ResourceType } from "./domain/Resource";
import { DryRecipe } from "./persistence/DryRecipe";

import { Filter, SearchInput } from "react-admin";
import { Canvas, EdgeData, NodeData } from "reaflow";
import { DryBuilding } from "./persistence/DryBuilding";
import { DryResource } from "./persistence/DryResource";
import { useFormState } from "react-final-form";

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

class Graph {
  constructor(readonly nodes: NodeData[], readonly edges: EdgeData[]) {}
}

const GraphField: React.FC<FieldProps> = () => {
  const dataProvider = useDataProvider();
  const dryRecipe = useFormState().values as DryRecipe | undefined;
  const [graph, setGraph] = useState<Graph>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (dryRecipe) {
      Promise.all([
        dataProvider.getOne<DryBuilding>("buildings", {
          id: dryRecipe.building,
        }),
        dataProvider.getMany<DryResource>("resources", {
          ids: dryRecipe.inputs
            .filter(_.negate(_.isNil))
            .map((input) => input.resource),
        }),
        dataProvider.getMany<DryResource>("resources", {
          ids: dryRecipe.outputs
            .filter(_.negate(_.isNil))
            .map((output) => output.resource),
        }),
      ])
        .then(
          ([
            { data: dryBuilding },
            { data: inputResources },
            { data: outputResources },
          ]) => {
            const buildingNode: NodeData = {
              id: `building_${dryBuilding.id}`,
              text: dryBuilding.name,
            };
            const inputNodes: NodeData[] = inputResources.map((resource) => ({
              id: `input_${resource.id}`,
              text: resource.name,
            }));
            const outputNodes: NodeData[] = outputResources.map((resource) => ({
              id: `output_${resource.id}`,
              text: resource.name,
            }));
            const inputEdges: EdgeData[] = inputNodes.map((inputNode) => ({
              id: `${inputNode.id}->${buildingNode.id}`,
              from: inputNode.id,
              to: buildingNode.id,
            }));
            const outputEdges: EdgeData[] = outputNodes.map((outputNode) => ({
              id: `${buildingNode.id}->${outputNode.id}`,
              from: buildingNode.id,
              to: outputNode.id,
            }));
            const newGraph = new Graph(
              [buildingNode, ...inputNodes, ...outputNodes],
              [...inputEdges, ...outputEdges]
            );
            setGraph(newGraph);
            setLoading(false);
          }
        )
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [dataProvider, dryRecipe]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!graph) return null;
  return (
    <div style={{ position: "relative", height: 500, width: "100%" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Canvas
          fit={true}
          pannable={false}
          nodes={graph.nodes}
          edges={graph.edges}
        />
      </div>
    </div>
  );
};

export const RecipeEdit: React.FC<EditProps> = (props) => {
  return (
    <Edit
      title={<RecipeTitle />}
      {...props}
      transform={(data) =>
        data.id ? data : { ...data, id: _.camelCase(data.name) }
      }
    >
      <TabbedForm>
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
        <FormTab label="Design">
          <GraphField />
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
