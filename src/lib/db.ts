import Dexie, { type EntityTable } from "dexie";

interface IEligibilityList {
  id: string;
  userId: string;
  tokenAmount: number;
}

const db = new Dexie("zksync_eligibility_list") as Dexie & {
  eligibility_list: EntityTable<
    IEligibilityList,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1.1).stores({
  eligibility_list: "id, userId, tokenAmount", // primary key "id" (for the runtime!)
});

export type { IEligibilityList };
export { db };
