export enum StateStatus {
  IDLE,
  PENDING,
  FULFILLED,
  REJECTED,
}

export interface BaseDescription {
  state: StateStatus;
}
