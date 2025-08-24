import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export interface UserMedication {
  _id: string;
  userId: string;
  name: string;
  category?: 'corticosteroid' | 'androgen_testosterone' | 'lithium' | 'isoniazid' | 'phenytoin' | 'egfr_inhibitor' | 'b12_high_dose' | 'other';
  dose?: string;
  startedAt?: number;
  stoppedAt?: number;
  currentlyTaking: boolean;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export function useUserMedications() {
  const medications = useQuery(api.userMedications.getUserMedications);
  const addMedication = useMutation(api.userMedications.addMedication);
  const updateMedication = useMutation(api.userMedications.updateMedication);
  const deleteMedication = useMutation(api.userMedications.deleteMedication);

  const isLoading = medications === undefined;

  const addNewMedication = async (medicationData: Omit<UserMedication, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return await addMedication(medicationData);
  };

  const updateExistingMedication = async (medicationId: string, updateData: Partial<UserMedication>) => {
    return await updateMedication({
      medicationId: medicationId as any,
      ...updateData,
    });
  };

  const removeMedication = async (medicationId: string) => {
    return await deleteMedication({
      medicationId: medicationId as any,
    });
  };

  return {
    medications,
    isLoading,
    addMedication: addNewMedication,
    updateMedication: updateExistingMedication,
    deleteMedication: removeMedication,
  };
}
