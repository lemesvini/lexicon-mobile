/** What every block carries, whatever its type — lexicon-web's `BlockBase`
 *  (src/lib/lessons.ts). A student's material has its teacher-only blocks
 *  stripped at the top level, but not inside a container, so both are checked. */
export type BlockBase = {
  audience?: "teacher";
  advancedContext?: true;
};
