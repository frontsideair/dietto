declare module "react-pouchdb/browser" {
  export function useDB(db?: string | PouchDB.Database): PouchDB.Database;

  export function useGet<Model>(
    options: PouchDB.Core.GetOptions & { id: string }
  ): (PouchDB.Core.Document<Model> & PouchDB.Core.GetMeta) | null;
  export function useGet<Model>(
    db: PouchDB.Database,
    options: PouchDB.Core.GetOptions & { id: string }
  ): (PouchDB.Core.Document<Model> & PouchDB.Core.GetMeta) | null;

  export function useFind<Content extends {} = {}>(
    options?: PouchDB.Find.FindRequest<Content>
  ): Array<PouchDB.Core.ExistingDocument<Content>>;
  export function useFind<Content extends {} = {}>(
    db: PouchDB.Database,
    options?: PouchDB.Find.FindRequest<Content>
  ): Array<PouchDB.Core.ExistingDocument<Content>>;

  export function useAllDocs<Model>(
    options?:
      | Core.AllDocsWithKeyOptions
      | Core.AllDocsWithKeysOptions
      | Core.AllDocsWithinRangeOptions
      | Core.AllDocsOptions
  ): Core.AllDocsResponse<Content & Model>;

  export function PouchDB({ children: ReactElement, name: string }): null;
}
