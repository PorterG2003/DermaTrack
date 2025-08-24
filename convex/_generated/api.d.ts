/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aiSummarization from "../aiSummarization.js";
import type * as auth from "../auth.js";
import type * as checkIns from "../checkIns.js";
import type * as http from "../http.js";
import type * as photos from "../photos.js";
import type * as testCheckins from "../testCheckins.js";
import type * as tests from "../tests.js";
import type * as userMedications from "../userMedications.js";
import type * as userProfiles from "../userProfiles.js";
import type * as userRoutineProducts from "../userRoutineProducts.js";
import type * as userSignals from "../userSignals.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiSummarization: typeof aiSummarization;
  auth: typeof auth;
  checkIns: typeof checkIns;
  http: typeof http;
  photos: typeof photos;
  testCheckins: typeof testCheckins;
  tests: typeof tests;
  userMedications: typeof userMedications;
  userProfiles: typeof userProfiles;
  userRoutineProducts: typeof userRoutineProducts;
  userSignals: typeof userSignals;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
