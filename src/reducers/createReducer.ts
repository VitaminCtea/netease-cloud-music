import * as constants from "constants/index";
import { hasOwnProperty } from "helper/index";

export const createReducer = (
  initialValue: any,
  constantsAction: constants.Action["type"]
) => (state: any = initialValue, action: constants.Action) => {
  let { type, ...payload } = action;
  let key: keyof constants.Params;
  for (key in payload as constants.Params) {
    if (hasOwnProperty(payload, key) && type === constantsAction) {
      return (payload as constants.Params)[key];
    }
  }
  return state;
};
