import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export interface UserSignals {
  _id: string;
  userId: string;
  
  // Hormones & medical context
  sexAtBirth?: 'female' | 'male' | 'intersex' | 'unknown';
  menstruates?: boolean;
  cycleRegular?: boolean;
  preMenstrualFlareDays?: number;
  contraception?: 'none' | 'combined_ocp' | 'progestin_only' | 'hormonal_iud' | 'copper_iud' | 'implant' | 'ring' | 'patch' | 'other';
  pregnancyStatus?: 'none' | 'pregnant' | 'postpartum' | 'breastfeeding';
  pcosDiagnosed?: boolean;
  familyHistoryAcne?: boolean;

  // Distribution & symptom clues
  areasAffected?: ('forehead' | 'hairline' | 'temples' | 'cheeks' | 'jawline' | 'chin' | 'neck' | 'chest' | 'back' | 'shoulders')[];
  itchy?: boolean;
  allBumpsLookSame?: boolean;
  comedonesPresent?: boolean;

  // Skin-type signals
  middayShineTzone?: boolean;
  middayShineCheeks?: boolean;
  feelsTightAfterCleanse?: boolean;
  visibleFlakingDaysPerWeek?: number;
  blottingSheetsPerDay?: number;
  moisturizerReapplyPerDay?: number;
  stingsWithBasicMoisturizer?: boolean;
  historyOfEczemaOrDermatitis?: boolean;

  // Friction / heat / sweat
  maskHoursPerDay?: number;
  helmetHoursPerWeek?: number;
  chinstrapOrGearHoursPerWeek?: number;
  sweatyWorkoutsPerWeek?: number;
  showerSoonAfterSweat?: boolean;

  // Routine & product exposures
  waterTemp?: 'cool' | 'lukewarm' | 'hot';
  cleansesPerDay?: number;
  usesScrubsOrBrushes?: boolean;
  fragranceInSkincare?: boolean;
  fragranceInHaircare?: boolean;
  hairOilsOrPomades?: boolean;
  hairTouchesForehead?: boolean;
  usesMoisturizerDaily?: boolean;
  usesSunscreenDaily?: boolean;

  // Pillowcase-related
  pillowcaseChangesPerWeek?: number;
  laundryDetergentFragranced?: boolean;
  sleepWithLeaveInHairProducts?: boolean;

  // Diet levers
  sugaryDrinksPerDay?: number;
  whiteCarbServingsPerDay?: number;
  dairyServingsPerDay?: number;
  mostlySkimDairy?: boolean;
  wheyProteinUse?: boolean;

  // Medication trigger gate
  hasPotentialMedTrigger?: boolean;

  // Environment & lifestyle
  hotHumidExposure?: 'low' | 'medium' | 'high';
  saunaSteamSessionsPerWeek?: number;
  sleepHoursAvg?: number;
  stressNow_0to10?: number;

  // housekeeping
  createdAt: number;
  updatedAt: number;
}

export function useUserSignals() {  
  const signals = useQuery(api.userSignals.getUserSignals);
  const updateSignals = useMutation(api.userSignals.updateUserSignals);
  const storeSignals = useMutation(api.userSignals.storeUserSignals);

  const isLoading = signals === undefined;

  const updateSignalsData = async (data: Partial<UserSignals>) => {
    await updateSignals(data);
  };

  const ensureSignalsExist = async () => {
    await storeSignals({});
  };

  return {
    signals,
    isLoading,
    updateSignals: updateSignalsData,
    ensureSignalsExist,
  };
}
