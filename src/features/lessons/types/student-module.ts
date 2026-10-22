/** A module the student is in or has been through. */
export type StudentModule = {
  id: string;
  name: string;
  /** The one on their roster row — what they are taking now. */
  current: boolean;
  completed: boolean;
};
