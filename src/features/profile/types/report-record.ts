/** A row of the `student_reports` view (lexicon-web 0035): one of the
 *  student's own unit reports, without the teacher's notes on the test. */
export type ReportRecord = {
  id: string;
  module_id: string;
  module: string | null;
  unit: number;
  observations: string | null;
  /** `numeric(4,2)`, which PostgREST hands back as a string. */
  test_score: number | string | null;
  updated_at: string;
};
