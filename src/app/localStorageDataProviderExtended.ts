import localStorageDataProvider, {
  LocalStorageDataProviderParams,
} from "ra-data-local-storage";

import {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  Record,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
} from "react-admin";

class SwappableDataProvider implements DataProvider {
  constructor(public targetDataProvider: DataProvider) {}
  getList: <RecordType extends Record = Record>(
    resource: string,
    params: GetListParams
  ) => Promise<GetListResult<RecordType>> = (resource, params) => {
    return this.targetDataProvider.getList(resource, params);
  };
  getOne: <RecordType extends Record = Record>(
    resource: string,
    params: GetOneParams
  ) => Promise<GetOneResult<RecordType>> = (resource, params) => {
    return this.targetDataProvider.getOne(resource, params);
  };
  getMany: <RecordType extends Record = Record>(
    resource: string,
    params: GetManyParams
  ) => Promise<GetManyResult<RecordType>> = (resource, params) => {
    return this.targetDataProvider.getMany(resource, params);
  };
  getManyReference: <RecordType extends Record = Record>(
    resource: string,
    params: GetManyReferenceParams
  ) => Promise<GetManyReferenceResult<RecordType>> = (resource, params) => {
    return this.targetDataProvider.getManyReference(resource, params);
  };
  update: <RecordType extends Record = Record>(
    resource: string,
    params: UpdateParams
  ) => Promise<UpdateResult<RecordType>> = (resource, params) => {
    return this.targetDataProvider.update(resource, params);
  };
  updateMany: (
    resource: string,
    params: UpdateManyParams
  ) => Promise<UpdateManyResult> = (resource, params) => {
    return this.targetDataProvider.updateMany(resource, params);
  };
  create: <RecordType extends Record = Record>(
    resource: string,
    params: CreateParams
  ) => Promise<CreateResult<RecordType>> = (resource, params) => {
    return this.targetDataProvider.create(resource, params);
  };
  delete: <RecordType extends Record = Record>(
    resource: string,
    params: DeleteParams
  ) => Promise<DeleteResult<RecordType>> = (resource, params) => {
    return this.targetDataProvider.delete(resource, params);
  };
  deleteMany: (
    resource: string,
    params: DeleteManyParams
  ) => Promise<DeleteManyResult> = (resource, params) => {
    return this.targetDataProvider.deleteMany(resource, params);
  };
  [key: string]: any;
}

const localStorageDataProviderExtended = (
  params: LocalStorageDataProviderParams
): DataProvider => {
  const swappableDataProvider = new SwappableDataProvider(
    localStorageDataProvider(params)
  );
  return {
    ...swappableDataProvider,
    import: (db: any) => {
      localStorage.setItem(params.localStorageKey, JSON.stringify(db));
      swappableDataProvider.targetDataProvider = localStorageDataProvider(
        params
      );
      console.info("Successfully imported DB");
      return Promise.resolve({ data: db });
    },
    export: () => {
      const db = localStorage.getItem(params.localStorageKey);
      if (db) {
        return Promise.resolve({
          data: {
            db: JSON.parse(db),
            key: params.localStorageKey,
          },
        });
      } else {
        return Promise.resolve({ data: {} });
      }
    },
  };
};
export default localStorageDataProviderExtended;
