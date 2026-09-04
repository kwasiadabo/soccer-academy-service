declare const DECISION_VALUES: readonly ["APPROVED", "REJECTED", "CHANGES_REQUESTED"];
export declare class TrainingPlanDecisionDto {
    decision: (typeof DECISION_VALUES)[number];
    comments?: string;
}
export {};
