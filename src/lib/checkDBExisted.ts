import { db } from "@/lib/db";

export const checkDBExisted = async () => {
  try {
    const count = await db.eligibility_list.count();

    if (count >= 690716) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};
